import BriefCard from "@/components/app/BriefCard";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-8 px-8 py-8">
        <div>
          <h1 className="pb-2 text-xl font-semibold">Aktualne radionice</h1>
          <div className="flex flex-wrap gap-4 pt-4">
            { briefCardsMock.map((data, index) => (
              <BriefCard key={index} { ...data } />
            )) }
          </div>
        </div>
        <div>
          <h1 className="pb-2 text-xl font-semibold">Aktualne izložbe</h1>
          <div className="flex flex-wrap gap-4 pt-4">
            { briefCardsMock2.map((data, index) => (
              <BriefCard key={index} { ...data } />
            )) }
          </div>
        </div>
      </div>
    </div>
  );
}

export const briefCardsMock = [
  {
    name: "Ana Perić",
    title: "Skulptura",
    date: "23.12.2025.",
    place: "Brezovica",
    timeFrom: "17:00",
    timeTo: "20:00",
  },
  {
    name: "Marko Kovač",
    title: "Slikarstvo",
    date: "24.12.2025.",
    place: "Zagreb",
    timeFrom: "16:00",
    timeTo: "19:00",
  },
  {
    name: "Ivana Horvat",
    title: "Keramika",
    date: "26.12.2025.",
    place: "Samobor",
    timeFrom: "18:00",
    timeTo: "21:00",
  },
  {
    name: "Luka Marić",
    title: "Instalacija",
    date: "28.12.2025.",
    place: "Velika Gorica",
    timeFrom: "15:00",
    timeTo: "18:00",
  },
];

export const briefCardsMock2 = [
  {
    name: "Ana Perić",
    title: "Izložba skulptura",
    date: "23.12.2025.",
    place: "Brezovica",
    timeFrom: "17:00",
    timeTo: "20:00",
  },
  {
    name: "Marko Kovač",
    title: "Izložba slikarstva",
    date: "24.12.2025.",
    place: "Galerija Klovićevi dvori, Zagreb",
    timeFrom: "18:00",
    timeTo: "21:00",
  },
  {
    name: "Ivana Horvat",
    title: "Keramičke forme – izložba",
    date: "26.12.2025.",
    place: "Samobor",
    timeFrom: "16:00",
    timeTo: "19:00",
  },
];

