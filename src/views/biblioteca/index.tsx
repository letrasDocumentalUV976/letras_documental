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

  const filterBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(watch("search")?.toLowerCase())
  );

  if (booksStatus === "loading" || booksStatus === "idle") {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center p-5">
        <p className="text-2xl font-bold">Biblioteca</p>
        <div className="w-[200px] lg:w-[400px]">
          <TextField
            label="Búsqueda"
            placeholder="Búsqueda"
            value={watch("search")}
            type={"text"}
            isLabel={false}
            {...register("search")}
          />
        </div>
      </div>
      {filterBooks.length > 0 ? (
        <>
          <div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 p-5 w-full">
            {filterBooks?.map((book: Book, index: number) => (
              <CardBook key={index} {...book} />
            ))}
          </div>
        </>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default Index;
