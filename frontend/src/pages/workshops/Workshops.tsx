import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/config/supabase";

import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import BriefCard from "@/components/app/BriefCard";

const workshops = [
    {
        id: 1,
        title: "Lonci",
        name: "Mihael Ivanković",
        place: "Brezevica",
        date: "17.12 – 18.12",
        timeFrom: "10:00",
        timeTo: "12:30"
    },
    {
        id: 2,
        title: "Vaze",
        name: "Katerina B.",
        place: "Zagreb, Zapad",
        date: "4.1",
        timeFrom: "20:30",
        timeTo: "21:30"
    },
    {
        id: 3,
        title: "Skulptura",
        name: "Ana Perić",
        place: "Online",
        date: "10.1",
        timeFrom: "17:00",
        timeTo: "19:00"
    },
    {
        id: 4,
        title: "Keramičke šalice",
        name: "Ivan Horvat",
        place: "Split",
        date: "12.1",
        timeFrom: "09:00",
        timeTo: "11:30"
    },
    {
        id: 5,
        title: "Reljefna glina",
        name: "Marija Kovač",
        place: "Rijeka",
        date: "15.1",
        timeFrom: "18:00",
        timeTo: "20:00"
    },
    {
        id: 6,
        title: "Apstraktne forme",
        name: "Petar Novak",
        place: "Zagreb, Centar",
        date: "18.1",
        timeFrom: "19:00",
        timeTo: "21:00"
    },
    {
        id: 7,
        title: "Skulptura – napredni",
        name: "Ana Perić",
        place: "Online",
        date: "22.1",
        timeFrom: "17:00",
        timeTo: "20:00"
    },
    {
        id: 8,
        title: "Porculanske zdjele",
        name: "Katarina Blažević",
        place: "Osijek",
        date: "25.1",
        timeFrom: "10:00",
        timeTo: "13:00"
    },
    {
        id: 9,
        title: "Dekorativne pločice",
        name: "Luka Radić",
        place: "Zadar",
        date: "28.1",
        timeFrom: "16:00",
        timeTo: "19:00"
    },
    {
        id: 10,
        title: "Modeliranje figure",
        name: "Nikola Jurić",
        place: "Zagreb, Istok",
        date: "1.2",
        timeFrom: "18:30",
        timeTo: "21:00"
    },
    {
        id: 11,
        title: "Glazura i boje",
        name: "Ivana Marić",
        place: "Online",
        date: "3.2",
        timeFrom: "17:00",
        timeTo: "18:30"
    },
    {
        id: 12,
        title: "Velike skulpture",
        name: "Tomislav Pavić",
        place: "Varaždin",
        date: "6.2",
        timeFrom: "09:00",
        timeTo: "14:00"
    }
];


export default function Workshops() {
    return (
        <PageLayout>
            <MainColumn>
                <h1 className="text-2xl font-semibold mb-6">Radionice</h1>

                <div className="flex flex-wrap gap-4 pt-4">
                    {workshops.map((workshop) => (
                        <a key={workshop.id} href={`/workshops/${workshop.id}`}>
                            <BriefCard key={workshop.id} {...workshop} />
                        </a>
                    ))}
                </div>
            </MainColumn>
        </PageLayout>
    );
}