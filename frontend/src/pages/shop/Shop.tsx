import { useEffect, useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { fetchGet } from "@/utils/fetchUtils";

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
    sold: boolean;
    exhibition_id: number | null;
};

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="w-full">
            <h1 className="text-2xl font-semibold mb-6">Clay Shop</h1>

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
                    {products.map((product) => (
                        <a key={product.id} href={`/products/${product.id}`}>
                            <ProductCard
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    seller:
                                        product.seller_name ||
                                        `Prodavač #${product.seller_id}`,
                                    price: `${product.price} €`,
                                    category:
                                        product.category ||
                                        product.product_category ||
                                        "Bez kategorije",
                                }}
                            />
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}