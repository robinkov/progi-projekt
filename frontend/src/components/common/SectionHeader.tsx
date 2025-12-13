import React from 'react';

interface SectionHeaderProps {
    title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
    return (
        <div className="

    ">
            <h2 className="
        text-xl 
        font-semibold 
        text-gray-900
      ">
                {title}
            </h2>
        </div>
    );
};

export default SectionHeader;