import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchGet } from "@/utils/fetchUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Logo, LogoImage, LogoFallback } from "@/components/ui/logo";
import { Banner, BannerImage, BannerFallback } from "@/components/ui/banner";
import { supabase } from '@/config/supabase';

import {
    Mail,
    Phone,
    MapPin,
    CheckCircle2,
    ImageIcon,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";


type Organizer = {
    profile_name: string | null;
    description: string | null;
    logo_url: string | null;
    banner_url: string | null;
    approved_by_admin: boolean | null;
    photos: Photo[];
    mail: string;
    phone: string;
    address: string;
};
type Photo = { id: number; url: string; }


export default function OrganizerPreview() {
    const [organizer, setOrganizer] = useState<Organizer | null>(null)
    const [loading, setLoading] = useState(true)
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) return;

            try {


                const organizerRes = await fetchGet<Organizer>(`/organizers/${id}`);
                setOrganizer(organizerRes);


            }
            catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium animate-pulse">Dohvaćanje odabranog profila...</p>
            </div>
        )
    }

    return (<div className="w-full">
        {organizer && (
            <div className="space-y-8">
                <Button onClick={() => navigate(`/admin/pending`)}>
                    Vrati se
                </Button>
                <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                    <h2 className="text-2xl font-bold text-foreground">Ovako bi se profil prikazao drugim korisnicima:</h2>
                </div>

                <Card className="border-border bg-card shadow-md overflow-hidden">
                    <Banner className="h-48 md:h-64">
                        {organizer.banner_url ? <BannerImage src={organizer.banner_url} /> : <BannerFallback className="bg-muted">Nema naslovne slike</BannerFallback>}
                    </Banner>

                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left Column: Logo & Name */}
                            <div className="flex flex-col items-center md:items-start gap-4">
                                <Logo className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-lg -mt-20">
                                    {organizer.logo_url ? <LogoImage src={organizer.logo_url} /> : (
                                        <LogoFallback className="text-3xl font-bold bg-primary text-primary-foreground">{organizer.profile_name?.[0]}</LogoFallback>
                                    )}
                                </Logo>
                                <div className="text-center md:text-left">
                                    <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                                        {organizer.profile_name}
                                        {organizer.approved_by_admin && <CheckCircle2 className="w-6 h-6 text-primary" />}
                                    </h2>
                                </div>
                            </div>

                            {/* Right Column: Contact info */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-2xl border border-border self-start">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">E-mail</p>
                                    <a href={`mailto:${organizer.mail}`} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
                                        <Mail className="w-4 h-4" /> {organizer.mail || "Nije navedeno"}
                                    </a>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Telefon</p>
                                    <p className="flex items-center gap-2 text-foreground font-medium">
                                        <Phone className="w-4 h-4" /> {organizer.phone || "Nije navedeno"}
                                    </p>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Adresa</p>
                                    <p className="flex items-center gap-2 text-foreground font-medium">
                                        <MapPin className="w-4 h-4" /> {organizer.address || "Nije navedeno"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-bold text-foreground mb-2">Opis organizatora</h3>
                            <p className="text-foreground/70 leading-relaxed italic">"{organizer.description}"</p>
                        </div>

                        {/* --- Gallery Section --- */}
                        {organizer.photos && organizer.photos.length > 0 && (
                            <div className="mt-12 space-y-6">
                                <div className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-primary" />
                                    <h3 className="text-xl font-bold text-foreground">Slike s prethodnih događaja</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {organizer.photos.map((photo) => (
                                        <div key={photo.id} className="group aspect-square rounded-xl overflow-hidden border border-border bg-muted">
                                            <img src={photo.url} alt="Rad" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        )}
    </div>)
}