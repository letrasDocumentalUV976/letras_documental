"use client";

import CardBook from "@/component/CardBook";
import LinkButton from "@/component/LinkButton/LinkButton";
import TextField from "@/component/TextField/TextField";
import SelectField from "@/component/SelectField/SelectField";
import { Book } from "@/types";
import {
  deleteBook,
  fetchBooks,
  fetchLoans,
  selectBooks,
  selectBooksStatus,
  selectLoans,
  selectLoansStatus,
  useV1Dispatch,
  useV1Selector,
} from "@/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
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
  const loans = useV1Selector(selectLoans);
  const loansStatus = useV1Selector(selectLoansStatus);
  const router = useRouter();
  const { register, watch, setValue } = useForm();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Book | null>(null);

  useEffect(() => {
    setValue("search", "");
    setValue("type", "");
    setValue("shelf", "");
    if (booksStatus === "idle") dispatch(fetchBooks());
    if (loansStatus === "idle") dispatch(fetchLoans());
  }, [dispatch, setValue, booksStatus, loansStatus]);

  const typeOptions = useMemo(() => {
    const types = new Set<string>();
    books.forEach((book: Book) =>
      book.type
        ?.split(",")
        .map((type) => type.trim())
        .filter(Boolean)
        .forEach((type) => types.add(type))
    );
    return Array.from(types)
      .sort((a, b) => a.localeCompare(b))
      .map((type) => ({ value: type, label: type }));
  }, [books]);

  const shelfOptions = [
    { value: "1", label: "Repisa 1" },
    { value: "2", label: "Repisa 2" },
  ];

  const search = watch("search") || "";
  const typeFilter = watch("type") || "";
  const shelfFilter = watch("shelf") || "";
  const filteredBooks = books.filter((book: Book) => {
    const matchesSearch = book.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      !typeFilter ||
      book.type
        ?.split(",")
        .map((type) => type.trim().toLowerCase())
        .includes(typeFilter.toLowerCase());
    const matchesShelf = !shelfFilter || book.location?.shelf === shelfFilter;
    return matchesSearch && matchesType && matchesShelf;
  });

  const loanedBookIds = useMemo(
    () =>
      new Set(
        loans
          .filter((loan) => loan.status === "Loaned")
          .map((loan) => loan.book.id)
      ),
    [loans]
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
      .catch((error) => {
        const message =
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : null;
        toast.error(message || "Error al eliminar el libro");
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
          <div className="w-full sm:w-[220px] lg:w-[280px]">
            <TextField
              label="Búsqueda"
              placeholder="Buscar por título..."
              value={watch("search")}
              type="text"
              isLabel={false}
              {...register("search")}
            />
          </div>
          <div className="w-full sm:w-[160px]">
            <SelectField
              placeholder="Todos los tipos"
              options={typeOptions}
              register={register("type")}
            />
          </div>
          <div className="w-full sm:w-[150px]">
            <SelectField
              placeholder="Todas las repisas"
              options={shelfOptions}
              register={register("shelf")}
            />
          </div>
          <LinkButton href="/books/add" text="Agregar Libro" />
        </div>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book: Book) => {
            const isLoaned = loanedBookIds.has(book.id);
            return (
              <CardBook
                key={book.id}
                book={book}
                unavailable={isLoaned}
                actions={
                  <>
                    <button
                      onClick={() => router.push(`/books/edit/${book.id}`)}
                      disabled={isLoaned}
                      aria-label={`Editar ${book.title}`}
                      title={
                        isLoaned
                          ? "No se puede editar: el libro está prestado"
                          : undefined
                      }
                      className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                    >
                      <MdModeEditOutline size={20} />
                    </button>
                    <button
                      onClick={() => setPendingDelete(book)}
                      disabled={isLoaned || deletingId === book.id}
                      aria-label={`Eliminar ${book.title}`}
                      title={
                        isLoaned
                          ? "No se puede eliminar: el libro está prestado"
                          : undefined
                      }
                      className="rounded-md p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                    >
                      <MdDelete size={20} />
                    </button>
                  </>
                }
              />
            );
          })}
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
