"use client";

import CardBook from "@/component/CardBook";
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
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";
import ConfirmModal from "@/component/ConfirmModal/ConfirmModal";

const Index = () => {
  const dispatch = useV1Dispatch();
  const books = useV1Selector(selectBooks);
  const booksStatus = useV1Selector(selectBooksStatus);
  const router = useRouter();
  const { register, watch, setValue } = useForm();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Book | null>(null);

  useEffect(() => {
    setValue("search", "");
    dispatch(fetchBooks());
  }, [dispatch, setValue]);

  const search = watch("search") || "";
  const filteredBooks = books.filter((book: Book) =>
    book.title?.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const book = pendingDelete;

    setDeletingId(book.id);
    dispatch(deleteBook(book.id))
      .unwrap()
      .then(() => {
        toast.success("Libro eliminado correctamente");
      })
      .catch(() => {
        toast.error("Error al eliminar el libro");
      })
      .finally(() => {
        setDeletingId(null);
        setPendingDelete(null);
      });
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
            <CardBook
              key={book.id}
              book={book}
              actions={
                <>
                  <button
                    onClick={() => router.push(`/books/edit/${book.id}`)}
                    aria-label={`Editar ${book.title}`}
                    className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary"
                  >
                    <MdModeEditOutline size={20} />
                  </button>
                  <button
                    onClick={() => setPendingDelete(book)}
                    disabled={deletingId === book.id}
                    aria-label={`Eliminar ${book.title}`}
                    className="rounded-md p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <MdDelete size={20} />
                  </button>
                </>
              }
            />
          ))}
        </div>
      ) : (
        <Empty />
      )}

      <ConfirmModal
        open={!!pendingDelete}
        title="Eliminar libro"
        description={`¿Eliminar "${pendingDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={!!deletingId}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default Index;
