import { useState, useEffect, type ChangeEvent } from "react";
import { supabase } from '@/config/supabase';
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import { useParams } from "react-router";
// shadcn components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ImagePlus, X, Send, Loader2, MapPin, Calendar, MessageSquarePlus, Info } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/components/context/AuthProvider";
import { Spinner } from "@/components/ui/spinner";
type Comment = {
    id: number;
    user_username?: string;
    user_profile_photo_url?: string;
    content: string;
    photo_url?: string;
    created_at: string;
    is_organizer: boolean,
    mail: string
}

type Exhibition = {
    id: number;
    organizer_id: number;
    title: string;
    description: string;
    date_time: string;
    location: string;
};

type Organizer = {
    profile_name: string | null;
    description: string | null;
    logo_url: string | null;
    banner_url: string | null;
    approved_by_admin: boolean | null;
};

type CommentsResponse = {
    success: boolean;
    comments: Comment[];
}

export default function ForumPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const { id } = useParams<{ id: string }>();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [posting, setPosting] = useState(false);
    const [exhibition, setExhibition] = useState<Exhibition | null>(null);
    const [organizer, setOrganizer] = useState<Organizer | null>(null);
    const [refreshing, setRefreshing] = useState(false); // State for refresh animation
    const [allowed_to_comment, setAllowedToComment] = useState(false)
    const { user } = useAuth()



    async function loadComments(isManualRefresh = false) {
        if (isManualRefresh) setRefreshing(true);
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;
        try {
            const res = await fetchGet<CommentsResponse>(`/forum/${id}/comments`, {
                Authorization: `Bearer ${data.session.access_token}`,
            });
            if (res.success) {
                setComments(res.comments);
            }
        } catch (err) {
            console.error("Failed to load comments", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }
    async function loadExhibition() {

        if (!id) return;

        try {
            setLoading(true)
            const { data } = await supabase.auth.getSession();
            if (!data.session) return;
            const exhibitionRes = await fetchGet<{
                success: boolean;
                exhibition: Exhibition;
                allowed_to_comment: boolean
            }>(`/exhibitions/${id}`, {
                Authorization: `Bearer ${data.session.access_token}`,
            });

            const organizerRes = await fetchGet<Organizer>(
                `/organizers/${exhibitionRes.exhibition.organizer_id}`
            );

            setExhibition(exhibitionRes.exhibition);
            setOrganizer(organizerRes);
            setAllowedToComment(exhibitionRes.allowed_to_comment)
        } catch (err) {
            console.error("Failed to load exhibition", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadComments();
        loadExhibition();
    }, [id]);

    async function handleImageUpload(file: File | null) {

        if (!file) {
            return null;
        }

        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) {
            return;
        }
        const userId = sessionData.session.user.id;
        const timestamp = Date.now();
        const fileExt = file.name.split(".").pop();
        const filePath = `${userId}_${timestamp}.${fileExt}`; // unique file path

        const { error: uploadError } = await supabase.storage
            .from("photos")
            .upload(filePath, file, { upsert: false }); // don’t overwrite old images

        if (uploadError) {
            console.error("Failed to upload image:", uploadError);
            return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from("photos")
            .getPublicUrl(filePath);

        if (!urlData) {
            console.error("Failed to get public URL");
            return;
        }
        return urlData.publicUrl
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handlePost = async () => {
        if (!content.trim() && !selectedImage) return;

        setPosting(true);
        try {
            const url = await handleImageUpload(selectedImage);
            const { data } = await supabase.auth.getSession();
            if (!data.session) return;

            await fetchPost(
                `/forum/${id}/post`,
                { content, url },
                { Authorization: `Bearer ${data.session.access_token}` }
            );

            setContent("");
            removeImage();
            await loadComments();
        } catch (err) {
            console.error("Posting failed", err);
        } finally {
            setPosting(false);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">

            {/* --- Exhibition & Organizer Info Header (Using Accent/Primary) --- */}
            {exhibition ? (
                <div className="bg-accent/30 border border-primary/20 rounded-3xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Aktivna rasprava</Badge>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full"
                                    onClick={() => loadComments(true)}
                                    disabled={refreshing}
                                >
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                                </Button>
                            </div>
                            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                                {exhibition.title}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-muted-foreground text-sm font-medium">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    {new Date(exhibition.date_time).toLocaleDateString("en-GB")}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {exhibition.location}
                                </div>
                            </div>
                        </div>

                        {organizer && (
                            <div className="flex items-center gap-3 bg-card p-3 rounded-2xl border border-primary">
                                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                    <AvatarImage src={organizer.logo_url || ""} />
                                    {organizer.logo_url? (<div></div>) : (<AvatarFallback>{organizer.profile_name?.[0]}</AvatarFallback>)}
                                </Avatar>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold leading-none">Organizirao</p>
                                    <p className="font-bold text-primary">{organizer.profile_name}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-full flex flex-col items-center space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>)}

            {/* --- Input Section --- */}
            {allowed_to_comment ? (
                <Card className="shadow-lg border-border/60 overflow-hidden bg-card">
                    <CardContent className="pt-6">
                        <Textarea
                            placeholder="Pridruži se raspravi..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={posting}
                            className="min-h-20 border-none focus-visible:ring-2 focus-visible:ring-ring text-lg resize-none p-0 mb-4 placeholder:text-muted-foreground/50"
                        />

                        {previewUrl && (
                            <div className="relative group w-fit mb-4">
                                <img src={previewUrl} alt="Preview" className="h-52 w-auto rounded-xl object-cover border shadow-md" />
                                <Button
                                    variant="destructive" size="icon"
                                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-lg"
                                    onClick={removeImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        <Separator className="mb-4 opacity-50" />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handleImageChange} disabled={posting} />
                                <Button variant="outline" size="sm" className="rounded-full border-border text-foreground hover:bg-accent transition-colors" asChild>
                                    <label htmlFor="photo-upload" className="cursor-pointer">
                                        <ImagePlus className="h-4 w-4 mr-2" />
                                        Slika
                                    </label>
                                </Button>
                            </div>

                            <Button
                                disabled={(!content.trim() && !selectedImage) || posting}
                                className={`rounded-full px-8 transition-all duration-300 ${posting ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
                                    }`}
                                onClick={handlePost}
                            >
                                {posting ? (
                                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Objavljujem...</>
                                ) : (
                                    <><Send className="h-4 w-4 mr-2" /> Objavi</>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-none bg-muted/40 shadow-inner overflow-hidden">
                    <CardContent className="py-10 flex flex-col items-center text-center space-y-4">
                        {/* Ikona s blagim krugom u pozadini */}
                        <div className="bg-background p-4 rounded-full shadow-sm border border-border">
                            <Info className="h-8 w-8 text-muted-foreground" />
                        </div>

                        <div className="space-y-2 max-w-[400px]">
                            <h3 className="text-xl font-bold text-foreground tracking-tight">
                                Rasprava je ograničena
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Samo korisnici koji su <span className="font-semibold text-primary">posjetili izložbu</span> mogu sudjelovati u raspravi, objavljivati komentare i fotografije.
                            </p>
                        </div>

                        {/* Dodatni savjet ili link ako je potrebno */}
                        <div className="pt-2">
                            <Badge variant="outline" className="px-4 py-1.5 border-dashed border-muted-foreground/30 text-muted-foreground font-medium">
                                Pregled dopušten svim korisnicima
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}


            {/* --- Comments Feed --- */}
            <div className="space-y-6 pt-4">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-3 duration-500">
                            <Avatar className="h-11 w-11 border-2 border-background shadow-sm">
                                {comment.user_profile_photo_url ? (<AvatarImage src={comment.user_profile_photo_url} className="object-cover" />) : (<AvatarFallback className="bg-muted font-bold">{!comment.user_profile_photo_url ? (comment.user_username ? comment.user_username[0] : "A") : ""}</AvatarFallback>)}
                                
                            </Avatar>

                            <div className="flex-1 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-foreground">{comment.user_username || "Anonymous"}</span>
                                    {comment.is_organizer ? (<Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Organizator</Badge>) : (null)}
                                    {user?.role == "admin" ? (<span className="text-sm text-foreground">({comment.mail})</span>) : (<div></div>)}
                                    <span className="text-[10px] text-muted-foreground font-medium">
                                        {new Date(comment.created_at).toLocaleString()}
                                    </span>
                                </div>

                                <div className={`text-[15px] leading-relaxed text-foreground/90 border border-border p-4 rounded-2xl ${user?.email === comment.mail ? "rounded-tr-none bg-accent" : "rounded-tl-none bg-card"} shadow-sm group-hover:shadow-md transition-shadow`}>
                                    {comment.content}
                                    {comment.photo_url && (
                                        <div className="mt-3 rounded-xl overflow-hidden border border-border/50">
                                            <img src={comment.photo_url} alt="Post content" className="max-h-[450px] w-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    /* --- Empty State --- */
                    <div className="text-center py-16 px-4 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
                        <div className="bg-card w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-border">
                            <MessageSquarePlus className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">No posts yet</h3>
                        <p className="text-muted-foreground max-w-[280px] mx-auto mt-1 text-sm">
                            Be the first one to share a comment or a photo from this exhibition!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}