import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/button";
import { supabase } from "@/config/supabase";
import { fetchPost, fetchGet } from "@/utils/fetchUtils";
import { Loader2, Package, CheckCircle2, Search, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/* ---------------- Types ---------------- */

type ExhibitionForm = {
  title: string;
  date_time: string;
  location: string;
  description: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  photo_url: string;
};

/* ---------------- Component ---------------- */

export default function CreateExhibition() {
  const [form, setForm] = useState<ExhibitionForm>({
    title: "",
    date_time: "",
    location: "",
    description: "",
  });

  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAllowed() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;

        const res = await fetchGet<{ success: boolean; allowed: boolean }>("/organizer/check-if-allowed", {
          Authorization: `Bearer ${data.session.access_token}`,
        });

        if (res.success) {
          setAllowed(res.allowed);
          if (res.allowed) {
            loadOrganizerProducts(data.session.access_token);
          }
        }
      } catch (err) {
        console.error("Failed to check permission", err);
      } finally {
        setLoading(false);
      }
    }

    async function loadOrganizerProducts(token: string) {
      try {
        const res = await fetchGet<{ success: boolean; products: Product[] }>(
          "/products/my",
          { Authorization: `Bearer ${token}` }
        );
        if (res.success) {
          setMyProducts(res.products);
        }
      } catch (err) {
        console.error("Greška pri dohvaćanju proizvoda", err);
      } finally {
        setLoadingProducts(false);
      }
    }

    checkAllowed();
  }, []);

  const toggleProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCreate = async () => {
    setSaving(true);
    setError(null);
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      await fetchPost(
        "/exhibitions",
        { ...form, product_ids: selectedProducts },
        { Authorization: `Bearer ${data.session.access_token}` }
      );
      setSuccess(true);
    } catch (err) {
      setError("Neuspjelo kreiranje izložbe.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium animate-pulse">Provjeramo smijete li objavljivati izložbe</p>
    </div>
  );

  if (!allowed) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4">
        <Card className="border-none bg-muted/40 shadow-inner">
          <CardContent className="py-10 flex flex-col items-center text-center space-y-4">
            <div className="bg-background p-4 rounded-full shadow-sm border border-border">
              <Info className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Pristup odbijen</h3>
              <p className="text-muted-foreground">
                Samo odobreni organizatori s aktivnim članstvom mogu kreirati nove izložbe.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Nova Izložba</h1>
        <p className="text-muted-foreground">Popunite detalje i odaberite proizvode koje želite izložiti.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1">
                <Label>Naziv izložbe</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="npr. Proljetna Revija 2024"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <Label>Vrijeme održavanja</Label>
                  <Input
                    type="datetime-local"
                    value={form.date_time}
                    onChange={(e) => setForm({ ...form, date_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Lokacija</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Grad, ulica ili naziv prostora"
                />
              </div>

              <div className="space-y-1">
                <Label>Opis izložbe</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="h-20"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Vaši Proizvodi
                  </CardTitle>
                  <CardDescription>Odaberite artikle koji će biti prikazani na ovoj izložbi.</CardDescription>
                </div>
                <Badge variant="secondary">{selectedProducts.length} odabrano</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loadingProducts ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
              ) : myProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {myProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => toggleProduct(product.id)}
                      className={`relative group cursor-pointer rounded-xl border-2 transition-all overflow-hidden ${selectedProducts.includes(product.id)
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-muted-foreground/30 bg-muted/30"
                        }`}
                    >
                      <img
                        src={product.photo_url}
                        alt={product.name}
                        className="aspect-square object-cover w-full group-hover:scale-105 transition-transform"
                      />
                      <div className="p-2 bg-background/90 backdrop-blur-sm absolute bottom-0 w-full border-t">
                        <p className="text-xs font-bold truncate">{product.name}</p>
                      </div>
                      {selectedProducts.includes(product.id) && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5 shadow-lg">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed">
                  <p className="text-sm text-muted-foreground">Niste još objavili nijedan proizvod.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24 bg-primary/5 border-primary/20">
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-bold text-lg">Sažetak</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Odabrano proizvoda:</span>
                  <span className="text-foreground font-bold">{selectedProducts.length}</span>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground italic">
                  * Klikom na gumb potvrđujete kreiranje javne izložbe.
                </p>
              </div>

              {error && <p className="text-xs text-destructive font-medium">{error}</p>}
              {success && <p className="text-xs text-green-600 font-medium font-bold">Izložba uspješno kreirana!</p>}

              <LoadingButton
                loading={saving}
                onClick={handleCreate}
                disabled={!form.title || !form.date_time || success}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-lg transition-all"
              >
                Kreiraj Izložbu
              </LoadingButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}