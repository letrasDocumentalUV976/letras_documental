import { Movie } from "@/types";
import Image from "next/image";

const CardBook = ({
  title,
  director,
  publicationYear,
  language,
  image,
}: Movie) => {
  const shotTitle = (title: string) => {
    if (title.length > 20) {
      return title.substring(0, 20) + "...";
    }
    return title;
  };

  return (
    <div className="w-[350px] h-[200px] rounded-md shadow-md flex flex-row justify-center items-center gap-2 cursor-pointer">
      <div className="w-[40%] h-[200px] bg-primary/50 rounded-md">
        <Image
          src={image}
          alt="libro"
          width={120}
          height={200}
          className="rounded-md w-full h-full object-fill"
        />
      </div>
      <div className="w-[60%] h-[200px] px-2">
        <div>
          <label className="text-sm font-bold">Título: </label>
          <p className="text-md">{shotTitle(title)}</p>
        </div>

        <div>
          <label className="text-sm font-bold">Director: </label>
          <p className="text-md">{shotTitle(director)}</p>
        </div>

        <div>
          <label className="text-sm font-bold">Año: </label>
          <p className="text-md">{publicationYear}</p>
        </div>

        <div>
          <label className="text-sm font-bold">Idioma: </label>
          <p className="text-md">{language}</p>
        </div>
      </div>
    </div>
  );
};

export default CardBook;
