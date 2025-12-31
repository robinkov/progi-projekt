import { useState } from "react"
import { useEffect } from "react"
import { supabase } from '@/config/supabase';
import { fetchGet } from "@/utils/fetchUtils";
import { useParams } from "react-router";

type User = {
    id: number
    username: string
    profile_photo_url: string
}

type Comment = {
    id: number
    user: User
    content: string
    photo_url: string
    created_at: string
}

type CommentsResponse = {
    success: boolean
    comments: Comment[]
}

export default function ForumPage() {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { id } = useParams<{ id: string }>();


        async function loadComments() {
            const { data } = await supabase.auth.getSession();
            if (!data.session) return;
            try {
                const res = await fetchGet<CommentsResponse>(`/forum/${id}`,
                    {
                        Authorization: `Bearer ${data.session.access_token}`,
                    });

                if (res.success) {
                    setComments(res.comments);
                }
            } catch (err) {
                console.error("Failed to load exhibitions", err);
            } finally {
                setLoading(false);
            }
        }

        loadComments();
    }, []);

    return <div></div>
}