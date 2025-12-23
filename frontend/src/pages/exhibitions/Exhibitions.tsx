import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/config/supabase";

import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import BriefCard from "@/components/app/BriefCard";

const exhibitions = [
    {
        id: 1,
        date: "14.12",
        timeFrom: "18:00",
        timeTo: "20:00",
        title: "Keramika u pokretu",
        name: "ClayPlay",
        place: "Zagreb, Centar",
    },
    {
        id: 2,
        date: "18.12",
        timeFrom: "19:30",
        timeTo: "21:30",
        title: "Suvremena glina",
        name: "Galerija Forma",
        place: "Split",
    },
    {
        id: 3,
        date: "22.12",
        timeFrom: "17:00",
        timeTo: "19:00",
        title: "Minimalističke forme",
        name: "Studio Terra",
        place: "Online",
    },
    {
        id: 4,
        date: "28.12",
        timeFrom: "17:00",
        timeTo: "19:00",
        title: "Tradicionalna keramika Dalmacije",
        name: "Muzej obrtništva",
        place: "Šibenik",
    },
    {
        id: 5,
        date: "5.1",
        timeFrom: "18:30",
        timeTo: "20:30",
        title: "Glazura kao izraz",
        name: "Atelier Modra",
        place: "Rijeka",
    },
    {
        id: 6,
        date: "9.1",
        timeFrom: "16:00",
        timeTo: "18:00",
        title: "Keramika i prostor",
        name: "Galerija K2",
        place: "Zadar",
    },
    {
        id: 7,
        date: "13.1",
        timeFrom: "20:00",
        timeTo: "22:00",
        title: "Eksperimentalne tehnike pečenja",
        name: "ClayLab",
        place: "Zagreb, Istok",
    },
    {
        id: 8,
        date: "17.1",
        timeFrom: "18:00",
        timeTo: "20:00",
        title: "Forma i tekstura",
        name: "Umjetnička udruga Krug",
        place: "Varaždin",
    },
    {
        id: 9,
        date: "21.1",
        timeFrom: "17:30",
        timeTo: "19:30",
        title: "Keramika u digitalnom dobu",
        name: "Design Hub",
        place: "Online",
    },
    {
        id: 10,
        date: "26.1",
        timeFrom: "19:00",
        timeTo: "21:00",
        title: "Između funkcije i skulpture",
        name: "Galerija Linija",
        place: "Osijek",
    },
    {
        id: 11,
        date: "30.1",
        timeFrom: "18:00",
        timeTo: "20:00",
        title: "Mladi keramičari",
        name: "Akademija primijenjenih umjetnosti",
        place: "Zagreb, Centar",
    },
    {
        id: 12,
        date: "3.2",
        timeFrom: "18:00",
        timeTo: "20:00",
        title: "Keramika velikog formata",
        name: "Studio Glina",
        place: "Pula",
    }
];


export default function Exhibitions() {
    const navigate = useNavigate()

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();

            if (!data.session) {
                navigate("/auth", { replace: true });
            }
        };

        checkSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate("/auth", { replace: true });
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [navigate]);
    return (
        <PageLayout>
            <MainColumn>
                {/* Page title */}
                <h1 className="text-2xl font-semibold mb-6">
                    Izložbe
                </h1>

                {/* Exhibitions grid */}
                <div className="flex flex-wrap gap-4 pt-4">
                    {exhibitions.map((exhibition) => (
                        <a href={"/exhibitions/" + exhibition.id}>
                            <BriefCard
                                key={exhibition.id}
                                {...exhibition}
                            /></a>
                    ))}
                </div>
            </MainColumn>
        </PageLayout>
    );
}