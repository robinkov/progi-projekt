import { useState, useEffect } from "react";
import { supabase } from '@/config/supabase';
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import {
    Check,
    User,
    Calendar,
    Users,
    Clock,
    Loader2, // Import Loader icon
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Types ---
type Registration = {
    id: number;
    participant_username?: string;
    participant_profile_photo_url?: string;
    exhibition_title: string;
    exhibition_date_time: string;
    number_of_already_approved_participants: string;
}

type RegistrationsResponse = {
    success: boolean;
    registrations: Registration[];
}

export default function Pending() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    // Track which ID is currently being approved
    const [approvingId, setApprovingId] = useState<number | null>(null);

    useEffect(() => {
        async function loadRegistrations() {
            const { data } = await supabase.auth.getSession();
            if (!data.session) return;
            try {
                const res = await fetchGet<RegistrationsResponse>("/organizer/pending", {
                    Authorization: `Bearer ${data.session.access_token}`,
                });

                if (res.success) {
                    setRegistrations(res.registrations);
                }
            } catch (err) {
                console.error("Failed to load registrations", err);
            } finally {
                setLoading(false);
            }
        }
        loadRegistrations();
    }, []);

    const handleApprove = async (id: number) => {
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;

        setApprovingId(id); // Start loading for this specific button
        try {
            const res = await fetchPost<RegistrationsResponse>(`/organizer/approve/${id}`, {}, {
                Authorization: `Bearer ${data.session.access_token}`,
            });

            if (res.success) {
                setRegistrations(prev => prev.filter(r => r.id !== id));
            }
        } catch (err) {
            console.error("Failed to approve registration", err);
        } finally {
            setApprovingId(null); // Stop loading
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin mr-2" />
                Učitavanje registracija...
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#0f172a]">Neodobrene prijave za Vaše izložbe</h1>
                <p className="text-slate-500 mt-2">Pregledajte i odobrite prijave</p>
            </header>

            {registrations.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <Users className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-4 text-lg font-medium text-slate-900">Nema prijava</h3>
                    <p className="text-slate-500">U toku ste! Nove prijave će se pojaviti ovdje</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {registrations.map((reg) => (
                        <div
                            key={reg.id}
                            className="group relative bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                                    {reg.participant_profile_photo_url ? (
                                        <img
                                            src={reg.participant_profile_photo_url}
                                            alt={reg.participant_username}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-400">
                                            <User size={24} />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">
                                        {reg.participant_username || "Anonymous"}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} className="text-[#4d7c0f]" />
                                            {new Date(reg.exhibition_date_time).toLocaleDateString('hr-HR')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} className="text-[#4d7c0f]" />
                                            {new Date(reg.exhibition_date_time).toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 md:px-6">
                                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Prijava za</div>
                                <div className="font-medium text-slate-800">{reg.exhibition_title}</div>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-[#4d7c0f] border border-green-100">
                                        {reg.number_of_already_approved_participants} polaznika odobreno
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    disabled={approvingId === reg.id}
                                    className="text-white min-w-[100px]"
                                    onClick={() => handleApprove(reg.id)}
                                >
                                    {approvingId === reg.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Check size={18} className="mr-2" />
                                            Odobri
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}