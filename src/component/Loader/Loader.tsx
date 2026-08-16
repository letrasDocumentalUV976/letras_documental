import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 px-5 py-16 text-center">
      <AiOutlineLoading3Quarters
        className="animate-spin text-primary"
        size={32}
      />
      <p className="text-sm font-medium text-gray-500">
        Un momento, estamos cargando la información...
      </p>
    </div>
  );
};

export default Loading;
