import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import BriefCard from "@/components/app/BriefCard";
import { fetchGet } from "@/utils/fetchUtils";

/* ---------------- Types ---------------- */

type Exhibition = {
  id: number;
  title: string;
  organizer_name: string;
  location: string;
  date: string;
  timeFrom: string;
  timeTo: string;
};

type GetExhibitionsResponse = {
  success: boolean;
  exhibitions: Exhibition[];
};

/* ---------------- Component ---------------- */

export default function Exhibitions() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExhibitions() {
      try {
        const res = await fetchGet<GetExhibitionsResponse>("/getexhibitions");

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
    <PageLayout>
      <MainColumn>
        <h1 className="text-2xl font-semibold mb-6">Izložbe</h1>

        {loading ? (
          <div>Učitavanje izložbi...</div>
        ) : (
          <div className="flex flex-wrap gap-4 pt-4">
            {exhibitions.map((exhibition) => (
              <a
                key={exhibition.id}
                href={`/exhibitions/${exhibition.id}`}
              >
                <BriefCard
                  id={exhibition.id}
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
      </MainColumn>
    </PageLayout>
  );
}
