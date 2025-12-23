import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface Product {
    id: number;
    price: string;
    name: string;
    author: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Card className="gap-3 min-w-[300px] w-[300px] duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5">
            <CardHeader>
                <h2 className="font-semibold">{product.price}</h2>
            </CardHeader>

            <CardContent>
                <h1 className="text-lg font-semibold">{product.name}</h1>
                <p className="text-xs">{product.author}</p>
            </CardContent>

            <CardFooter>
                <p className="text-xs text-muted-foreground">
                    Available product
                </p>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
