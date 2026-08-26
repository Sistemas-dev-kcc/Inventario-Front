function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      <div>
        <p className="text-sm text-gray-500">
          Sistema de inventario
        </p>
      </div>

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold">
          AD
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-medium">
            Administrador
          </p>

          <p className="text-xs text-gray-500">
            Sistemas
          </p>
        </div>

      </div>

    </header>
  );
}

export default Header;