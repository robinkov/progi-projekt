
import { useEffect, useState } from "react";
import BriefCard from "@/components/app/BriefCard";
import { fetchGet } from "@/utils/fetchUtils";

type Workshop = {
  id: number;
  title: string;
  organizer_name: string;
  location: string;
  date: string;
  timeFrom: string;
  timeTo: string;
};

type GetWorkshopsResponse = {
  success: boolean;
  workshops: Workshop[];
};

export default function Workshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkshops() {
      try {
        const res = await fetchGet<GetWorkshopsResponse>("/getworkshops");

        if (res.success) {
          setWorkshops(res.workshops);
        }
      } catch (err) {
        console.error("Failed to load workshops", err);
      } finally {
        setLoading(false);
      }
    }

    loadWorkshops();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Radionice</h1>

      {loading ? (
        <div>Učitavanje radionica...</div>
      ) : (
        <div className="flex flex-wrap gap-4 pt-4">
          {workshops.map((workshop) => (
            <a key={workshop.id} href={`/workshops/${workshop.id}`}>
              <BriefCard
                title={workshop.title}
                name={workshop.organizer_name}
                place={workshop.location}
                date={workshop.date}
                timeFrom={workshop.timeFrom}
                timeTo={workshop.timeTo}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
