import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import { Button } from "@/components/ui/button";
import ColumnsHeader from "@/components/reservations/ColumnsHeader";

type Exhibition = {
  id: number;
  date: string;
  time?: string;
  title: string;
  organizer: string;
  location?: string;
};

const mockRegistered: Exhibition[] = [
  { id: 1, date: "14.12", time: "18:00", title: "Keramika u pokretu", organizer: "ClayPlay", location: "Zagreb, Centar" },
  { id: 2, date: "18.12", time: "19:30", title: "Suvremena glina", organizer: "Galerija Forma", location: "Split" },
  { id: 3, date: "22.12", title: "Minimalističke forme", organizer: "Studio Terra", location: "Online" },
];

export default function RegisteredExhibitions() {
  return (
    <PageLayout>
      <MainColumn>
        <h1 className="text-2xl font-semibold mb-6">Prijavljene izložbe</h1>

        <div className="w-full">
          {/* Header row (visual labels) aligned to row column widths */}
          <ColumnsHeader col4Label="Organizator" col5Label="Lokacija" />

          {/* Rows as rounded cards with stylized separators */}
          <div className="space-y-3">
            {mockRegistered.map((e) => (
              <div key={e.id} className="flex items-center px-4 py-3 hover:bg-gray-50 rounded-lg border">
                <div className="flex items-center text-sm text-gray-700 flex-1 min-w-0">
                  <div className="w-24 flex-shrink-0">{e.date}</div>
                  <div className="mx-2 w-[1px] h-5 bg-gray-200" />

                  <div className="w-36 flex-shrink-0">{e.time ?? "-"}</div>
                  <div className="mx-2 w-[1px] h-5 bg-gray-200" />

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="truncate font-medium text-gray-900">{e.title}</div>
                  </div>
                  <div className="mx-2 w-[1px] h-5 bg-gray-200" />

                  <div className="w-36 flex-shrink-0 text-gray-700">{e.organizer}</div>
                  <div className="mx-2 w-[1px] h-5 bg-gray-200" />

                  <div className="w-36 truncate text-gray-500">{e.location}</div>
                </div>
                <div className="ml-4 w-28 flex-shrink-0">
                  <Button variant="ghost" size="sm" disabled>
                    PRIJAVLJENO
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainColumn>
    </PageLayout>
  );
}
