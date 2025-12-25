import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGet } from "@/utils/fetchUtils";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Logo, LogoImage, LogoFallback } from "@/components/ui/logo";
import { Banner, BannerImage, BannerFallback } from "@/components/ui/banner";

/* ---------------- Types ---------------- */

type Exhibition = {
  id: number;
  organizer_id: number;
  title: string;
  description: string;
  date_time: string;
  location: string;
};

type Organizer = {
  profile_name: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  approved_by_admin: boolean | null;
};

/* ---------------- Component ---------------- */

const ExhibitionPage = () => {
  const { id } = useParams<{ id: string }>();

  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Load data ---------------- */

  useEffect(() => {
    async function loadExhibition() {
      if (!id) return;

      try {
        const exhibitionRes = await fetchGet<{
          success: boolean;
          exhibition: Exhibition;
        }>(`/exhibitions/${id}`);

        const organizerRes = await fetchGet<Organizer>(
          `/organizers/${exhibitionRes.exhibition.organizer_id}`
        );

        setExhibition(exhibitionRes.exhibition);
        setOrganizer(organizerRes);
      } catch (err) {
        console.error("Failed to load exhibition", err);
      } finally {
        setLoading(false);
      }
    }

    loadExhibition();
  }, [id]);

  /* ---------------- States ---------------- */

  if (loading) {
    return <div className="p-12 text-center text-lg">Loading exhibition...</div>;
  }

  if (!exhibition) {
    return (
      <div className="p-12 text-center text-red-600 text-lg">
        Exhibition not found.
      </div>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <PageLayout>
      <div className="w-full max-w-[1500px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">

        {/* ---------- Exhibition Card ---------- */}
        <Card className="flex-1 rounded-3xl shadow-2xl hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-10 space-y-8">
            <h1 className="text-4xl font-bold">{exhibition.title}</h1>
            <p className="text-gray-700 text-lg">{exhibition.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm md:text-base">
              <div>
                <span className="font-semibold text-gray-800">Datum</span>
                <p className="mt-1">
                  {new Date(exhibition.date_time).toLocaleDateString("en-GB")}
                </p>
              </div>

              <div>
                <span className="font-semibold text-gray-800">Vrijeme</span>
                <p className="mt-1">
                  {new Date(exhibition.date_time).toLocaleTimeString("en-GB")}
                </p>
              </div>

              <div>
                <span className="font-semibold text-gray-800">Lokacija</span>
                <p className="mt-1">{exhibition.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ---------- Organizer Card ---------- */}
        {organizer && (
          <Card className="flex-1 rounded-3xl shadow-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 space-y-6">
              <h1 className="text-3xl font-bold">Organizer Profile</h1>

              <Banner className="h-48 md:h-56">
                {organizer.banner_url ? (
                  <BannerImage src={organizer.banner_url} />
                ) : (
                  <BannerFallback>No banner</BannerFallback>
                )}
              </Banner>

              <div className="flex items-center gap-5">
                <Logo className="w-24 h-24 md:w-28 md:h-28">
                  {organizer.logo_url ? (
                    <LogoImage src={organizer.logo_url} />
                  ) : (
                    <LogoFallback>
                      {organizer.profile_name?.[0] ?? "O"}
                    </LogoFallback>
                  )}
                </Logo>

                <div>
                  <h2 className="text-2xl font-bold">
                    {organizer.profile_name}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {organizer.approved_by_admin
                      ? "Verified organizer"
                      : "Pending verification"}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold">
                Opis organizatora:
              </h3>
              <p className="text-gray-700 text-base">
                {organizer.description}
              </p>
            </CardContent>
          </Card>
        )}

      </div>
    </PageLayout>
  );
};

export default ExhibitionPage;
