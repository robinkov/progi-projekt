import type { ReactNode } from "react";

type PageLayoutProps = {
    header: ReactNode;
    children: ReactNode;
};

export default function PageLayout({ header, children }: PageLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {header}

            <div className="flex flex-1 justify-center">
                <div className="flex w-full max-w-7xl gap-6 px-6 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
