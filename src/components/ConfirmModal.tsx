interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function ConfirmModal({
  isOpen,
  title,
  message,
  loading = false,
  onClose,
  onConfirm
}: ConfirmModalProps) {

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl">

        <div className="flex items-center justify-between px-6 py-4 border-b">

          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            ×
          </button>

        </div>

        <div className="p-6">

          <p className="text-gray-600">
            {message}
          </p>

        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg border hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ConfirmModal;