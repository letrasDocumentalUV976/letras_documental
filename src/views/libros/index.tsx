"use client";

import LinkButton from "@/component/LinkButton/LinkButton";
import TextField from "@/component/TextField/TextField";
import { Book } from "@/types";
import {
  deleteBook,
  fetchBooks,
  selectBooks,
  selectBooksStatus,
  useV1Dispatch,
  useV1Selector,
} from "@/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";

const Index = () => {
  const dispatch = useV1Dispatch();
  const books = useV1Selector(selectBooks);
  const booksStatus = useV1Selector(selectBooksStatus);
  const router = useRouter();
  const { register, watch, setValue } = useForm();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setValue("search", "");
    dispatch(fetchBooks());
  }, [dispatch, setValue]);

  const search = watch("search") || "";
  const filteredBooks = books.filter((book: Book) =>
    book.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (book: Book) => {
    if (deletingId) return;
    if (
      !window.confirm(
        `¿Eliminar "${book.title}"? Esta acción no se puede deshacer.`
      )
    )
      return;

    setDeletingId(book.id);
    dispatch(deleteBook(book.id))
      .unwrap()
      .then(() => {
        toast.success("Libro eliminado correctamente");
      })
      .catch(() => {
        toast.error("Error al eliminar el libro");
      })
      .finally(() => setDeletingId(null));
  };

  if (booksStatus === "loading" || booksStatus === "idle") return <Loading />;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Libros</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-[220px] lg:w-[320px]">
            <TextField
              label="Búsqueda"
              placeholder="Buscar por título..."
              value={watch("search")}
              type="text"
              isLabel={false}
              {...register("search")}
            />
          </div>
          <LinkButton href="/books/add" text="Agregar Libro" />
        </div>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book: Book) => (
            <div
              key={book.id}
              className="flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="relative h-40 w-full shrink-0 bg-primary/10">
                {book.image ? (
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-primary/40">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1 p-4">
                <h3
                  className="line-clamp-1 font-bold text-gray-800"
                  title={book.title}
                >
                  {book.title}
                </h3>
                <p className="line-clamp-1 text-sm text-gray-500">
                  {book.author}
                </p>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>Año: {book.publicationYear}</span>
                  <span>Páginas: {book.pageCount}</span>
                </div>
                <p className="line-clamp-1 text-xs text-gray-500">
                  {book.publisher}
                </p>
                {book.type && (
                  <span className="mt-2 inline-block w-fit rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {book.type}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-3">
                <button
                  onClick={() => router.push(`/books/edit/${book.id}`)}
                  aria-label={`Editar ${book.title}`}
                  className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary"
                >
                  <MdModeEditOutline size={20} />
                </button>
                <button
                  onClick={() => handleDelete(book)}
                  disabled={deletingId === book.id}
                  aria-label={`Eliminar ${book.title}`}
                  className="rounded-md p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MdDelete size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default Index;
