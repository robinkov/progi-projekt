import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import ProductCard from "./../../components/shop/ProductCard";
import { products } from "./productsData";



export default function Products() {
    return (
        <PageLayout>
            <MainColumn>
                {/* Page title */}
                <h1 className="text-2xl font-semibold mb-6">
                    Clay Shop
                </h1>

                {/* Products grid */}
                <div className="flex flex-wrap gap-4 pt-4">
                    {products.map((product) => (
                        <a href={"/products/" + product.id}>
                            <ProductCard key={product.id} product={product} />
                        </a>
                    ))}
                </div>
            </MainColumn>
        </PageLayout>
    );
}