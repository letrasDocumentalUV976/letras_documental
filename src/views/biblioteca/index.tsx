"use client";

import CardBook from "@/component/CardBook";
import TextField from "@/component/TextField/TextField";
import { Book } from "@/types";
import {
  fetchBooks,
  selectBooks,
  selectBooksStatus,
  useV1Dispatch,
  useV1Selector,
} from "@/store";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";

const Index = () => {
  const dispatch = useV1Dispatch();
  const books = useV1Selector(selectBooks);
  const booksStatus = useV1Selector(selectBooksStatus);
  const { register, watch, setValue } = useForm();

  useEffect(() => {
    setValue("search", "");
    dispatch(fetchBooks());
  }, [dispatch, setValue]);

  const search = watch("search") || "";
  const filteredBooks = books.filter((book: Book) =>
    book.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (booksStatus === "loading" || booksStatus === "idle") {
    return <Loading />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Biblioteca</h2>
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
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book: Book) => (
            <CardBook key={book.id} book={book} href={`/library/${book.id}`} />
          ))}
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default Index;
