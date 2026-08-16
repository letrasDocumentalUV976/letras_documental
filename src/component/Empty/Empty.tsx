import { HiOutlineInbox } from "react-icons/hi2";

const Empty = () => {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 px-5 py-16 text-center">
      <HiOutlineInbox className="text-primary/40" size={56} />
      <p className="text-base font-semibold text-gray-700">
        Aún no hay nada por aquí
      </p>
      <p className="max-w-xs text-sm text-gray-500">
        Cuando agregues contenido, lo verás reflejado en este espacio.
      </p>
    </div>
  );
};

export default Empty;
