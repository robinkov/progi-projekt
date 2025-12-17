// src/components/workshops/WorkshopCard.tsx

import React from 'react';

interface Exhibition {
    id: number;
    date: string;
    time?: string;
    title: string;
    organizer: string;
    location?: string;
}

interface ExhibitionCardProps {
    exhibition: Exhibition;
}

const ExhibitionCard: React.FC<ExhibitionCardProps> = ({ exhibition }) => {
    return (
        <div className="
        border border-full border-gray-900 
        p-4 mr-5 
        min-w-[220px] max-w-xs 
        flex-shrink-0 
        flex flex-col justify-between 
        hover:shadow-md transition-shadow
    ">

            {/* Workshop Details */}
            <div className="workshop-info">
                <p className="text-sm mb-1 font-bold text-gray-700">
                    {exhibition.date} {exhibition.time && ` | ${exhibition.time}`}
                </p>

                <h3 className="text-lg font-semibold my-1 text-gray-900">
                    {exhibition.title}
                </h3>

                <p className="text-sm mb-3 text-gray-700">
                    {exhibition.organizer}
                </p>

                {exhibition.location && (
                    <p className="text-xs text-gray-500">
                        {exhibition.location}
                    </p>
                )}
            </div>

            {/* Visual Placeholder (Matching the sketch's empty box) */}
            <div className="
        
      ">
                {/* Placeholder for optional brief summary */}
            </div>

        </div>
    );
};

export default ExhibitionCard;