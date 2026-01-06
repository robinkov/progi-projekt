import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import { Logo, LogoImage, LogoFallback } from "@/components/ui/logo";
import { Banner, BannerImage, BannerFallback } from "@/components/ui/banner";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, ShieldAlert, Box, Coffee, CookingPot, Squircle, Star } from "lucide-react";
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAuth } from "@/components/context/AuthProvider";

const categoryMeta: Record<string, { Icon: React.ComponentType<any>; badgeClass: string; textClass?: string }> = {
  skulpture: { Icon: Box, badgeClass: "bg-rose-100 border-rose-200", textClass: "text-rose-800" },
  tanjuri: { Icon: Squircle, badgeClass: "bg-amber-100 border-amber-200", textClass: "text-amber-800" },
  zdjele: { Icon: CookingPot, badgeClass: "bg-green-100 border-green-200", textClass: "text-green-800" },
  salice: { Icon: Coffee, badgeClass: "bg-sky-100 border-sky-200", textClass: "text-sky-800" },
  other: { Icon: Star, badgeClass: "bg-muted/20 border-border", textClass: "text-foreground" },
};

const getMeta = (category?: string | null) => {
  if (!category) return categoryMeta.other;
  const key = category.toLowerCase();
  return (categoryMeta as any)[key] ?? categoryMeta.other;
};

