

import React from 'react';
import SectionHeader from '../common/SectionHeader';
import ProductCard from './ProductCard';

interface Product {
    id: number;
    price: string;
    time?: string;
    name: string;
    author: string;
    location?: string;
}

// --- DUMMY DATA ---
const DUMMY_PRODUCTS: Product[] = [
    {
        id: 1,
        price: "20€",
        name: "LONAC",
        author: "Mihael Ivankovic",
    },
    {
        id: 2,
        price: "20€",
        name: "VAZA",
        author: "Katerina B.",
    },
    {
        id: 3,
        price: "20€",
        name: "SKULPTURA",
        author: "Ana Peric",
    },
];

const ProductsSection: React.FC = () => {
    return (
        <section className="py-5 border-b border-gray-300">
            <SectionHeader title="Popularni proizvodi" />
            <div className="
        flex 
        overflow-x-auto 
        py-4 
        items-stretch
        -mx-2 md:mx-0  
      ">
                {DUMMY_PRODUCTS.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
                <div className="
            min-w-[150px] 
            ml-5 mr-3 
            text-center 
            flex items-center justify-center
        ">
                    <a href="/shop" className="
            block 
            p-5 
            border border-full border-gray-900 
            text-decoration-none text-gray-900 
            h-full 
            flex flex-col items-center justify-center 
            hover:bg-gray-50 transition-colors
          ">
                        <span className="font-semibold text-sm">Pogledaj još proizvoda</span>
                        <span className="text-sm mt-1">{`->`}</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;