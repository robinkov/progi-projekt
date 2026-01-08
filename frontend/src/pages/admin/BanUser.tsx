import { supabase } from '@/config/supabase';
import { fetchDelete, fetchGet } from '@/utils/fetchUtils';
import { useState } from 'react';
// shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Search,
    Mail,
    UserX,
    Loader2,
    ShieldAlert,
    User as UserIcon,
    AlertTriangle
} from "lucide-react";

type User = {
    id: number
    first_name: string;
    last_name: string;
    username: string;
    mail: string;
    profile_photo_url: string;
}

export default function BanUser() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [banningUser, setBanningUser] = useState<number | null>(null);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;

        try {
            const res = await fetchGet<{ success: boolean; users: User[] }>(
                `/admin/users/search?q=${searchQuery}`,
                { Authorization: `Bearer ${data.session.access_token}` }
            );

            if (res.success) {
                setUsers(res.users);
            }
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleBan(id: number) {
        setBanningUser(id);

        const { data } = await supabase.auth.getSession();
        if (!data.session) return;

        try {
            const res = await fetchDelete<{ success: boolean }>(
                `/admin/users/delete/${id}`,
                { Authorization: `Bearer ${data.session.access_token}` }
            );

            if (res.success) {
                setUsers(prev => prev.filter(u => u.id !== id));
            }
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setBanningUser(null);
        }

    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
            {/* Header */}
            <div className="space-y-2 border-b border-border pb-6">
                <div className="flex items-center gap-2 text-destructive">
                    <ShieldAlert className="w-6 h-6" />
                    <Badge variant="destructive" className="font-bold">Admin Sigurnost</Badge>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Upravljanje Korisnicima</h1>
                <p className="text-muted-foreground italic">Pretražite korisnike po e-mailu i upravljajte njihovim pristupom platformi.</p>
            </div>

            {/* Search Bar */}
            <Card className="border-none shadow-md bg-card overflow-hidden">
                <CardContent className="p-6">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Unesite e-mail korisnika (npr. marko@mail.com)..."
                                className="pl-10 h-12 bg-muted/30 border-none focus-visible:ring-primary/30"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="h-12 px-8 font-bold">
                            {loading ? <Loader2 className="animate-spin" /> : "Pretraži"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Results List */}
            <div className="space-y-4">
                {users.length > 0 ? (
                    users.map((u) => (
                        <Card key={u.id} className="group hover:border-destructive/30 transition-all duration-300">
                            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-14 w-14 border border-border">
                                        {u.profile_photo_url ? (<AvatarImage src={u.profile_photo_url} />) : (
                                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                            {u.first_name[0]}{u.last_name[0]}
                                        </AvatarFallback>)}
                                        
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            {u.first_name} {u.last_name}
                                            <span className="text-sm font-normal text-muted-foreground">@{u.username}</span>
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Mail className="w-3.5 h-3.5" />
                                            {u.mail}
                                        </div>
                                    </div>
                                </div>

                                {/* Ban Button with AlertDialog Confirmation */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            className="w-full sm:w-auto font-bold gap-2 rounded-xl"
                                            disabled={banningUser === u.id}
                                        >
                                            {banningUser === u.id ? <Loader2 className="animate-spin h-4 w-4" /> : <UserX className="w-4 h-4" />}
                                            Ukloni korisnika
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-2xl">
                                        <AlertDialogHeader>
                                            <div className="flex items-center gap-3 text-destructive mb-2">
                                                <div className="p-2 bg-destructive/10 rounded-full">
                                                    <AlertTriangle className="h-6 w-6" />
                                                </div>
                                                <AlertDialogTitle className="text-xl">Jeste li potpuno sigurni?</AlertDialogTitle>
                                            </div>
                                            <AlertDialogDescription className="text-base leading-relaxed">
                                                Ova radnja će ukloniti korisnika <span className="font-bold text-foreground">{u.first_name} {u.last_name}</span> ({u.mail}).
                                                Izbrisat će se svi podaci o ovom korisniku i on će se morati registrirati ispočetka.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="mt-6">
                                            <AlertDialogCancel className="rounded-xl border-none bg-muted hover:bg-muted/80">Odustani</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleBan(u.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl px-6 font-bold"
                                            >
                                                Potvrdi Brisanje
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                    ))
                ) : !loading && searchQuery && (
                    <div className="text-center py-16 bg-muted/10 rounded-4xl border-2 border-dashed border-border">
                        <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-foreground">Korisnik nije pronađen</h3>
                        <p className="text-muted-foreground mt-1">Provjerite jeste li ispravno upisali e-mail adresu.</p>
                    </div>
                )}
            </div>
        </div>
    );
}