

import React from 'react';
import SectionHeader from '../common/SectionHeader';
import ExhibitionCard from './ExhibitionCard';

interface Exhibition {
    id: number;
    date: string;
    time?: string;
    title: string;
    organizer: string;
    location?: string;
}

// --- DUMMY DATA ---
const DUMMY_EXHIBITIONS: Exhibition[] = [
    {
        id: 1,
        date: "17.12 - 18.12.",
        time: "10:00 - 12:30",
        title: "LONCI",
        organizer: "Mihael Ivankovic",
        location: "Brezevica",
    },
    {
        id: 2,
        date: "4.1.",
        time: "20:30 - 21:30",
        title: "VAZE",
        organizer: "Katerina B.",
        location: "Zagreb, Zapad",
    },
    {
        id: 3,
        date: "10.1.",
        time: "17:00 - 19:00",
        title: "SKULPTURE",
        organizer: "Ana Peric",
        location: "Online",
    },
];

const ExhibitionsSection: React.FC = () => {
    return (
        <section className="py-5 border-b border-gray-300">

            {/* 1. Section Header (Radionice (aktualne)) */}
            <SectionHeader title="Izložbe (aktualne)" />

            {/* 2. exhibition List Container (Horizontal Scroll) */}
            <div className="
        flex 
        overflow-x-auto 
        py-4 
        items-stretch
        -mx-2 md:mx-0  /* Optional: allows items to start/end flush with screen edges */
      ">

                {/* Render exhibition Cards */}
                {DUMMY_EXHIBITIONS.map(exhibition => (
                    <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
                ))}

                {/* 3. 'View More' Box (Pogledaj još radionica) */}
                <div className="
            min-w-[150px] 
            ml-5 mr-3 
            text-center 
            flex items-center justify-center
        ">
                    <a href="/radionice" className="
            block 
            p-5 
            border border-full border-gray-900 
            text-decoration-none text-gray-900 
            h-full 
            flex flex-col items-center justify-center 
            hover:bg-gray-50 transition-colors
          ">
                        <span className="font-semibold text-sm">Pogledaj još izložbi</span>
                        <span className="text-sm mt-1">{`->`}</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ExhibitionsSection;