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
  const [initialLoading, setInitialLoading] = useState(true);
  const [category, setCategory] = useState<string>("skulpture");
  const [allowed, setAllowed] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  // States za sliku (identično kao u profilu)
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setInitialLoading(false);
        return;
      }
      try {
        const res = await fetchGet<{ success: boolean, allowed: boolean }>("/organizer/check-if-allowed", {
          Authorization: `Bearer ${data.session.access_token}`,
        });
        if (res.success) setAllowed(res.allowed);
      } catch (err) {
        console.error("Access check failed", err);
      } finally {
        setInitialLoading(false);
      }
    }
    checkAccess();
  }, []);

  /* ---------------- Logika za Upload Slike (Kao u Profilu) ---------------- */
  async function handleImageUpload(file: File) {
    setUploading(true);
    setStatus(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) return;

      const userId = sessionData.session.user.id;
      const timestamp = Date.now();
      const fileExt = file.name.split(".").pop();
      const filePath = `products/${userId}_${timestamp}.${fileExt}`;

      // Upload u bucket "product-images"
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      // Dobivanje javnog URL-a
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setImagePreview(urlData.publicUrl);
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      setStatus({ type: "error", message: "Greška pri prijenosu slike." });
    } finally {
      setUploading(false);
    }
  }

  /* ---------------- Logika za Spremanje Proizvoda ---------------- */
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
        image_url: imagePreview, // Šaljemo URL koji smo dobili iz handleImageUpload
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

  if (initialLoading) return <div className="py-20 text-center">Provjera...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-left font-sans">
      <Card className="border-border shadow-xl bg-card overflow-hidden">
        <CardHeader className="bg-muted/10 pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Package className="size-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif">Novi proizvod</CardTitle>
              <CardDescription>Objavite svoj rad u katalogu.</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-8 space-y-8">
            
            {/* Foto Sekcija (Stil kao u profilu, ali veći okvir) */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                Slika proizvoda
              </Label>
              <div className="relative group border-2 border-dashed border-muted-foreground/20 rounded-2xl overflow-hidden bg-muted/5 min-h-[250px] flex items-center justify-center">
                {imagePreview ? (
                  <div className="relative w-full h-[300px]">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <Button 
                      variant="destructive" size="icon" className="absolute top-4 right-4 rounded-full shadow-lg"
                      onClick={() => setImagePreview(null)}
                      type="button"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-10">
                    <ImageIcon className="size-12 text-muted-foreground mx-auto mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      id="product-upload"
                      className="hidden"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                    />
                    <Button
                      variant="outline"
                      disabled={uploading}
                      type="button"
                      onClick={() => document.getElementById("product-upload")?.click()}
                    >
                      {uploading ? "Prijenos..." : "Odaberi fotografiju"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Ostatak forme (Name, Price, Category, Description) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3 space-y-2">
                <Label htmlFor="name">Naziv artikla</Label>
                <Input name="name" id="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Cijena (€)</Label>
                <Input name="price" id="price" type="number" step="0.01" required />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Kategorija</Label>
              <ToggleGroup type="single" variant="outline" value={category} onValueChange={(v) => v && setCategory(v)} className="justify-start">
                <ToggleGroupItem value="skulpture" className="cursor-pointer">Skulpture</ToggleGroupItem>
                <ToggleGroupItem value="tanjuri" className="cursor-pointer">Tanjuri</ToggleGroupItem>
                <ToggleGroupItem value="zdjele" className="cursor-pointer">Zdjele</ToggleGroupItem>
                <ToggleGroupItem value="salice" className="cursor-pointer">Šalice</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opis i detalji</Label>
              <Textarea name="description" id="description" className="min-h-[120px] resize-none" />
            </div>

            <div className="space-y-2 w-full md:w-1/3">
              <Label htmlFor="quantity">Dostupna količina</Label>
              <Input name="quantity" id="quantity" type="number" min="1" defaultValue="1" required />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t bg-muted/5 py-8 px-8">
            {status && (
              <div className={`w-full flex items-center gap-3 p-4 rounded-xl border text-sm ${
                status.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-600" : "bg-red-500/10 border-red-500/20 text-red-600"
              }`}>
                {status.type === "success" ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
                <p className="font-semibold">{status.message}</p>
              </div>
            )}
            <div className="flex w-full justify-end gap-3">
              <Button variant="ghost" type="button" onClick={() => window.history.back()}>Odustani</Button>
              <LoadingButton 
                type="submit" 
                loading={loading} 
                disabled={uploading} // Onemogući spremanje dok slika traje
                className="min-w-[180px]"
              >
                {!loading && <Plus className="mr-2 size-5" />} Spremi rad
              </LoadingButton>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}