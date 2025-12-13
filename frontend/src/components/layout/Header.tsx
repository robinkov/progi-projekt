import { LoadingButton } from "@/components/ui/button";

type HeaderProps = {
    userEmail?: string;
    onLogout: () => void;
    logoutLoading: boolean;
};

export default function Header({
    userEmail,
    onLogout,
    logoutLoading,
}: HeaderProps) {
    return (
        <header>
            <div className="flex items-center justify-between h-16 px-6 border-b bg-white">
                {/* Left: App + primary nav */}
                <div className="flex items-center gap-6">
                    <div>hamburger ovdje</div>
                    <nav>
                        <a
                            href="/shop"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Web shop
                        </a>
                    </nav>



                </div>

                <div>
                    <span className="text-lg font-semibold">ClayPlay</span>
                </div>

                <div className="flex items-center gap-4">
                    <div>zvono</div>
                    {userEmail && (
                        <span className="text-sm text-gray-600">{userEmail}</span>
                    )}

                    <LoadingButton loading={logoutLoading} onClick={onLogout}>
                        Logout
                    </LoadingButton>
                </div>
            </div>
        </header>

    );
}
