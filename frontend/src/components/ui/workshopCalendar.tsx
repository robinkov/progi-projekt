// components/app/WorkshopCalendar.tsx
'use client'

import { CalendarDays } from "lucide-react"

export default function WorkshopCalendar() {
  // Tvoj specifični Google Calendar URL
  const calendarSrc = "https://calendar.google.com/calendar/embed?src=a924cdd99b3045ce38c0fa6691f92b2ed1d321262f3110d5d8c6c92521d37a3b%40group.calendar.google.com&ctz=Europe%2FBelgrade"

  return (
    <div className="w-full space-y-4">
      {/* Header kalendara */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <CalendarDays className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">Raspored termina</h3>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Provjerite dostupnost radionica</p>
          </div>
        </div>
        
        <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          Uživo ažurirano
        </span>
      </div>
      
      {/* Iframe Kontejner */}
      <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 bg-white">
        <div className="aspect-4/3 md:aspect-video w-full">
          <iframe
            src={calendarSrc}
            style={{ border: 0 }}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>
      </div>

      {/* Napomena ispod kalendara */}
      <div className="flex items-start gap-2 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100/50">
        <span className="text-blue-500 text-sm">ℹ</span>
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
          Kliknite na pojedini termin u kalendaru za više detalja. Nakon odabira slobodnog termina, nastavite na plaćanje.
        </p>
      </div>
    </div>
  )
}