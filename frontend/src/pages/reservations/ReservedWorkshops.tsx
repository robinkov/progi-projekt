import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import { Button } from "@/components/ui/button";

type Workshop = {
  id: number;
  date: string;
  time?: string;
  title: string;
  instructor: string;
  location?: string;
};

const mockReserved: Workshop[] = [
  { id: 1, date: "17.12", time: "10:00 – 12:30", title: "Lonci", instructor: "Mihael Ivanković", location: "Brezevica" },
  { id: 2, date: "4.1", time: "20:30 – 21:30", title: "Vaze", instructor: "Katerina B.", location: "Zagreb, Zapad" },
  { id: 3, date: "10.1", time: "17:00 – 19:00", title: "Skulptura", instructor: "Ana Perić", location: "Online" },
];

export default function ReservedWorkshops() {
  return (
    <PageLayout>
      <MainColumn>
        <h1 className="text-2xl font-semibold mb-6">Rezervirane radionice</h1>

        <div className="w-full">
          {/* Header row (visual labels) aligned to row column widths */}
          <div className="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
            <div className="flex items-center text-sm text-gray-700 flex-1 min-w-0">
              <div className="w-24 flex-shrink-0">Datum</div>
              <div className="mx-2 w-[1px] h-5 bg-gray-200" />

              <div className="w-36 flex-shrink-0">Vrijeme</div>
              <div className="mx-2 w-[1px] h-5 bg-gray-200" />

              <div className="flex-1 min-w-0 pr-2">Naziv</div>
              <div className="mx-2 w-[1px] h-5 bg-gray-200" />

              <div className="w-36 flex-shrink-0">Instruktor</div>
              <div className="mx-2 w-[1px] h-5 bg-gray-200" />

              <div className="w-36 truncate">Lokacija</div>
            </div>
            {/* fixed button column so rows/header stay aligned */}
            <div className="w-28 flex-shrink-0" />
          </div>

          {/* Rows as rounded cards with stylized vertical separators */}
          <div className="space-y-3">
            {mockReserved.map((w) => (
              <div key={w.id} className="flex items-center px-4 py-3 hover:bg-gray-50 rounded-lg border">
                <div className="flex items-center text-sm text-gray-700 flex-1 min-w-0">
                  <div className="w-24 flex-shrink-0">{w.date}</div>
                  <div className="mx-2 w-[1px] h-5 bg-gray-200" />

                  <div className="w-36 flex-shrink-0">{w.time}</div>
                  <div className="mx-2 w-[1px] h-5 bg-gray-200" />

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="truncate font-medium text-gray-900">{w.title}</div>
                  </div>
                  <div className="mx-2 w-[1px] h-5 bg-gray-200" />

                  <div className="w-36 flex-shrink-0 text-gray-700">{w.instructor}</div>
                  <div className="mx-2 w-[1px] h-5 bg-gray-200" />

                  <div className="w-36 truncate text-gray-500">{w.location}</div>
                </div>
                <div className="ml-4 w-28 flex-shrink-0">
                  <Button variant="destructive" size="sm" onClick={() => alert(`Otkaži rezervaciju ${w.id}`)}>
                    OTKAŽI
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
