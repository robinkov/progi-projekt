import Header from "@/components/layout/Header";
import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import WorkshopCard from "@/components/workshops/WorkshopCard";
import { useAuth } from "@/components/context/AuthProvider";

// Temporary hardcoded data (correct at this stage)
const workshops = [
    {
        id: 1,
        title: "Lonci",
        instructor: "Mihael Ivanković",
        location: "Brezevica",
        date: "17.12 – 18.12",
        time: "10:00 – 12:30",
    },
    {
        id: 2,
        title: "Vaze",
        instructor: "Katerina B.",
        location: "Zagreb, Zapad",
        date: "4.1",
        time: "20:30 – 21:30",
    },
    {
        id: 3,
        title: "Skulptura",
        instructor: "Ana Perić",
        location: "Online",
        date: "10.1",
        time: "17:00 – 19:00",
    },
    {
        id: 4,
        title: "Keramičke šalice",
        instructor: "Ivan Horvat",
        location: "Split",
        date: "12.1",
        time: "09:00 – 11:30",
    },
    {
        id: 5,
        title: "Reljefna glina",
        instructor: "Marija Kovač",
        location: "Rijeka",
        date: "15.1",
        time: "18:00 – 20:00",
    },
    {
        id: 6,
        title: "Apstraktne forme",
        instructor: "Petar Novak",
        location: "Zagreb, Centar",
        date: "18.1",
        time: "19:00 – 21:00",
    },
    {
        id: 7,
        title: "Skulptura – napredni",
        instructor: "Ana Perić",
        location: "Online",
        date: "22.1",
        time: "17:00 – 20:00",
    },
    {
        id: 8,
        title: "Porculanske zdjele",
        instructor: "Katarina Blažević",
        location: "Osijek",
        date: "25.1",
        time: "10:00 – 13:00",
    },
    {
        id: 9,
        title: "Dekorativne pločice",
        instructor: "Luka Radić",
        location: "Zadar",
        date: "28.1",
        time: "16:00 – 19:00",
    },
    {
        id: 10,
        title: "Modeliranje figure",
        instructor: "Nikola Jurić",
        location: "Zagreb, Istok",
        date: "1.2",
        time: "18:30 – 21:00",
    },
    {
        id: 11,
        title: "Glazura i boje",
        instructor: "Ivana Marić",
        location: "Online",
        date: "3.2",
        time: "17:00 – 18:30",
    },
    {
        id: 12,
        title: "Velike skulpture",
        instructor: "Tomislav Pavić",
        location: "Varaždin",
        date: "6.2",
        time: "09:00 – 14:00",
    },
];

export default function Workshops() {
    const auth = useAuth();
    return (
        <PageLayout
            header={
                <Header
                    userEmail={auth.user?.email}
                    onLogout={() => {} }
                    logoutLoading={false /* pass logoutLoading */}
                />
            }
        >
            <MainColumn>
                {/* Page title */}
                <h1 className="text-2xl font-semibold mb-6">
                    Radionice
                </h1>

                {/* Workshops grid */}
                <div className="grid grid-cols-4 gap-6">
                    {workshops.map((workshop) => (
                        <a href={"/workshops/" + workshop.id}><WorkshopCard
                            key={workshop.id}
                            workshop={workshop}
                        /></a>
                    ))}
                </div>
            </MainColumn>
        </PageLayout>
    );
}