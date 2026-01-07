import React, { useEffect, useState } from "react";
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton, Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Package, Plus, CheckCircle2, AlertCircle, ImageIcon, X } from "lucide-react";
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import { supabase } from "@/config/supabase";

export default function AddProductForm() {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>("skulpture");
  const [allowed, setAllowed] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  // State za sliku - ista logika kao na Profile.tsx
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      try {
        const res = await fetchGet<{ success: boolean, allowed: boolean }>("/organizer/check-if-allowed", {
          Authorization: `Bearer ${data.session.access_token}`,
        });
        if (res.success) setAllowed(res.allowed);
      } catch (err) {
        console.error("Check failed", err);
      }
    }
    checkAccess();
  }, []);

  /* ---------------- Upload slike (Isto kao Profile handleAvatarUpload) ---------------- */
  async function handleImageUpload(file: File) {
    setUploading(true);
    setStatus(null);

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      setUploading(false);
      return;
    }

    const userId = sessionData.session.user.id;
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const filePath = `product_photos/${userId}_${timestamp}.${fileExt}`; // Stavili smo u podfolder radi preglednosti

    try {
      // Koristimo bucket "photos" koji ti radi
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      // Update preview instantly
      setImagePreview(urlData.publicUrl);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setStatus({ type: "error", message: "Neuspješan upload slike." });
    } finally {
      setUploading(false);
    }
  }

  /* ---------------- Spremanje cijelog proizvoda ---------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    setLoading(true);
    setStatus(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Niste prijavljeni.");

      const formData = new FormData(formElement);
      const productData = {
        name: formData.get("name"),
        price: parseFloat(formData.get("price") as string),
        description: formData.get("description"),
        quantity_left: parseInt(formData.get("quantity") as string),
        category: category,
        image_url: imagePreview, // Šaljemo URL koji je postavio handleImageUpload
      };

      await fetchPost("/add-product", productData, {
        Authorization: `Bearer ${token}`,
      });

      setStatus({ type: "success", message: "Proizvod je uspješno objavljen!" });
      formElement.reset();
      setImagePreview(null);
      setCategory("skulpture");

    } catch (error: any) {
      setStatus({ type: "error", message: error.message || "Greška pri spremanju." });
    } finally {
      setLoading(false);
    }
  };

  if (!allowed) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-destructive font-medium animate-bounce">Trebate imati odobren profil i plaćenu pretplatu kako bi organizirali događaj.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-left">
      <Card className="shadow-lg border-muted">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Dodaj novi rad</CardTitle>
          <CardDescription>Učitajte sliku i unesite detalje o proizvodu.</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            
            {/* Foto upload dio */}
            <div className="space-y-3">
              <Label className="font-semibold">Slika proizvoda</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 bg-muted/5 min-h-[200px]">
                {imagePreview ? (
                  <div className="relative w-full h-64">
                    <img src={imagePreview} className="w-full h-full object-cover rounded-lg" alt="Preview" />
                    <Button 
                      variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full h-8 w-8"
                      onClick={() => setImagePreview(null)}
                      type="button"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="size-10 text-muted-foreground mb-3" />
                    <input
                      type="file"
                      accept="image/*"
                      id="product-photo-upload"
                      className="hidden"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                    />
                    <Button
                      variant="outline"
                      type="button"
                      disabled={uploading}
                      onClick={() => document.getElementById("product-photo-upload")?.click()}
                    >
                      {uploading ? "Učitavanje..." : "Odaberi sliku"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="name">Naziv proizvoda</Label>
                <Input name="name" id="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Cijena (€)</Label>
                <Input name="price" id="price" type="number" step="0.01" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Kategorija</Label>
              <ToggleGroup type="single" variant="outline" value={category} onValueChange={(v) => v && setCategory(v)} className="justify-start">
                <ToggleGroupItem value="skulpture" className="cursor-pointer">Skulpture</ToggleGroupItem>
                <ToggleGroupItem value="tanjuri" className="cursor-pointer">Tanjuri</ToggleGroupItem>
                <ToggleGroupItem value="zdjele" className="cursor-pointer">Zdjele</ToggleGroupItem>
                <ToggleGroupItem value="salice" className="cursor-pointer">Šalice</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opis</Label>
              <Textarea name="description" id="description" className="min-h-24" />
            </div>

            <div className="w-1/3 space-y-2">
              <Label htmlFor="quantity">Količina</Label>
              <Input name="quantity" id="quantity" type="number" min="1" defaultValue="1" required />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t pt-6">
            {status && (
              <div className={`w-full p-3 rounded-md text-sm ${status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {status.message}
              </div>
            )}
            <div className="flex w-full justify-end gap-2">
              <Button variant="ghost" type="button" onClick={() => window.history.back()}>Odustani</Button>
              <LoadingButton loading={loading} disabled={uploading} type="submit" className="px-8">
                Objavi proizvod
              </LoadingButton>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}