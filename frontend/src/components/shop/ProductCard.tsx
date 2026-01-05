import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Coffee, CookingPot, Squircle, Star} from "lucide-react";

interface Product {
    id: number;
    price: string;
    name: string;
    seller: string;
    category: string | null;
}

interface ProductCardProps {
    product: Product;
}

const categoryMeta: Record<string,{ Icon: React.ComponentType<any>; badgeClass: string; textClass?: string }> = {
    skulpture: { Icon: Box, badgeClass: "bg-rose-100 border-rose-200", textClass: "text-rose-800" },
    tanjuri: { Icon: Squircle, badgeClass: "bg-amber-100 border-amber-200", textClass: "text-amber-800" },
    zdjele: { Icon: CookingPot, badgeClass: "bg-green-100 border-green-200", textClass: "text-green-800" },
    salice: { Icon: Coffee, badgeClass: "bg-sky-100 border-sky-200", textClass: "text-sky-800" },
    other: { Icon: Star, badgeClass: "bg-muted/20 border-border", textClass: "text-foreground" },
};

const getMeta = (category?: string | null) => {
  if (!category) return categoryMeta.other;
  const key = category.toLowerCase();
  return categoryMeta[key] ?? categoryMeta.other;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { Icon, badgeClass, textClass } = getMeta(product.category);

    return (
        <Card className="gap-3 min-w-[300px] w-[300px] duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5">
            <CardHeader>
                <Badge className={`text-xs flex items-center gap-2 px-2 py-1 border ${badgeClass} ${textClass ?? ""}`}>
                    <Icon className="w-4 h-4" />
                    <span className="capitalize">{product.category ?? "Bez kategorije"}</span>
                </Badge>
            </CardHeader>

            <CardContent>
                <h1 className="text-lg font-semibold">{product.name}</h1>
                <p className="text-xs text-muted-foreground">{product.seller}</p>
            </CardContent>

            <CardFooter>
                <h2 className="font-semibold">{product.price}</h2>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;