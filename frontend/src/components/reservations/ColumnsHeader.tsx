import React from "react";

type Props = {
  col4Label?: string;
  col5Label?: string;
};

export default function ColumnsHeader({ col4Label = "Instruktor", col5Label = "Lokacija" }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
      <div className="flex items-center text-sm text-gray-700 flex-1 min-w-0">
        <div className="w-24 flex-shrink-0">Datum</div>
        <div className="mx-2 w-[1px] h-5 bg-gray-200" />

        <div className="w-36 flex-shrink-0">Vrijeme</div>
        <div className="mx-2 w-[1px] h-5 bg-gray-200" />

        <div className="flex-1 min-w-0 pr-2">Naziv</div>
        <div className="mx-2 w-[1px] h-5 bg-gray-200" />

        <div className="w-36 flex-shrink-0">{col4Label}</div>
        <div className="mx-2 w-[1px] h-5 bg-gray-200" />

        <div className="w-36 truncate">{col5Label}</div>
      </div>
      <div className="w-28 flex-shrink-0" />
    </div>
  );
}
