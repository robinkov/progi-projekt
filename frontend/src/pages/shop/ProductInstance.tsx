import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import { Logo, LogoImage, LogoFallback } from "@/components/ui/logo";
import { Banner, BannerImage, BannerFallback } from "@/components/ui/banner";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, ShieldAlert } from "lucide-react";
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAuth } from "@/components/context/AuthProvider";

type Product = {
  id: number;
  seller_id: number;
  category: string;
  price: number;
  name: string;
  description: string;
  photo_id: number | null;
  sold: boolean;
  exhibition_id: number | null;
};

type Organizer = {
  profile_name: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  approved_by_admin: boolean | null;
  membership_plan_id: number | null;
  membership_expiry_date: string | null;
  mail?: string | null;
  phone?: string | null;
  address?: string | null;
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const productRes = await fetchGet<{ success: boolean; product: Product }>(`/products/${id}`);

        setProduct(productRes.product);

        const sellerRes = await fetchGet<Organizer>(`/organizers/${productRes.product.seller_id}`);
        setSeller(sellerRes);

      } catch (err) {
        console.error("Failed to load product or seller", err);
        setError("Greška pri učitavanju proizvoda.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);


  if (loading) {
    return <div className="p-12 text-center text-lg">Učitavanje proizvoda...</div>;
  }

  if (!product) {
    return (
      <div className="p-12 text-center text-red-600 text-lg">Proizvod nije pronađen.</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* ---------- Left Column: Product Detail ---------- */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Product Detail Card */}
          <Card className="border-none shadow-xl overflow-hidden bg-card">
            <div className="bg-primary/5 p-8 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {product.category}
                  </Badge>
                  {product.sold ? (
                    <Badge variant="destructive" className="font-semibold">
                      Prodano
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50 font-semibold">
                      Dostupno
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
                  {product.name}
                </h1>

                <div className="flex flex-wrap gap-6 text-muted-foreground font-medium text-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Cijena</p>
                    <p className="text-lg font-semibold text-foreground">{product.price}€</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Status</p>
                    <p className="text-base font-medium text-foreground">{product.sold ? "Prodano" : "Dostupno"}</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[260px]">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center md:text-left mb-3">
                  Kupnja proizvoda
                </p>
                {product.sold ? (
                  <Button disabled className="w-full rounded-xl py-4 text-lg font-bold">Prodano</Button>
                ) : user?.role !== "polaznik" ? (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800 shadow-sm">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-bold text-left">
                      Samo polaznici smiju<br /> kupiti proizvod.
                    </p>
                  </div>
                ) : (
                  <PayPalScriptProvider options={{ clientId: "AVVlqKLPC4luvZ69cQTY3CD2AhNdY4DiycWRE75pry8u-X9oZFF0sF19JDvJ4pWqr-Cuni-0F0TWPbOE", currency: "EUR" }}>
                    <PayPalButtons
                      createOrder={async () => {
                        if (!product) throw new Error("No product");
                        const res = await fetchPost<{ id: string }>("/api/paypal/create-order", {
                          productId: product.id,
                        });
                        return res.id;
                      }}
                      onApprove={async (data) => {
                        try {
                          if (!product) return;
                          const res = await fetchPost<{ success: boolean }>("/api/paypal/capture-order", {
                            orderID: (data as any).orderID,
                            productId: product.id,
                          });
                          if (res.success) {
                            setPaymentSuccess(true);
                            setProduct((prev) => (prev ? { ...prev, sold: true } : prev));
                          } else {
                            setError("Plaćanje nije završeno.");
                          }
                        } catch (e) {
                          console.error(e);
                          setError("Greška pri potvrdi plaćanja.");
                        }
                      }}
                      onError={(err) => {
                        console.error(err);
                        setError("Plaćanje nije uspjelo. Pokušajte ponovno.");
                      }}
                    />
                  </PayPalScriptProvider>
                )}
                {paymentSuccess && (
                  <p className="mt-3 text-green-600 font-medium text-sm">Plaćanje uspješno! Proizvod je označen kao prodan.</p>
                )}
                {error && (
                  <p className="mt-3 text-red-600 font-medium text-sm">{error}</p>
                )}
              </div>
            </div>

            <CardContent className="p-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                  Opis proizvoda
                </h3>
                <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-wrap">
                  {product.description || "Opis će uskoro biti dostupan."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ---------- Right Column: Product Image ---------- */}
        <div className="w-full md:w-[360px] md:flex-shrink-0">
          <div className="w-full h-full min-h-[260px] rounded-2xl overflow-hidden border border-border bg-muted flex items-center justify-center text-muted-foreground text-sm">
            Slika proizvoda
          </div>
        </div>

      </div>

      {/* ---------- Seller Section (Full Width) ---------- */}
      {seller && (
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
            <h2 className="text-2xl font-bold text-foreground">O prodavaču</h2>
          </div>

          <Card className="border-border bg-card shadow-md overflow-hidden">
            <Banner className="h-40 md:h-48">
              {seller.banner_url ? (
                <BannerImage src={seller.banner_url} />
              ) : (
                <BannerFallback>No banner</BannerFallback>
              )}
            </Banner>

            <CardContent className="p-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                  <Logo className="w-24 h-24 md:w-28 md:h-28 border-4 border-background shadow-lg -mt-16 bg-background">
                    {seller.logo_url ? (
                      <LogoImage src={seller.logo_url} />
                    ) : (
                      <LogoFallback>{seller.profile_name?.[0] ?? "P"}</LogoFallback>
                    )}
                  </Logo>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    {seller.profile_name}
                  </h2>
                </div>

                {/* Contact Info Grid (like organizer) */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-2xl border border-border self-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">E-mail</p>
                    <a
                      href={seller.mail ? `mailto:${seller.mail}` : undefined}
                      className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
                    >
                      <Mail className="w-4 h-4" /> {seller.mail || "Nije navedeno"}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Telefon</p>
                    <p className="flex items-center gap-2 text-foreground font-medium">
                      <Phone className="w-4 h-4" /> {seller.phone || "Nije navedeno"}
                    </p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Adresa</p>
                    <p className="flex items-center gap-2 text-foreground font-medium">
                      <MapPin className="w-4 h-4" /> {seller.address || "Nije navedeno"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2 space-y-3">
                <h3 className="text-base font-semibold mb-1">Opis prodavača</h3>
                <p className="text-foreground/80 text-sm md:text-base">
                  {seller.description ?? "Opis će uskoro biti dostupan."}
                </p>

                <div className="pt-2">
                  <a href={`/sellers/${product.seller_id}/products`}>
                    <Button className="w-full md:w-auto">Ponuda prodavača</Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