type Product = {
  id: number;
  seller_id: number;
  category: string;
  price: number;
  name: string;
  description: string;
  photo: string | null;
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

type Review = {
  id: number;
  product_id: number;
  participant_id: number;
  rating: number;
  text: string | null;
  created_at: string;
  reviewer_name?: string | null;
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [newRating, setNewRating] = useState<number | null>(null);
  const [newText, setNewText] = useState("");

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const productRes = await fetchGet<{ success: boolean; product: Product }>(`/products/${id}`);
        setProduct(productRes.product);

        const sellerRes = await fetchGet<Organizer>(`/organizers/${productRes.product.seller_id}`);
        setSeller(sellerRes);

        const reviewsRes = await fetchGet<{ success: boolean; reviews: Review[] }>(
          `/products/${id}/reviews`
        );
        setReviews(reviewsRes.reviews ?? []);

        if (token && user?.role === "polaznik") {
          try {
            const eligibilityRes = await fetchGet<{
              success: boolean;
              can_review: boolean;
              already_reviewed: boolean;
            }>(`/products/${id}/reviews/eligibility`, {
              Authorization: `Bearer ${token}`,
            });

            setCanReview(eligibilityRes.can_review);
            setAlreadyReviewed(eligibilityRes.already_reviewed);
          } catch (e) {
            console.error("Failed to fetch review eligibility", e);
          }
        }

      } catch (err) {
        console.error("Failed to load product or seller", err);
        setError("Greška pri učitavanju proizvoda.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id, token, user?.role]);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!product || !token || !newRating) return;

    try {
      const res = await fetchPost<{ success: boolean; review: Review }>(
        `/products/${product.id}/reviews`,
        {
          rating: newRating,
          text: newText,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (res.success && res.review) {
        setReviews((prev) => [res.review, ...prev]);
        setCanReview(false);
        setAlreadyReviewed(true);
        setNewRating(null);
        setNewText("");
      }
    } catch (err) {
      console.error("Failed to submit review", err);
      setError("Greška pri slanju recenzije.");
    }
  }


  if (loading) {
    return <div className="p-12 text-center text-lg">Učitavanje proizvoda...</div>;
  }

  if (!product) {
    return (
      <div className="p-12 text-center text-red-600 text-lg">Proizvod nije pronađen.</div>
    );
  }

  return (
    <PayPalScriptProvider options={{ clientId: "ARXyr_WfSF1KmFDFtp6FUNOJvCXnalaf9yBXHyouQFozXdmUHolBhU0iTIyf_N565XP08BX8G58aSOwF", currency: "EUR" }}>
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* ---------- Left Column: Product Detail ---------- */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Product Detail Card */}
          <Card className="border-none shadow-xl overflow-hidden bg-card">
            <div className="bg-primary/5 p-8 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  { /* Category Badge */ }
                  {(() => {
                    const { Icon, badgeClass, textClass } = getMeta(product.category);
                    return (
                      <Badge className={`text-xs flex items-center gap-2 px-2 py-1 border ${badgeClass} ${textClass ?? ""}`}>
                        <Icon className="w-4 h-4" />
                        <span className="capitalize">{product.category ?? "Bez kategorije"}</span>
                      </Badge>
                    );
                  })()}
                  { /* Sold / Available Badge */ }
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
                          if (!token) {
                            setError("Niste prijavljeni ili je istekla sesija.");
                            return;
                          }
                          const res = await fetchPost<{ success: boolean }>(
                            "/api/paypal/capture-order",
                            {
                              orderID: data.orderID,
                              productId: product.id,
                            },
                            {
                              Authorization: `Bearer ${token}`,
                            }
                          );
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
        <div className="w-full md:w-[420px] md:flex-shrink-0">
          <div className="w-full rounded-2xl overflow-hidden border border-border bg-muted flex items-center justify-center text-muted-foreground text-sm">
            {product.photo ? (
              <img
                src={product.photo}
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-contain"
              />
            ) : (
              <div className="w-full h-[260px] flex items-center justify-center">
                <span>Slika proizvoda</span>
              </div>
            )}
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

      {/* ---------- Reviews Section ---------- */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
          <h2 className="text-2xl font-bold text-foreground">Recenzije proizvoda</h2>
        </div>

        {reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Još nema recenzija za ovaj proizvod.
          </p>
        )}

        {reviews.length > 0 && (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-border rounded-lg p-3 flex flex-col gap-1 bg-card"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">
                    {review.reviewer_name || "Kupac"}
                  </span>
                  <span className="text-amber-500 font-semibold">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                {review.text && (
                  <p className="text-sm text-foreground/80 mt-1">{review.text}</p>
                )}
                <span className="text-[10px] text-muted-foreground mt-1">
                  {new Date(review.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {user?.role === "polaznik" && canReview && (
          <form
            onSubmit={handleSubmitReview}
            className="mt-4 border border-dashed border-border rounded-lg p-4 space-y-3 bg-muted/40"
          >
            <h3 className="text-base font-semibold">Ostavi svoju recenziju</h3>
            <div className="flex items-center gap-3 text-sm">
              <label className="text-muted-foreground">Ocjena</label>
              <select
                value={newRating ?? ""}
                onChange={(e) =>
                  setNewRating(e.target.value ? Number(e.target.value) : null)
                }
                className="rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              >
                <option value="">Odaberi (1-5)</option>
                <option value={5}>5 - Odlično</option>
                <option value={4}>4</option>
                <option value={3}>3</option>
                <option value={2}>2</option>
                <option value={1}>1 - Loše</option>
              </select>
            </div>
            <div className="space-y-1 text-sm">
              <label className="text-muted-foreground">Komentar (opcionalno)</label>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                placeholder="Podijeli svoje iskustvo s ovim proizvodom..."
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="px-4 py-1 text-sm"
                disabled={!newRating}
              >
                Pošalji recenziju
              </Button>
            </div>
          </form>
        )}

        {user?.role === "polaznik" && alreadyReviewed && (
          <p className="text-xs text-muted-foreground">
            Već ste ostavili recenziju za ovaj proizvod.
          </p>
        )}

        {user && user.role !== "polaznik" && (
          <p className="text-xs text-muted-foreground">
            Samo polaznici koji su kupili ovaj proizvod mogu ostaviti recenziju.
          </p>
        )}
      </div>
    </div>
  </PayPalScriptProvider>
  );
}
