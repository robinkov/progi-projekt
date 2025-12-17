import type { ReactNode } from "react";

export default function MainColumn({ children }: { children: ReactNode }) {
    return <main className="flex-1 space-y-8">{children}</main>;
}
