interface HeaderProps {
    onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">

            {/* IZQUIERDA */}

            <div className="flex items-center gap-3">

                {/* BOTÓN MENÚ MÓVIL */}

                <button
                    type="button"
                    onClick={onMenuClick}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
                    aria-label="Abrir menú"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                <div>
                    <p className="text-xs text-slate-500 sm:text-sm">
                        Sistema de inventario
                    </p>
                </div>

            </div>

            {/* USUARIO */}

            <div className="flex items-center gap-2 sm:gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
                    AD
                </div>

                <div className="hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">
                        Administrador
                    </p>

                    <p className="text-xs text-slate-500">
                        Sistemas
                    </p>
                </div>

            </div>

        </header>
    );
}

export default Header;