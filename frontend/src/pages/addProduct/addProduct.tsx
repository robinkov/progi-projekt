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
import { Package, Plus, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import { supabase } from "@/config/supabase";

export default function AddProductForm() {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>("skulpture");
  const [allowed, setAllowed] = useState(false)
  // Dodajemo state za povratnu informaciju korisniku
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function fetchData() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      try {
        const res = await fetchGet<{ success: true, allowed: boolean }>("/organizer/check-if-allowed", {
          Authorization: `Bearer ${data.session.access_token}`,
        });
  
        if (res.success) {
          setAllowed(res.allowed)
        }
      } catch (err) {
        console.error("Failed to check if allowed", err);
      } finally {
        setLoading(false);
      }
    }
  
    useEffect(() => {
      fetchData();
    }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    setLoading(true);
    setStatus(null); // Resetiraj status kod novog slanja

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setStatus({ type: "error", message: "Niste prijavljeni. Molimo prijavite se ponovno." });
        setLoading(false);
        return;
      }

      const formData = new FormData(formElement);
      const productData = {
        name: formData.get("name"),
        price: parseFloat(formData.get("price") as string),
        description: formData.get("description"),
        quantity_left: parseInt(formData.get("quantity") as string),
        category: category,
      };

      await fetchPost("/add-product", productData, {
        Authorization: `Bearer ${token}`,
      });

      setStatus({ type: "success", message: "Proizvod je uspješno objavljen!" });
      formElement.reset();
      setCategory("skulpture");

    } catch (error: any) {
      console.error("Greška:", error);
      setStatus({ 
        type: "error", 
        message: error.message || "Došlo je do pogreške pri spremanju proizvoda." 
      });
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
    <div className="max-w-2xl mx-auto py-10 px-4 text-left font-sans">
      <Card className="border-border shadow-md bg-card overflow-hidden">
        <CardHeader className="bg-muted/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Package className="size-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif tracking-tight">Novi proizvod</CardTitle>
              <CardDescription className="text-sm">Unesite detalje o svom unikatnom radu.</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <Separator />

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Naziv rada</Label>
                <Input name="name" id="name" placeholder="npr. Keramička vaza 'Sunce'" required className="bg-transparent" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold">Cijena</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                  <Input name="price" id="price" type="number" step="0.01" className="pl-7" placeholder="0.00" required />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Kategorija</Label>
              <ToggleGroup 
                type="single" 
                variant="outline" 
                value={category}
                onValueChange={(val) => val && setCategory(val)}
                className="justify-start flex-wrap"
              >
                <ToggleGroupItem value="skulpture" className="px-4 cursor-pointer">Skulpture</ToggleGroupItem>
                <ToggleGroupItem value="tanjuri" className="px-4 cursor-pointer" >Tanjuri</ToggleGroupItem>
                <ToggleGroupItem value="zdjele" className="px-4 cursor-pointer">Zdjele</ToggleGroupItem>
                <ToggleGroupItem value="salice" className="px-4 cursor-pointer">Šalice</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">Opis proizvoda</Label>
              <Textarea name="description" id="description" placeholder="Materijali, dimenzije..." className="min-h-32 resize-none" />
            </div>

            <div className="space-y-2 w-full md:w-1/3 mb-5">
              <Label htmlFor="quantity" className="text-sm font-semibold">Dostupna količina</Label>
              <Input name="quantity" id="quantity" type="number" min="1" placeholder="1" required />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t bg-muted/5 py-6 px-6">
            
            {/* Dinamički prikaz poruke o statusu */}
            {status && (
              <div className={`w-full flex items-center gap-3 p-3 rounded-lg border text-sm transition-all animate-in fade-in slide-in-from-bottom-2 ${
                status.type === "success" 
                ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400" 
                : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
              }`}>
                {status.type === "success" ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
                <p className="font-medium">{status.message}</p>
              </div>
            )}

            <div className="flex w-full justify-end gap-3">
              <Button 
                variant="ghost" 
                type="button" 
                onClick={() => window.history.back()}
                className="hover:bg-background"
                disabled={loading}
              >
                Odustani
              </Button>
              <LoadingButton 
                type="submit" 
                loading={loading} 
                className="min-w-44 shadow-lg shadow-primary/20"
              >
                {!loading && <Plus className="mr-2 size-4" />}
                Spremi proizvod
              </LoadingButton>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}