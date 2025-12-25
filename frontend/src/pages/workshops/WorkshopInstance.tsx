import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import { supabase } from "@/config/supabase";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Logo, LogoImage, LogoFallback } from "@/components/ui/logo";
import { Banner, BannerImage, BannerFallback } from "@/components/ui/banner";

/* ---------------- Types ---------------- */
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

type Organizer = {
  profile_name: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  approved_by_admin: boolean | null;
  membership_plan_id: number | null;
  membership_expiry_date: string | null;
};

type ReservationCountResponse = {
  count: number;
};

/* ---------------- Component ---------------- */
const WorkshopPage = () => {
  const { id } = useParams<{ id: string }>();

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [reservationCount, setReservationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [success, setSuccess] = useState(false);

  const remainingSpots =
    workshop ? workshop.capacity - reservationCount : 0;

  /* ---------------- Load data ---------------- */
  useEffect(() => {
    async function loadWorkshop() {
      if (!id) return;

      try {
        const workshopRes = await fetchGet<{ success: boolean; workshop: Workshop }>(
          `/workshops/${id}`
        );

        const reservationRes = await fetchGet<ReservationCountResponse>(
          `/workshops/${id}/reservations/count`
        );

        const organizerRes = await fetchGet<Organizer>(
          `/organizers/${workshopRes.workshop.organizer_id}`
        );

        setWorkshop(workshopRes.workshop);
        setReservationCount(reservationRes.count);
        setOrganizer(organizerRes);
      } catch (err) {
        console.error("Failed to load workshop or organizer", err);
      } finally {
        setLoading(false);
      }
    }

    loadWorkshop();
  }, [id]);

  /* ---------------- Handle reservation ---------------- */
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
      setReservationCount(prev => prev + 1);
      setSuccess(true);
    } catch (err) {
      console.error("Reservation failed", err);
    } finally {
      setReserving(false);
    }
  };

  /* ---------------- Render states ---------------- */
  if (loading) {
    return <div className="p-12 text-center text-lg">Loading workshop...</div>;
  }

  if (!workshop) {
    return <div className="p-12 text-center text-red-600 text-lg">Workshop not found.</div>;
  }

  /* ---------------- Render page ---------------- */
  return (
    <PageLayout>
      <div className="w-full max-w-[1500px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">

        {/* ---------- Workshop Card ---------- */}
        <Card className="flex-1 rounded-3xl shadow-2xl hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-10 space-y-8">
            <h1 className="text-4xl font-bold">{workshop.title}</h1>
            <p className="text-gray-700 text-lg">{workshop.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm md:text-base">
              <div>
                <span className="font-semibold text-gray-800">Datum</span>
                <p className="mt-1">{new Date(workshop.date_time).toLocaleDateString("en-GB")}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Vrijeme</span>
                <p className="mt-1">{new Date(workshop.date_time).toLocaleTimeString("en-GB")}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Trajanje</span>
                <p className="mt-1">{workshop.duration}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Lokacija</span>
                <p className="mt-1">{workshop.location}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Cijena</span>
                <p className="mt-1">{workshop.price}€</p>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Slobodna mjesta</span>
                <p className="mt-1">{remainingSpots > 0 ? remainingSpots : "Radionica puna"}</p>
              </div>
            </div>

            <div className="pt-6">
              {success ? (
                <p className="text-green-600 font-medium text-lg">Rezervacija uspješna</p>
              ) : (
                <Button
                  onClick={handleReserve}
                  disabled={reserving || remainingSpots <= 0}
                  className="w-full"
                >
                  {remainingSpots <= 0 ? "Workshop Full" : reserving ? "Rezerviranje..." : "Rezerviraj"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ---------- Organizer Card ---------- */}
        {organizer && (
          <Card className="flex-1 rounded-3xl shadow-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">

            <CardContent className="p-8 space-y-6">
                <h1 className="text-3xl font-bold">Organizer Profile</h1>
                <Banner className="h-48 md:h-56">
                    {organizer.banner_url ? <BannerImage src={organizer.banner_url} /> : <BannerFallback>No banner</BannerFallback>}
                </Banner>
              <div className="flex items-center gap-5">
                <Logo className="w-24 h-24 md:w-28 md:h-28">
                  {organizer.logo_url ? <LogoImage src={organizer.logo_url} /> : <LogoFallback>{organizer.profile_name?.[0] ?? "O"}</LogoFallback>}
                </Logo>

                <div>
                  <h2 className="text-2xl font-bold">{organizer.profile_name}</h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {organizer.approved_by_admin ? "Verified organizer" : "Pending verification"}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold">Opis organizatora:</h3>
              <p className="text-gray-700 text-base">{organizer.description}</p>

            </CardContent>
          </Card>
        )}

      </div>
    </PageLayout>
  );
};

export default WorkshopPage;
