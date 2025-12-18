import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import ProductCard from './../../components/shop/ProductCard';


// Temporary hardcoded data (correct at this stage)
const products = [
    {
        id: 1,
        name: "Keramička šalica – mat bijela",
        author: "Studio Glina",
        price: "18 €",
    },
    {
        id: 2,
        name: "Ručno rađena zdjela",
        author: "Ana Perić",
        price: "32 €",
    },
    {
        id: 3,
        name: "Dekorativna vaza – siva",
        author: "Mihael Ivanković",
        price: "45 €",
    },
    {
        id: 4,
        name: "Keramička šalica s reljefom",
        author: "Katarina Blažević",
        price: "22 €",
    },
    {
        id: 5,
        name: "Mala skulptura – apstraktna forma",
        author: "Petar Novak",
        price: "75 €",
    },
    {
        id: 6,
        name: "Set od 2 šalice",
        author: "ClayPlay",
        price: "34 €",
    },
    {
        id: 7,
        name: "Porculanski tanjur",
        author: "Studio Terra",
        price: "28 €",
    },
    {
        id: 8,
        name: "Keramička vaza – visoka",
        author: "Ivana Marić",
        price: "52 €",
    },
    {
        id: 9,
        name: "Dekorativna posuda s poklopcem",
        author: "Luka Radić",
        price: "39 €",
    },
    {
        id: 10,
        name: "Keramički držač za svijeće",
        author: "Marija Kovač",
        price: "16 €",
    },
    {
        id: 11,
        name: "Minimalistička šalica",
        author: "Design Lab",
        price: "20 €",
    },
    {
        id: 12,
        name: "Velika zdjela – prirodna glina",
        author: "Tomislav Pavić",
        price: "60 €",
    },
    {
        id: 13,
        name: "Dekorativna pločica",
        author: "Atelier Modra",
        price: "14 €",
    },
    {
        id: 14,
        name: "Set keramičkih tanjura (4)",
        author: "Studio Forma",
        price: "85 €",
    },
    {
        id: 15,
        name: "Keramička šalica s ručkom",
        author: "Ana Perić",
        price: "19 €",
    },
    {
        id: 16,
        name: "Skulpturalna vaza",
        author: "Nikola Jurić",
        price: "95 €",
    },
];



export default function Products() {
    return (
        <PageLayout>
            <MainColumn>
                {/* Page title */}
                <h1 className="text-2xl font-semibold mb-6">
                    Clay Shop
                </h1>

                {/* Products grid */}
                <div className="grid grid-cols-4 gap-6">
                    {products.map((product) => (
                        <a href={"/products/" + product.id}><ProductCard
                            key={product.id}
                            product={product}
                        /></a>
                    ))}
                </div>
            </MainColumn>
        </PageLayout>
    );
}