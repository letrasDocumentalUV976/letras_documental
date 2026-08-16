"use client";

import { convertToBase64 } from "@/utils/Utils";
import { BookValidator } from "@/validator/BookValidator";
import React, { useEffect, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UploadImage from "@/component/UploadImage/UploadImage";
import TextField from "@/component/TextField/TextField";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import Location from "@/component/Location/Location";
import clsx from "clsx";
import { Shelf } from "@/types";
import {
  createBook,
  fetchBooks,
  selectBooks,
  selectBooksStatus,
  updateBook,
  useV1Dispatch,
  useV1Selector,
} from "@/store";

const AgregarTexto = () => {
  const dispatch = useV1Dispatch();
  const books = useV1Selector(selectBooks);
  const booksStatus = useV1Selector(selectBooksStatus);
  const [image, setImage] = useState<string>("");
  const [shelfSelected, setShelfSelected] = useState<Shelf>("2");
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [selectedCell, setSelectedCell] = useState<{
    col: number;
    row: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(BookValidator),
  });

  useEffect(() => {
    const location = {
      column: selectedCell?.col,
      row: selectedCell?.row,
      shelf: shelfSelected,
    };
    setValue("location", location);
  }, [shelfSelected, setValue, selectedCell?.col, selectedCell?.row]);

  const handleUpload = async (file: File) => {
    if (!file) return alert("Selecciona una imagen primero");
    const formData = new FormData();
    formData.append("file", file);
    const base64 = await convertToBase64(file);
    const response = await fetch("/api/cloudinary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file: base64 }),
    });
    const data = await response.json();
    if (data.url) {
      setValue("image", data.url);
      setImage(data.url);
    } else {
      alert("Error al subir la imagen");
    }
  };

  const onSubmit = (data: FieldValues) => {
    const input = {
      title: data.title,
      author: data.author,
      publisher: data.publisher,
      publicationYear: data.publicationYear,
      pageCount: data.pageCount,
      type: data.type,
      description: data.description,
      quantity: data.quantity,
      location: data.location,
      image:
        image ||
        "https://res.cloudinary.com/dvt4vznxn/image/upload/v1736555915/yivyktkgvcjxprwwnwui.png",
    };

    const result = id
      ? dispatch(updateBook({ id, input })).unwrap()
      : dispatch(createBook(input)).unwrap();

    result
      .then(() => {
        toast.success(
          id ? "Libro actualizado correctamente" : "Libro agregado correctamente"
        );
        router.push("/libros");
      })
      .catch(() => {
        toast.error(
          id ? "Error al actualizar el libro" : "Error al agregar el libro"
        );
      });
  };

  useEffect(() => {
    if (id && booksStatus === "idle") {
      dispatch(fetchBooks());
    }
  }, [id, booksStatus, dispatch]);

  useEffect(() => {
    if (!id) return;
    const book = books.find((item) => item.id === id);
    if (book) {
      reset(book);
      setImage(book.image);
      setShelfSelected(book.location.shelf);
      setSelectedCell({
        col: book.location.column ?? 0,
        row: book.location.row ?? 0,
      });
    }
  }, [id, books, reset]);

  return (
    <div className="grid grid-cols-3 p-5">
      <div className="col-span-1 flex justify-center items-start">
        <UploadImage
          image={image}
          handleImageCapture={handleUpload}
          {...register("image")}
        />
      </div>
      <div className="col-span-2">
        <p className="text-2xl font-bold">Información del libro</p>
        <form className="flex flex-col justify-center items-center gap-5 py-5">
          <TextField
            label="Título"
            errors={!!errors.title}
            placeholder="Título"
            value={watch("title")}
            type={"text"}
            isLabel={false}
            message={errors?.title?.message}
            {...register("title")}
          />

          <TextField
            label="Autor"
            errors={!!errors.author}
            placeholder="Autor"
            value={watch("author")}
            type={"text"}
            isLabel={false}
            message={errors?.author?.message}
            {...register("author")}
          />

          <TextField
            label="Editorial"
            errors={!!errors.publisher}
            placeholder="Editorial"
            value={watch("publisher")}
            type={"text"}
            isLabel={false}
            message={errors?.publisher?.message}
            {...register("publisher")}
          />

          <div className="flex flex-row justify-center items-center gap-5 w-full">
            <TextField
              label="Número de Página"
              errors={!!errors.pageCount}
              placeholder="Número de Página"
              value={watch("pageCount")}
              type={"text"}
              isLabel={false}
              message={errors?.pageCount?.message}
              {...register("pageCount")}
            />

            <TextField
              label="Año de Publicación"
              errors={!!errors.publicationYear}
              placeholder="Año de Publicación"
              value={watch("publicationYear")}
              type={"text"}
              isLabel={false}
              message={errors?.publicationYear?.message}
              {...register("publicationYear")}
            />
          </div>
          <TextField
            label="Tipo"
            errors={!!errors.type}
            placeholder="Tipo"
            value={watch("type")}
            type={"text"}
            isLabel={false}
            message={errors?.type?.message}
            {...register("type")}
          />

          <TextField
            label="N° Ejemplares"
            errors={!!errors.quantity}
            placeholder="Número de Ejemplares"
            value={watch("quantity")?.toString()}
            type={"text"}
            isLabel={false}
            message={errors?.quantity?.message}
            {...register("quantity")}
          />

          <div className="w-full">
            <textarea
              {...register("description")}
              placeholder="Descripción"
              className="w-full min-h-[120px] max-h-[200px] border-solid border-gray-400 border-[1px] rounded-md outline-none p-2"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-row justify-center items-center w-full text-center">
            <button
              type="button"
              onClick={() => setShelfSelected("1")}
              className={clsx(
                "p-2 border-[1px] w-full border-primary",
                shelfSelected === "1"
                  ? "bg-primary text-white"
                  : "bg-white  text-primary"
              )}
            >
              Repisa 1
            </button>
            <button
              type="button"
              onClick={() => setShelfSelected("2")}
              className={clsx(
                "p-2 border-[1px] w-full border-primary",
                shelfSelected === "2"
                  ? "bg-primary text-white"
                  : "bg-white  text-primary"
              )}
            >
              Respisa 2
            </button>
          </div>
          <Location
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
            row={shelfSelected === "1" ? 3 : 4}
            col={shelfSelected === "1" ? 5 : 6}
          />
          {errors.location && (
            <p className="text-center text-red-500">
              {errors.location.message}
            </p>
          )}
        </form>
        <div className="flex flex-row justify-end items-center gap-5 w-full">
          <button
            onClick={() =>
              reset({
                title: "",
                author: "",
                publisher: "",
                pageCount: "",
                publicationYear: "",
                type: "",
              })
            }
            className="bg-white text-primary p-2 rounded-md w-1/4 border-primary border-2"
          >
            Limpiar
          </button>
          <button
            className="bg-primary text-white p-2 rounded-md w-1/4"
            onClick={handleSubmit(onSubmit)}
          >
            {id ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarTexto;
