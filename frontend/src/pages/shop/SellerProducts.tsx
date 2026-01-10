import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductCard from "@/components/shop/ProductCard";
import { fetchGet } from "@/utils/fetchUtils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Logo, LogoImage, LogoFallback } from "@/components/ui/logo";
import { Box, Coffee, CookingPot, Squircle, Mail, Phone, MapPin } from "lucide-react";

type Product = {
  id: number;
  seller_id: number;
  seller_name?: string | null;
  category?: string | null;
  product_category?: string | null;
  price: number;
  name: string;
  description: string;
  photo_id: number | null;
  /**
   * Broj preostalih komada. Ako je 0 ili manje, proizvod je rasprodan.
   */
  quantity_left: number;
  /**
   * True ako je proizvod barem jednom prodan.
   */
  sold_at_least_once?: boolean | null;
  /**
   * Dodano iz backenda: broj recenzija.
   */
  review_count?: number;
  /**
   * Dodano iz backenda: ima li proizvod barem jednu recenziju.
   */
  has_reviews?: boolean;
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

export default function SellerProducts() {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seller, setSeller] = useState<Organizer | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  // Filter "recenzije" – prikazuje samo proizvode koji imaju ostavljene recenzije
  const [showReviewedOnly, setShowReviewedOnly] = useState<boolean>(false);
  // Filter "prodano" – umjesto dostupnih prikazuje proizvode koji su rasprodani (quantity_left === 0)
  const [showSoldOnly, setShowSoldOnly] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<"price-asc" | "price-desc" | "">("");

  useEffect(() => {
    async function loadSellerData() {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const [organizerRes, productsRes] = await Promise.all([
          fetchGet<Organizer>(`/organizers/${id}`),
          fetchGet<{ success: boolean; products: Product[] }>(
            `/sellers/${id}/products`
          ),
        ]);

        setSeller(organizerRes ?? null);
        setProducts(productsRes.products ?? []);
      } catch (err) {
        console.error("Failed to load seller products", err);
        setError("Greška pri učitavanju proizvoda prodavača.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadSellerData();
  }, [id]);

  const filteredProducts = products.filter((product) => {
    const cat = (product.category || product.product_category || "").toLowerCase();
    if (categoryFilter.length > 0 && !categoryFilter.includes(cat)) {
      return false;
    }

    // Filtriranje po dostupnosti / prodanosti
    // Ako je uključen filter "prodano", prikazujemo samo rasprodane proizvode (quantity_left === 0).
    // Inače prikazujemo samo dostupne proizvode (quantity_left > 0).
    if (showSoldOnly) {
      if (product.quantity_left !== 0) {
        return false;
      }
    } else {
      if (product.quantity_left <= 0) {
        return false;
      }
    }

    // Ako je uključen filter "recenzije", prikazujemo samo proizvode s recenzijama
    if (showReviewedOnly) {
      const reviewCount = product.review_count ?? 0;
      const hasReviews = product.has_reviews ?? reviewCount > 0;
      if (!hasReviews) {
        return false;
      }
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "price-asc") {
      return a.price - b.price;
    }
    if (sortOrder === "price-desc") {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <h1 className="text-2xl font-semibold">Ponuda prodavača</h1>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
          <ToggleGroup
            type="multiple"
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value as string[])}
            variant="outline"
            size="sm"
            spacing={2}
            aria-label="Filter proizvoda po kategoriji"
          >
            <ToggleGroupItem
              value="skulpture"
              aria-label="Filtriraj skulpture"
              className="gap-2 data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-rose-500 data-[state=on]:*:[svg]:stroke-rose-500 data-[state=on]:text-rose-700"
            >
              <Box className="w-4 h-4" /> Skulpture
            </ToggleGroupItem>
            <ToggleGroupItem
              value="tanjuri"
              aria-label="Filtriraj tanjure"
              className="gap-2 data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-amber-500 data-[state=on]:*:[svg]:stroke-amber-500 data-[state=on]:text-amber-700"
            >
              <Squircle className="w-4 h-4" /> Tanjuri
            </ToggleGroupItem>
            <ToggleGroupItem
              value="zdjele"
              aria-label="Filtriraj zdjele"
              className="gap-2 data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-green-500 data-[state=on]:*:[svg]:stroke-green-500 data-[state=on]:text-green-700"
            >
              <CookingPot className="w-4 h-4" /> Zdjele
            </ToggleGroupItem>
            <ToggleGroupItem
              value="salice"
              aria-label="Filtriraj šalice"
              className="gap-2 data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-sky-500 data-[state=on]:*:[svg]:stroke-sky-500 data-[state=on]:text-sky-700"
            >
              <Coffee className="w-4 h-4" /> Šalice
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Sortiraj</span>
              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(
                    e.target.value as "price-asc" | "price-desc" | ""
                  )
                }
                className="rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Bez sortiranja</option>
                <option value="price-asc">Cijena: najmanja prvo</option>
                <option value="price-desc">Cijena: najveća prvo</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">recenzije</span>
              <Switch
                checked={showReviewedOnly}
                onCheckedChange={(v) => setShowReviewedOnly(!!v)}
                aria-label="Prikaži samo proizvode s recenzijama"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">prodano</span>
              <Switch
                checked={showSoldOnly}
                onCheckedChange={(v) => setShowSoldOnly(!!v)}
                aria-label="Prikaži samo prodane proizvode"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-lg">Učitavanje proizvoda...</div>
      ) : error ? (
        <div className="p-12 text-center text-red-600 text-lg">{error}</div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground text-lg">
          Nema dostupnih proizvoda.
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 pt-4">
          <div className="flex-1 flex flex-wrap gap-4">
            {sortedProducts.map((product) => (
              <a key={product.id} href={`/products/${product.id}`}>
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    seller:
                      product.seller_name ||
                      seller?.profile_name ||
                      `anonimni prodavač ${product.seller_id}`,
                    price: `${product.price} €`,
                    category:
                      product.category ||
                      product.product_category ||
                      "nedefinirano",
                  }}
                />
              </a>
            ))}
          </div>

          {seller && (
            <div className="w-full lg:w-64 lg:shrink-0">
              <Card className="bg-card border border-border shadow-sm flex items-center justify-center">
                <CardContent className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <Logo className="w-12 h-12 border bg-background">
                      {seller.logo_url ? (
                        <LogoImage src={seller.logo_url} />
                      ) : (
                        <LogoFallback>
                          {seller.profile_name?.[0] ?? "P"}
                        </LogoFallback>
                      )}
                    </Logo>
                    <div className="flex flex-col">
                      <span className="text-xs uppercase text-muted-foreground tracking-widest">
                        Prodavač
                      </span>
                      <span className="text-sm font-semibold">
                        {seller.profile_name ?? "Nepoznati prodavač"}
                      </span>
                    </div>
                  </div>

                  {seller.description && (
                    <p className="text-sm text-muted-foreground">
                      {seller.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{seller.mail || "Nije navedeno"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{seller.phone || "Nije navedeno"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{seller.address || "Nije navedeno"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
