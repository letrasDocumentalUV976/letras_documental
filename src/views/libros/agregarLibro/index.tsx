"use client";

import { convertToBase64 } from "@/utils/Utils";
import { BookValidator } from "@/validator/BookValidator";
import React, { useEffect, useState } from "react";
import {
  useForm,
  FieldValues,
  UseFormRegisterReturn,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UploadImage from "@/component/UploadImage/UploadImage";
import toast from "react-hot-toast";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Location from "@/component/Location/Location";
import clsx from "clsx";
import { Shelf } from "@/types";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  createBook,
  fetchBooks,
  selectBooks,
  selectBooksStatus,
  updateBook,
  useV1Dispatch,
  useV1Selector,
} from "@/store";

const FormField = ({
  label,
  placeholder,
  registration,
  error,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  type?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
      {...registration}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

const AgregarTexto = () => {
  const dispatch = useV1Dispatch();
  const books = useV1Selector(selectBooks);
  const booksStatus = useV1Selector(selectBooksStatus);
  const [image, setImage] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [shelfSelected, setShelfSelected] = useState<Shelf>("2");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (!file) {
      toast.error("Selecciona una imagen primero");
      return;
    }

    setUploadingImage(true);
    try {
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
        toast.error("Error al subir la imagen");
      }
    } catch {
      toast.error("Error al subir la imagen");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = (data: FieldValues) => {
    setIsSubmitting(true);
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
        router.push("/books");
      })
      .catch(() => {
        toast.error(
          id ? "Error al actualizar el libro" : "Error al agregar el libro"
        );
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleReset = () => {
    reset({
      title: "",
      author: "",
      publisher: "",
      pageCount: "",
      publicationYear: "",
      type: "",
      description: "",
      quantity: undefined,
      image: "",
      location: { shelf: "2", column: undefined, row: undefined },
    });
    setImage("");
    setShelfSelected("2");
    setSelectedCell(null);
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
    <div className="mx-auto w-full max-w-5xl p-5">
      <Link
        href="/books"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
      >
        <IoArrowBack size={16} />
        Volver a Libros
      </Link>

      <h2 className="mt-4 text-2xl font-bold text-gray-800">
        {id ? "Editar Libro" : "Agregar Libro"}
      </h2>
      <p className="mb-8 text-sm text-gray-500">
        Completa la información del libro y su ubicación física.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 lg:flex-row lg:items-start"
      >
        <div className="flex flex-col items-center gap-2 lg:w-[300px] lg:shrink-0">
          <UploadImage
            image={image}
            handleImageCapture={handleUpload}
            {...register("image")}
          />
          {uploadingImage && (
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <AiOutlineLoading3Quarters className="animate-spin" size={14} />
              Subiendo imagen...
            </p>
          )}
        </div>

        <div className="flex w-full flex-col gap-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
            <FormField
              label="Título"
              placeholder="Título"
              registration={register("title")}
              error={errors?.title?.message}
            />

            <FormField
              label="Autor"
              placeholder="Autor"
              registration={register("author")}
              error={errors?.author?.message}
            />

            <FormField
              label="Editorial"
              placeholder="Editorial"
              registration={register("publisher")}
              error={errors?.publisher?.message}
            />

            <FormField
              label="Tipo"
              placeholder="Tipo"
              registration={register("type")}
              error={errors?.type?.message}
            />

            <FormField
              label="Año de Publicación"
              placeholder="Año de Publicación"
              registration={register("publicationYear")}
              error={errors?.publicationYear?.message}
            />

            <FormField
              label="N° de Páginas"
              placeholder="N° de Páginas"
              registration={register("pageCount")}
              error={errors?.pageCount?.message}
            />

            <FormField
              label="N° Ejemplares"
              placeholder="N° Ejemplares"
              registration={register("quantity")}
              error={errors?.quantity?.message}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Descripción
            </label>
            <textarea
              {...register("description")}
              placeholder="Descripción"
              className="min-h-[120px] w-full max-h-[200px] resize-none rounded-md border border-gray-300 bg-transparent px-3 py-2 text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Ubicación física
            </p>
            <div className="flex gap-6 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setShelfSelected("1")}
                className={clsx(
                  "-mb-px border-b-2 pb-2 text-sm font-medium transition-colors",
                  shelfSelected === "1"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                Repisa 1
              </button>
              <button
                type="button"
                onClick={() => setShelfSelected("2")}
                className={clsx(
                  "-mb-px border-b-2 pb-2 text-sm font-medium transition-colors",
                  shelfSelected === "2"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                Repisa 2
              </button>
            </div>

            <div className="overflow-x-auto">
              <Location
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                row={shelfSelected === "1" ? 3 : 4}
                col={shelfSelected === "1" ? 5 : 6}
              />
            </div>
            {errors.location && (
              <p className="text-center text-sm text-red-500">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md border-2 border-primary p-2 font-medium text-primary transition-colors hover:bg-primary/5 sm:w-1/4"
            >
              Limpiar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-md bg-primary p-2 font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-1/4"
            >
              {isSubmitting && (
                <AiOutlineLoading3Quarters className="animate-spin" size={18} />
              )}
              {id ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AgregarTexto;
