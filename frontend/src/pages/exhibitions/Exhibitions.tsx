import Header from "@/components/layout/Header";
import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import { useAuth } from "@/components/context/AuthProvider";
import ExhibitionCard from './../../components/exhibitions/ExhibitionCard';


// Temporary hardcoded data (correct at this stage)
const exhibitions = [
    {
        id: 1,
        date: "14.12",
        time: "18:00",
        title: "Keramika u pokretu",
        organizer: "ClayPlay",
        location: "Zagreb, Centar",
    },
    {
        id: 2,
        date: "18.12",
        time: "19:30",
        title: "Suvremena glina",
        organizer: "Galerija Forma",
        location: "Split",
    },
    {
        id: 3,
        date: "22.12",
        title: "Minimalističke forme",
        organizer: "Studio Terra",
        location: "Online",
    },
    {
        id: 4,
        date: "28.12",
        time: "17:00",
        title: "Tradicionalna keramika Dalmacije",
        organizer: "Muzej obrtništva",
        location: "Šibenik",
    },
    {
        id: 5,
        date: "5.1",
        time: "18:30",
        title: "Glazura kao izraz",
        organizer: "Atelier Modra",
        location: "Rijeka",
    },
    {
        id: 6,
        date: "9.1",
        title: "Keramika i prostor",
        organizer: "Galerija K2",
        location: "Zadar",
    },
    {
        id: 7,
        date: "13.1",
        time: "20:00",
        title: "Eksperimentalne tehnike pečenja",
        organizer: "ClayLab",
        location: "Zagreb, Istok",
    },
    {
        id: 8,
        date: "17.1",
        time: "18:00",
        title: "Forma i tekstura",
        organizer: "Umjetnička udruga Krug",
        location: "Varaždin",
    },
    {
        id: 9,
        date: "21.1",
        title: "Keramika u digitalnom dobu",
        organizer: "Design Hub",
        location: "Online",
    },
    {
        id: 10,
        date: "26.1",
        time: "19:00",
        title: "Između funkcije i skulpture",
        organizer: "Galerija Linija",
        location: "Osijek",
    },
    {
        id: 11,
        date: "30.1",
        title: "Mladi keramičari",
        organizer: "Akademija primijenjenih umjetnosti",
        location: "Zagreb, Centar",
    },
    {
        id: 12,
        date: "3.2",
        time: "18:00",
        title: "Keramika velikog formata",
        organizer: "Studio Glina",
        location: "Pula",
    },
];


export default function Exhibitions() {
    const auth = useAuth();
    return (
        <PageLayout
            header={
                <Header
                    userEmail={auth.user?.email}
                    onLogout={() => { } /* pass handleLogout */}
                    logoutLoading={false /* pass logoutLoading */}
                />
            }
        >
            <MainColumn>
                {/* Page title */}
                <h1 className="text-2xl font-semibold mb-6">
                    Izložbe
                </h1>

                {/* Exhibitions grid */}
                <div className="grid grid-cols-4 gap-6">
                    {exhibitions.map((exhibition) => (
                        <a href={"/exhibitions/" + exhibition.id}><ExhibitionCard
                            key={exhibition.id}
                            exhibition={exhibition}
                        /></a>
                    ))}
                </div>
            </MainColumn>
        </PageLayout>
    );
}