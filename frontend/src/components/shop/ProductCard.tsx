import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
    id: number;
    price: string;
    name: string;
    seller: string;
    category: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Card className="gap-3 min-w-[300px] w-[300px] duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5">
            <CardHeader>
                <Badge variant="default" className="text-xs">
                    {product.category}
                </Badge>
            </CardHeader>

            <CardContent>
                <h1 className="text-lg font-semibold">{product.name}</h1>
                <p className="text-xs">{product.seller}</p>
            </CardContent>

            <CardFooter>
                <h2 className="font-semibold">{product.price}</h2>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
