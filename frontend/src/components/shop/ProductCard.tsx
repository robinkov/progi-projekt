// src/components/workshops/WorkshopCard.tsx

import React from 'react';

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
        <div className="
        border border-full border-gray-900 
        p-4 mr-5 
        min-w-[220px] max-w-xs 
        flex-shrink-0 
        flex flex-col justify-between 
        hover:shadow-md transition-shadow
    ">

            {/* Workshop Details */}
            <div className="workshop-info">
                <p className="text-sm mb-1 font-bold text-gray-700">
                    {product.price}
                </p>

                <h3 className="text-lg font-semibold my-1 text-gray-900">
                    {product.name}
                </h3>

                <p className="text-sm mb-3 text-gray-700">
                    {product.author}
                </p>

            </div>

            {/* Visual Placeholder (Matching the sketch's empty box) */}
            <div className="
        
      ">
                {/* Placeholder for optional brief summary */}
            </div>

        </div>
    );
};

export default ProductCard;