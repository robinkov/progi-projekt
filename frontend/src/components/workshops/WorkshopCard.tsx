// src/components/workshops/WorkshopCard.tsx

import React from 'react';

interface Workshop {
    id: number;
    date: string;
    time?: string;
    title: string;
    instructor: string;
    location?: string;
}

interface WorkshopCardProps {
    workshop: Workshop;
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop }) => {
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
                    {workshop.date} {workshop.time && ` | ${workshop.time}`}
                </p>

                <h3 className="text-lg font-semibold my-1 text-gray-900">
                    {workshop.title}
                </h3>

                <p className="text-sm mb-3 text-gray-700">
                    {workshop.instructor}
                </p>

                {workshop.location && (
                    <p className="text-xs text-gray-500">
                        {workshop.location}
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

export default WorkshopCard;