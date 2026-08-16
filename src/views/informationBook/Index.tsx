"use client";

import Location from "@/component/Location/Location";
import { fetchBooks, selectBooks, useV1Dispatch, useV1Selector } from "@/store";
import { Book } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import Loading from "@/component/Loader/Loader";

const Index = () => {
  const dispatch = useV1Dispatch();
  const books = useV1Selector(selectBooks);
  const params = useParams();
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
    <div className="mx-auto w-full max-w-7xl p-5">
      <Link
        href="/library"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
      >
        <IoArrowBack size={16} />
        Volver a Biblioteca
      </Link>

      {!book ? (
        <div className="mt-10 text-center">
          <p className="text-lg font-semibold text-gray-800">
            Libro no encontrado
          </p>
          <p className="text-sm text-gray-500">
            Es posible que haya sido eliminado o el enlace sea incorrecto.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="relative mx-auto h-[320px] w-[220px] shrink-0 overflow-hidden rounded-xl bg-primary/10 shadow-md lg:mx-0">
              <Image
                src={book.image}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {book.title}
              </h1>
              <p className="mt-1 text-gray-500">{book.author}</p>

              {book.type && (
                <span className="mt-3 inline-block w-fit rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {book.type}
                </span>
              )}

              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Año
                  </p>
                  <p className="text-gray-800">{book.publicationYear}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Editorial
                  </p>
                  <p className="text-gray-800">{book.publisher}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Páginas
                  </p>
                  <p className="text-gray-800">{book.pageCount}</p>
                </div>
                {!!book.quantity && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Ejemplares
                    </p>
                    <p className="text-gray-800">{book.quantity}</p>
                  </div>
                )}
              </div>

              {book.description && (
                <div className="mt-6">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Descripción
                  </h2>
                  <p className="mt-2 text-justify leading-7 text-gray-700">
                    {book.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Ubicación física
            </h2>
            <div className="overflow-x-auto">
              <Location
                selectedCell={{
                  row: book.location.row || 0,
                  col: book.location.column || 0,
                }}
                setSelectedCell={() => {}}
                row={book.location.shelf === "1" ? 3 : 4}
                col={book.location.shelf === "1" ? 5 : 6}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
