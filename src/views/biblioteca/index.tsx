"use client";

import CardBook from "@/component/CardBook";
import TextField from "@/component/TextField/TextField";
import SelectField from "@/component/SelectField/SelectField";
import { Book } from "@/types";
import {
  fetchBooks,
  fetchLoans,
  selectBooks,
  selectBooksStatus,
  selectLoans,
  selectLoansStatus,
  useV1Dispatch,
  useV1Selector,
} from "@/store";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";

const Index = () => {
  const dispatch = useV1Dispatch();
  const books = useV1Selector(selectBooks);
  const booksStatus = useV1Selector(selectBooksStatus);
  const loans = useV1Selector(selectLoans);
  const loansStatus = useV1Selector(selectLoansStatus);
  const { register, watch, setValue } = useForm();

  useEffect(() => {
    setValue("search", "");
    setValue("shelf", "");
    if (booksStatus === "idle") dispatch(fetchBooks());
    if (loansStatus === "idle") dispatch(fetchLoans());
  }, [dispatch, setValue, booksStatus, loansStatus]);

  const shelfOptions = [
    { value: "1", label: "Repisa 1" },
    { value: "2", label: "Repisa 2" },
  ];

  const search = watch("search") || "";
  const shelfFilter = watch("shelf") || "";
  const filteredBooks = books.filter((book: Book) => {
    const matchesSearch = book.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesShelf = !shelfFilter || book.location?.shelf === shelfFilter;
    return matchesSearch && matchesShelf;
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

  if (booksStatus === "loading" || booksStatus === "idle") {
    return <Loading />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Biblioteca</h2>
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
          <div className="w-full sm:w-[150px]">
            <SelectField
              placeholder="Todas las repisas"
              options={shelfOptions}
              register={register("shelf")}
            />
          </div>
        </div>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book: Book) => (
            <CardBook
              key={book.id}
              book={book}
              href={`/library/${book.id}`}
              unavailable={loanedBookIds.has(book.id)}
            />
          ))}
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default Index;
