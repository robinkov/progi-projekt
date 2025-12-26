import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router";
import { Logo, LogoImage, LogoFallback } from "@/components/ui/logo";
import { Banner, BannerImage, BannerFallback } from "@/components/ui/banner";
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import { supabase } from "@/config/supabase";
import { useEffect, useState } from "react";

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
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const productRes = await fetchGet<{ success: boolean; product: Product }>(
          `/products/${id}`
        );

        setProduct(productRes.product);

        const sellerRes = await fetchGet<Organizer>(
          `/organizers/${productRes.product.seller_id}`
        );
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

  async function handleBuy() {
    if (!product || product.sold) return;

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      navigate("/auth", { replace: true });
      return;
    }
    var response
    try {
      setBuying(true);
      response = await fetchPost(
        `/products/${product.id}/checkout`,
        {},
        { Authorization: `Bearer ${data.session.access_token}` }
      );

      // Fallback: navigate to placeholder checkout route if backend isn't ready
      navigate(`/shop/checkout/${product.id}`);
    } catch (err) {
      console.error(err);
      setError("Naplata trenutno nije dostupna.");
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-lg">Učitavanje proizvoda...</div>;
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="p-12 text-center text-red-600 text-lg">
          Proizvod nije pronađen.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="w-full max-w-[1500px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">

        {/* ---------- Product Card ---------- */}
        <Card className="flex-1 rounded-3xl shadow-2xl hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-10 space-y-8">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            {product.description && (
              <p className="text-gray-700 text-lg">{product.description}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm md:text-base">
              <div>
                <span className="font-semibold text-gray-800">Cijena</span>
                <p className="mt-1">{product.price}€</p>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Dostupnost</span>
                <p className="mt-1">{product.sold ? "Prodano" : "Dostupno"}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Kategorija</span>
                <p className="mt-1">{product.category}</p>
              </div>
            </div>

            <div className="pt-6">
              <Button
                onClick={handleBuy}
                disabled={product.sold || buying}
                className="w-full"
              >
                {product.sold ? "PRODANO" : buying ? "Kupujem..." : "KUPI"}
              </Button>
              {error && (
                <p className="mt-3 text-red-600 font-medium text-sm">{error}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ---------- Organizer Card (Seller) ---------- */}
        {seller && (
        <Card className="flex-1 rounded-3xl shadow-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
          
          <CardContent className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Profil prodavača</h1>
            <Banner className="h-48 md:h-56">
              {seller.banner_url ? (<BannerImage src={seller.banner_url} />) : (<BannerFallback>No banner</BannerFallback>)}
            </Banner>
            <div className="flex items-center gap-5">
              <Logo className="w-24 h-24 md:w-28 md:h-28">
                {seller.logo_url ? (<LogoImage src={seller.logo_url} />) : (<LogoFallback>{seller.profile_name?.[0] ?? "P"}</LogoFallback>)}
              </Logo>

              <div>
                <h2 className="text-2xl font-bold">{seller.profile_name}</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  {seller.approved_by_admin ? "Verified seller" : "Pending verification"}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold">Opis prodavača:</h3>
            <p className="text-gray-700 text-base">{seller.description ?? "Opis će uskoro biti dostupan."}</p>

            <div className="pt-2">
              <a href={`/sellers/${product.seller_id}/products`}>
                <Button className="w-full">Ponuda prodavača</Button>
              </a>
            </div>
          </CardContent>

        </Card>
        )}

      </div>
    </PageLayout>
  );
}
