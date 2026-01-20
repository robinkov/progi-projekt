import { useEffect, useState } from "react";
import BriefCard from "@/components/app/BriefCard";
import { fetchGet } from "@/utils/fetchUtils";
import { Switch } from "@/components/ui/switch";
import { supabase } from '@/config/supabase';
import { useAuth } from "@/components/context/AuthProvider";
type Exhibition = {
    id: number;
    title: string;
    organizer_name: string;
    location: string;
    date: string;
    timeFrom: string;
    timeTo: string;
    filter_out: boolean
};

type GetExhibitionsResponse = {
    success: boolean;
    exhibitions: Exhibition[];
};


export default function Forum() {
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        async function loadExhibitions() {
            const { data } = await supabase.auth.getSession();
            if (!data.session) return;
            try {
                const res = await fetchGet<GetExhibitionsResponse>("/forum",
                    {
                        Authorization: `Bearer ${data.session.access_token}`,
                    });

                if (res.success) {
                    setExhibitions(res.exhibitions);
                }
            } catch (err) {
                console.error("Failed to load exhibitions", err);
            } finally {
                setLoading(false);
            }
        }

        loadExhibitions();
    }, []);

    return (
        <div className="w-full">
            <h1 className="text-2xl font-semibold mb-6">FORUM: Ostavite komentar o svojoj najdražoj izložbi!</h1>
            <div className="mb-8 w-1/2">
                {user?.role != "admin" ? (
                    <div className="flex items-center justify-between gap-6 rounded-xl border border-border bg-muted/40 px-6 py-4">
                        {user?.role == "polaznik" ? (
                            <div className="flex flex-col">

                                <label
                                    htmlFor="my_exhibitions"
                                    className="cursor-pointer text-sm font-medium leading-none text-foreground"
                                >
                                    Prikaži samo izložbe na kojima sam bio/la
                                </label>
                                <span className="mt-1 text-xs text-muted-foreground">
                                    Filtriraj prikaz izložbi prema vlastitim posjetima
                                </span>
                            </div>) : (
                            <div className="flex flex-col">
                                <label
                                    htmlFor="my_exhibitions"
                                    className="cursor-pointer text-sm font-medium leading-none text-foreground"
                                >
                                    Prikaži samo moje izložbe
                                </label>
                                <span className="mt-1 text-xs text-muted-foreground">
                                    Pronađite rasprave o vlastitim izložbama    .
                                </span>
                            </div>)}

                        <Switch
                            id="my_exhibitions"
                            checked={filter}
                            onCheckedChange={setFilter}
                        />
                    </div>) : (<div></div>)}
            </div>

            {loading ? (
                <div>Učitavanje izložbi...</div>
            ) : (
                <div className="flex flex-wrap gap-4 pt-4">
                    {exhibitions.filter((e) => !filter || !e.filter_out).map((exhibition) => (
                        <a
                            key={exhibition.id}
                            href={`/forum/${exhibition.id}`}
                        >
                            <BriefCard
                                title={exhibition.title}
                                name={exhibition.organizer_name}
                                place={exhibition.location}
                                date={exhibition.date}
                                timeFrom={exhibition.timeFrom}
                                timeTo={exhibition.timeTo}
                            />
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}