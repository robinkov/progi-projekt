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
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Neodobrene prijave za Vaše izložbe</h1>
                <p className="text-muted-foreground mt-2 font-medium">Pregledajte i odobrite prijave polaznika</p>
            </header>

            {registrations.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
                    <Users className="mx-auto h-12 w-12 stroke-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold text-foreground">Nema prijava</h3>
                    <p className="text-muted-foreground">U toku ste! Nove prijave će se pojaviti ovdje.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {registrations.map((reg) => (
                        <div
                            key={reg.id}
                            className="group relative bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full bg-muted shrink-0 overflow-hidden border border-border">
                                    {reg.participant_profile_photo_url ? (
                                        <img
                                            src={reg.participant_profile_photo_url}
                                            alt={reg.participant_username}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                            <User size={24} />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-foreground">
                                        {reg.participant_username || "Anonymous"}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} className="text-primary" />
                                            {new Date(reg.exhibition_date_time).toLocaleDateString('hr-HR')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} className="text-primary" />
                                            {new Date(reg.exhibition_date_time).toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 md:px-6">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">Prijava za</div>
                                <div className="font-bold text-foreground">{reg.exhibition_title}</div>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent/30 text-accent-foreground border border-accent">
                                        {reg.number_of_already_approved_participants} polaznika odobreno
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    disabled={approvingId === reg.id}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px] rounded-xl shadow-sm"
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