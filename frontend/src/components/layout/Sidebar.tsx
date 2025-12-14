import type { ReactNode } from "react";

export default function Sidebar({ children }: { children: ReactNode }) {
    return <aside className="w-30 shrink-0 space-y-6">{children}</aside>;
}
