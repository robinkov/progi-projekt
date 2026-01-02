import { supabase } from '@/config/supabase';
import { fetchGet, fetchPost } from '@/utils/fetchUtils';
import { useState, useEffect } from 'react';
// shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    CheckCircle,
    Mail,
    Phone,
    MapPin,
    Loader2,
    ShieldCheck,
    Info,
    ExternalLink
} from "lucide-react";
import { useNavigate } from 'react-router';

type Profile = {
    id: number //organizer_id
    profile_name: string
    logo_photo_url: string
    banner_photo_url: string
    description: string
    address: string
    mail: string
    phone: string
}

export default function ProfileApproval() {
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [idBeingApproved, setIdBeingApproved] = useState<number | null>(null);
    const navigate = useNavigate()

    async function fetchData() {
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;
        try {
            const res = await fetchGet<{ success: boolean; profiles: Profile[] }>("/admin/pending", {
                Authorization: `Bearer ${data.session.access_token}`,
            });

            if (res.success) {
                //console.log(res.profiles)
                setProfiles(res.profiles);
            }
        } catch (err) {
            console.error("Failed to load registrations", err);
        } finally {
            setLoading(false);
        }
    }

    async function approve(organizer_id: number) {
        setIdBeingApproved(organizer_id);
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;
        try {
            const res = await fetchPost<{ success: boolean }>(`/admin/approve-organizer/${organizer_id}`, {}, {
                Authorization: `Bearer ${data.session.access_token}`,
            });

            if (res.success) {
                setProfiles(prev => prev.filter(p => p.id !== organizer_id));
            }
        }
        finally {
            setIdBeingApproved(null);

        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium animate-pulse">Dohvaćanje profila za odobrenje...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 space-y-8">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Admin Panel</Badge>
                    </div>
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Odobravanje Profila</h1>
                    <p className="text-muted-foreground mt-1">Pregledajte nove zahtjeve za registraciju organizatora.</p>
                </div>
                {profiles.length > 0 && (
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                        {profiles.length} Na čekanju
                    </Badge>
                )}
            </header>

            {profiles.length === 0 ? (
                /* --- Empty State --- */
                <div className="text-center py-24 px-6 bg-muted/20 rounded-4xl border-2 border-dashed border-border flex flex-col items-center">
                    <div className="bg-card w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
                        <CheckCircle className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Sve je čisto!</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mt-2 text-lg">
                        Trenutno nema novih profila koji čekaju na tvoje odobrenje.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {profiles.map((profile) => (
                        <Card key={profile.id} className="overflow-hidden border-border bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
                            {/* Banner Background */}
                            <div className="h-32 bg-primary/10 relative">
                                {profile.banner_photo_url && (
                                    <img src={profile.banner_photo_url} className="w-full h-full object-cover opacity-60" alt="Banner" />
                                )}
                            </div>

                            <CardContent className="p-0">
                                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                                    {/* Identity Section */}
                                    <div className="flex flex-col items-center md:items-start -mt-20 relative z-10">
                                        <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                                            <AvatarImage src={profile.logo_photo_url} className="object-cover" />
                                            <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                                                {profile.profile_name?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="mt-4 text-center md:text-left">
                                            <h2 className="text-2xl font-bold text-foreground">{profile.profile_name}</h2>
                                            <Badge variant="secondary" className="mt-1 font-semibold">Novi Organizator</Badge>
                                        </div>
                                    </div>

                                    {/* Detailed Info Grid */}
                                    <div className="flex-1 space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 text-sm text-foreground/80 font-medium">
                                                <div className="bg-muted p-2 rounded-lg"><Mail className="w-4 h-4 text-primary" /></div>
                                                <span className="truncate">{profile.mail}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-foreground/80 font-medium">
                                                <div className="bg-muted p-2 rounded-lg"><Phone className="w-4 h-4 text-primary" /></div>
                                                <span>{profile.phone ? (profile.phone) : ("Nije navedeno")}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-foreground/80 font-medium sm:col-span-2">
                                                <div className="bg-muted p-2 rounded-lg"><MapPin className="w-4 h-4 text-primary" /></div>
                                                <span>{profile.address ? (profile.address) : ("Nije navedeno")}</span>
                                            </div>
                                        </div>

                                        <Separator className="opacity-50" />

                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                                                <Info className="w-3 h-3" /> Opis Profila
                                            </h4>
                                            <p className="text-foreground/70 text-sm leading-relaxed bg-muted/30 p-4 rounded-xl italic">
                                                "{profile.description}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Section */}
                                    <div className="flex flex-col justify-center items-center md:border-l border-border md:pl-8 gap-3">
                                        <Button
                                            onClick={() => approve(profile.id)}
                                            disabled={idBeingApproved === profile.id}
                                            className="w-full min-w-40 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl py-6 font-bold transition-transform active:scale-95"
                                        >
                                            {idBeingApproved === profile.id ? (
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            ) : (
                                                <CheckCircle className="mr-2 h-5 w-5" />
                                            )}
                                            Odobri Profil
                                        </Button>
                                        <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground text-xs" onClick={() => navigate(`/organizer/${profile.id}`)}>
                                            <ExternalLink className="mr-2 h-3 w-3" /> Pogledaj Detalje
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}