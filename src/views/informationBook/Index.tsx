"use client";

import Location from "@/component/Location/Location";
import { fetchBooks, selectBooks, useV1Dispatch, useV1Selector } from "@/store";
import { Book } from "@/types";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import Loading from "@/component/Loader/Loader";

const Index = () => {
  const dispatch = useV1Dispatch();
  const books = useV1Selector(selectBooks);
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (books.length > 0) {
      const found = books.find((item) => item.id === id);
      if (found) {
        setBook(found);
      }
      setIsLoading(false);
    } else {
      dispatch(fetchBooks())
        .unwrap()
        .then((items) => {
          const found = items.find((item) => item.id === id);
          if (found) setBook(found);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, books, dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-col flex lg:flex-row justify-center items-center my-5 gap-5 relative">
      <IoMdArrowRoundBack
        size={32}
        className="absolute top-0 left-5 cursor-pointer"
        onClick={() => {
          router.back();
        }}
      />

      <div className="mt-9 shadow-md rounded-md p-5 flex justify-center flex-col gap-4">
        <picture className="flex justify-center items-center">
          <Image
            width={200}
            height={280}
            alt={"Imagen de " + "titulo"}
            src={book?.image || ""}
            className="rounded-md"
          />
        </picture>
        <article className="text-center">
          <h1 className="text-2xl  flex justify-center items-center   font-bold">
            <strong className="max-w-[300px]">{book?.title}</strong>
          </h1>
          <p className="text-lg">Año: {book?.publicationYear}</p>
          <p className="text-lg">Autor: {book?.author}</p>
          <p className="text-lg">Editorial: {book?.publisher}</p>
          <p className="text-lg">No. Páginas: {book?.pageCount}</p>
          {book?.quantity && (
            <p className="text-lg">Cantidad: {book?.quantity}</p>
          )}
        </article>
      </div>

      <div className=" w-[320px] md:w-[50%] mx-5 flex-col flex gap-5">
        {book?.description && (
          <div>
            <h2 className="font-bold text-2xl my-2">Descripción</h2>
            <p className="text-justify leading-8">{book?.description}</p>
          </div>
        )}
        <div>
          <h2 className="font-bold text-2xl my-2">Ubicación</h2>
          <Location
            selectedCell={{
              row: book?.location.row || 0,
              col: book?.location.column || 0,
            }}
            setSelectedCell={() => {}}
            row={book?.location.shelf === "1" ? 3 : 4}
            col={book?.location.shelf === "1" ? 5 : 6}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
