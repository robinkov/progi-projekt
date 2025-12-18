import type { ReactNode } from "react";
import Navbar from "@/components/app/Navbar";

type PageLayoutProps = {
    children: ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            <div className="flex flex-1 justify-center">
                <div className="flex w-full max-w-7xl gap-6 px-6 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
