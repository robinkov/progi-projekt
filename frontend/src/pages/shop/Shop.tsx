import { useEffect, useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { fetchGet } from "@/utils/fetchUtils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Box, Coffee, CookingPot, Squircle } from "lucide-react";

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
    sold: boolean | null;
    exhibition_id: number | null;
};

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [showSoldOnly, setShowSoldOnly] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<"price-asc" | "price-desc" | "">("");

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await fetchGet<{ success: boolean; products: Product[] }>(
                    "/products"
                );
                setProducts(res.products ?? []);
            } catch (err) {
                console.error("Failed to load products", err);
                setError("Greška pri učitavanju proizvoda.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    const filteredProducts = products.filter((product) => {
        const cat = (product.category || product.product_category || "").toLowerCase();

        if (categoryFilter.length > 0 && !categoryFilter.includes(cat)) {
            return false;
        }

        if (minPrice !== null && product.price < minPrice) {
            return false;
        }

        if (maxPrice !== null && product.price > maxPrice) {
            return false;
        }

        if (showSoldOnly && product.sold !== true) {
            return false;
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
                <h1 className="text-2xl font-semibold">Clay Shop</h1>

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
                        <input
                            type="number"
                            min={0}
                            step={10}
                            value={minPrice ?? ""}
                            onChange={(e) =>
                                setMinPrice(e.target.value ? Number(e.target.value) : null)
                            }
                            placeholder="Min €"
                            className="w-20 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            min={0}
                            step={10}
                            value={maxPrice ?? ""}
                            onChange={(e) =>
                                setMaxPrice(e.target.value ? Number(e.target.value) : null)
                            }
                            placeholder="Max €"
                            className="w-20 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setMinPrice(null);
                                setMaxPrice(null);
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Reset cijene
                        </button>
                        <Separator orientation="vertical" className="h-6" />

                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">Sortiraj</span>
                            <select
                                value={sortOrder}
                                onChange={(e) =>
                                    setSortOrder(e.target.value as "price-asc" | "price-desc" | "")
                                }
                                className="rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="">Bez sortiranja</option>
                                <option value="price-asc">Cijena: najmanja prvo</option>
                                <option value="price-desc">Cijena: najveća prvo</option>
                            </select>
                        </div>

                        <Separator orientation="vertical" className="h-6" />

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
                <div className="p-12 text-center text-lg">
                    Učitavanje proizvoda...
                </div>
            ) : error ? (
                <div className="p-12 text-center text-red-600 text-lg">{error}</div>
            ) : products.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground text-lg">
                    Nema dostupnih proizvoda.
                </div>
            ) : (
                <div className="flex flex-wrap gap-4 pt-4">
                    {sortedProducts.map((product) => (
                        <a key={product.id} href={`/products/${product.id}`}>
                            <ProductCard
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    seller:
                                        product.seller_name ||
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
            )}
        </div>
    );
}