import { useAuth } from "@/components/context/AuthProvider";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { fetchPost } from "@/utils/fetchUtils";
import { supabase } from "@/config/supabase";
import RoleChoose from "@/pages/roleChoose/roleChoose";


export default function RoleChooseLayout() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.status !== "authenticated") {
      navigate("/", { replace: true });
    } 
  }, [auth.status]);

  const handleSelect = async (role: UserRole) => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData?.session) return;

            const token = sessionData.session.access_token;

            await fetchPost("/setrole", { role }, {
            Authorization: `Bearer ${token}`
            });

            // Update AuthContext immediately
            auth.setUser(prev => prev ? { ...prev, role } : null);

            navigate("/", { replace: true });
        } catch (error) {
            console.error("Failed to save role", error);
        }
    };


  return (
    <div className="flex flex-1 items-center justify-center">
      <RoleChoose onSelect={handleSelect} />
    </div>
  );
}
