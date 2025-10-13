import { IBook } from "@/interfaces/interfacesBooks";
import Image from "next/image";
import Link from "next/link";

const CardBook = ({
  titulo,
  autor,
  anioPublicacion,
  editorial,
  imagen,
  id,
}: IBook) => {
  const shotTitle = (title: string = "") => {
    if (title.length > 20) {
      return title.substring(0, 20) + "...";
    }
    return title;
  };

  return (
    <Link
      href={`/biblioteca/${id}`}
      className="w-[350px] h-[200px] rounded-md shadow-md flex flex-row justify-center items-center gap-2 cursor-pointer"
    >
      <div className="w-[40%] h-[200px] bg-primary/50 rounded-md">
        <Image
          src={imagen}
          alt="libro"
          width={120}
          height={200}
          className="rounded-md w-full h-full object-fill"
        />
      </div>
      <div className="w-[60%] h-[200px] px-2">
        <div>
          <label className="text-sm font-bold">Título: </label>
          <p className="text-md">{shotTitle(titulo)}</p>
        </div>

        <div>
          <label className="text-sm font-bold">Autor: </label>
          <p className="text-md">{shotTitle(autor)}</p>
        </div>

        <div>
          <label className="text-sm font-bold">Año: </label>
          <p className="text-md">{anioPublicacion}</p>
        </div>

        <div>
          <label className="text-sm font-bold">Editorial: </label>
          <p className="text-md">{shotTitle(editorial)}</p>
        </div>
      </div>
    </Link>
  );
};

export default CardBook;
