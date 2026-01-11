'use client'
import { useEffect, useState } from "react";
import BriefCard from "@/components/app/BriefCard";
import { fetchGet } from "@/utils/fetchUtils";
import WorkshopCalendar from "@/components/ui/workshopCalendar";

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
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-16 w-full">
      
      {/* SEKCIJA 1: GOOGLE KALENDAR (Pregled svih termina) */}
      <section className="space-y-6 w-full">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Raspored radionica</h2>
          <p className="text-muted-foreground text-sm font-medium">Pogledajte slobodne termine izravno u našem kalendaru.</p>
        </div>
        <div className="bg-card border border-border rounded-3xl p-4 shadow-sm w-full">
          <WorkshopCalendar />
        </div>
      </section>

      {/* SEKCIJA 2: GRID RADIONICA (Kartice za odabir i plaćanje) */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-foreground">Dostupni programi</h2>
        
        {loading ? (
          <div className="text-muted-foreground font-medium animate-pulse">Učitavanje radionica...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshops.map((workshop) => (
              <a 
                key={workshop.id} 
                href={`/workshops/${workshop.id}`}
                className="block transition-all duration-300 hover:-translate-y-2"
              >
                <div className="bg-card text-card-foreground border border-border rounded-3xl p-4 shadow-sm hover:shadow-xl transition-shadow">
                  <BriefCard
                    title={workshop.title}
                    name={workshop.organizer_name}
                    place={workshop.location}
                    date={workshop.date}
                    timeFrom={workshop.timeFrom}
                    timeTo={workshop.timeTo}
                    className="border-muted-foreground/20 w-full"
                  />
                  <div className="mt-6 flex justify-between items-center border-t border-border pt-4 pl-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                      Odaberi i rezerviraj →
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">ID: {workshop.id}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Prikaz ako nema rezultata */}
        {!loading && workshops.length === 0 && (
          <div className="p-12 text-center bg-card rounded-3xl border border-dashed border-border text-muted-foreground italic font-serif text-lg">
            Trenutno nema dostupnih radionica u sustavu.
          </div>
        )}
      </section>
    </div>
  );
}