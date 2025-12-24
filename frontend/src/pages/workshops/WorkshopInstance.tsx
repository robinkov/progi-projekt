import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import { supabase } from "@/config/supabase";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";

type Workshop = {
    id: number;
    organizer_id: number;
    title: string;
    description: string;
    duration: string;
    date_time: string;
    location: string;
    capacity: number;
    price: number;
};

type WorkshopResponse = {
    success: boolean;
    workshop: Workshop;
};


type ReservationCountResponse = {
    count: number;
};

const Workshop_Instance = () => {
    const { id } = useParams<{ id: string }>();

    const [workshop, setWorkshop] = useState<Workshop | null>(null);
    const [reservationCount, setReservationCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reserving, setReserving] = useState(false);
    const [success, setSuccess] = useState(false);

    const remainingSpots =
        workshop ? workshop.capacity - reservationCount : 0;

    useEffect(() => {
        async function loadWorkshop() {
            const { data } = await supabase.auth.getSession();
            if (!data.session || !id) return;

            try {

                const workshopRes = await fetchGet<WorkshopResponse>(
                    `/workshops/${id}`
                );

                const reservationRes = await fetchGet<ReservationCountResponse>(
                    `/workshops/${id}/reservations/count`
                );

                setWorkshop(workshopRes.workshop);
                setReservationCount(reservationRes.count);
            } catch (err) {
                console.error("Failed to load workshop", err);
            } finally {
                setLoading(false);
            }
        }

        loadWorkshop();
    }, [id]);

    const handleReserve = async () => {
        if (!workshop) return;

        const { data } = await supabase.auth.getSession();
        if (!data.session) return;

        try {
            setReserving(true);

            await fetchPost(
                `/workshops/${workshop.id}/reservations`,
                {},
                {
                    Authorization: `Bearer ${data.session.access_token}`,
                }
            );

            setReservationCount((prev) => prev + 1);
            setSuccess(true);
        } catch (err) {
            console.error("Reservation failed", err);
        } finally {
            setReserving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading workshop...</div>;
    }

    if (!workshop) {
        return (
            <div className="p-8 text-center text-red-600">
                Workshop not found.
            </div>
        );
    }

    return (
        <PageLayout>
            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="bg-card rounded-2xl shadow-md p-8 space-y-6">
                    <div>
                        <h1 className="text-3xl font-semibold">{workshop.title}</h1>
                        <p className="mt-2 text-gray-600">{workshop.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Datum</span>
                            <p>
                                {new Date(workshop.date_time).toLocaleDateString("en-GB")}
                            </p>
                        </div>

                        <div>
                            <span className="font-medium">Vrijeme</span>
                            <p>{new Date(workshop.date_time).toLocaleTimeString("en-GB")}</p>
                        </div>

                        <div>
                            <span className="font-medium">Trajanje</span>
                            <p>{workshop.duration}</p>
                        </div>

                        <div>
                            <span className="font-medium">Lokacija</span>
                            <p>{workshop.location}</p>
                        </div>

                        <div>
                            <span className="font-medium">Cijena</span>
                            <p>{workshop.price}€</p>
                        </div>

                        <div>
                            <span className="font-medium">Broj slobodnih mjesta</span>
                            <p>
                                {remainingSpots > 0
                                    ? `${remainingSpots}`
                                    : "Radionica puna"}
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        {success ? (
                            <p className="text-green-600 font-medium">
                                Rezervacija je uspješna.
                            </p>
                        ) : (
                            <Button
                                onClick={handleReserve}
                                disabled={reserving || remainingSpots <= 0}
                                className={`w-full py-3 rounded-xl font-medium transition
                ${reserving || remainingSpots <= 0
                                        ? "cursor-not-allowed"
                                        : " hover:bg-gray-800"
                                    }`}
                            >
                                {remainingSpots <= 0
                                    ? "Workshop Full"
                                    : reserving
                                        ? "Rezerviranje.."
                                        : "Rezerviraj"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>

    );
};

export default Workshop_Instance;

