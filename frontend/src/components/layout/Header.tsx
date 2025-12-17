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
                    <LoadingButton>&#9776;</LoadingButton>
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
                    <a href="/"><span className="text-lg font-semibold">ClayPlay</span></a>
                </div>

                <div className="flex items-center gap-4">
                    <div>zvono</div>
                    {userEmail && (
                        <a href="mypage"><span className="text-sm text-gray-600">{userEmail}</span></a>
                    )}

                    <LoadingButton loading={logoutLoading} onClick={onLogout}>
                        Logout
                    </LoadingButton>
                </div>
            </div>
        </header>

    );
}
