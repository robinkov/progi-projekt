import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import ProductCard from "@/components/shop/ProductCard";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchGet } from "@/utils/fetchUtils";

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

export default function SellerProducts() {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSellerProducts() {
      if (!id) return;
      try {
        const res = await fetchGet<{ success: boolean; products: Product[] }>(
          `/sellers/${id}/products`
        );
        setProducts(res.products ?? []);
      } catch (err) {
        console.error("Failed to load seller products", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadSellerProducts();
  }, [id]);

  return (
    <PageLayout>
      <MainColumn>
        <h1 className="text-2xl font-semibold mb-6">Ponuda prodavača</h1>

        {loading ? (
          <div className="p-12 text-center text-lg">Učitavanje proizvoda...</div>
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
                    author: `Prodavač #${product.seller_id}`,
                    price: `${product.price} €`,
                  }}
                />
              </a>
            ))}
          </div>
        )}
      </MainColumn>
    </PageLayout>
  );
}
