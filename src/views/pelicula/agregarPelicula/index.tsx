"use client";

import { convertToBase64 } from "@/utils/Utils";
import { MovieValidator } from "@/validator/MovieValidator";
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
import TextList from "@/component/TextList/TextList";
import { useParams, useRouter } from "next/navigation";
import { countries } from "@/utils/Countries";
import { languages } from "@/utils/Languages";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  createMovie,
  fetchMovies,
  selectMovies,
  selectMoviesStatus,
  updateMovie,
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

const SelectField = ({
  label,
  registration,
  error,
  children,
}: {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </label>
    <select
      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-gray-800 outline-none transition-colors focus:border-primary"
      {...registration}
    >
      {children}
    </select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

const AgregarPelicula = () => {
  const dispatch = useV1Dispatch();
  const movies = useV1Selector(selectMovies);
  const moviesStatus = useV1Selector(selectMoviesStatus);
  const [image, setImage] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(MovieValidator),
  });

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
      director: data.director,
      publicationYear: data.publicationYear,
      type: data.type,
      duration: data.duration,
      genre: data.genre,
      country: data.country,
      language: data.language,
      subtitles: data.subtitles,
      image:
        image ||
        "https://res.cloudinary.com/dvt4vznxn/image/upload/v1736555915/yivyktkgvcjxprwwnwui.png",
    };

    const result = id
      ? dispatch(updateMovie({ id, input })).unwrap()
      : dispatch(createMovie(input)).unwrap();

    result
      .then(() => {
        toast.success(
          id
            ? "Película actualizada correctamente"
            : "Película agregada correctamente"
        );
        router.push("/movies");
      })
      .catch(() => {
        toast.error(
          id
            ? "Error al actualizar la película"
            : "Error al agregar la película"
        );
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleReset = () => {
    reset({
      title: "",
      director: "",
      publicationYear: "",
      type: undefined,
      duration: "",
      genre: "",
      country: "",
      language: "",
      subtitles: undefined,
      image: "",
    });
    setImage("");
  };

  useEffect(() => {
    if (id && moviesStatus === "idle") {
      dispatch(fetchMovies());
    }
  }, [id, moviesStatus, dispatch]);

  useEffect(() => {
    if (!id) return;
    const movie = movies.find((item) => item.id === id);
    if (movie) {
      reset(movie);
      setImage(movie.image);
    }
  }, [id, movies, reset]);

  return (
    <div className="mx-auto w-full max-w-7xl p-5">
      <Link
        href="/movies"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
      >
        <IoArrowBack size={16} />
        Volver a Películas
      </Link>

      <h2 className="mt-4 text-2xl font-bold text-gray-800">
        {id ? "Editar Película" : "Agregar Película"}
      </h2>
      <p className="mb-8 text-sm text-gray-500">
        Completa la información de la película.
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
              label="Director"
              placeholder="Director"
              registration={register("director")}
              error={errors?.director?.message}
            />

            <FormField
              label="Año de Publicación"
              placeholder="Año de Publicación"
              registration={register("publicationYear")}
              error={errors?.publicationYear?.message}
            />

            <SelectField
              label="Tipo"
              registration={register("type")}
              error={errors?.type?.message}
            >
              <option value="">Seleccionar</option>
              <option value="original">Original</option>
              <option value="copy">Copia</option>
              <option value="bluray">Blu-ray</option>
            </SelectField>

            <FormField
              label="Duración"
              placeholder="Duración"
              registration={register("duration")}
              error={errors?.duration?.message}
            />

            <FormField
              label="Género"
              placeholder="Género"
              registration={register("genre")}
              error={errors?.genre?.message}
            />

            <TextList
              label="País"
              register={register("country")}
              options={countries}
              placeholder="País"
              errors={!!errors.country}
              message={errors?.country?.message}
              defaultValue={watch("country")}
            />

            <TextList
              label="Idioma"
              register={register("language")}
              options={languages}
              placeholder="Idioma"
              errors={!!errors.language}
              message={errors?.language?.message}
              defaultValue={watch("language")}
            />

            <SelectField
              label="Subtítulos"
              registration={register("subtitles")}
              error={errors?.subtitles?.message}
            >
              <option value="">Seleccionar</option>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </SelectField>
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
                <AiOutlineLoading3Quarters
                  className="animate-spin"
                  size={18}
                />
              )}
              {id ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AgregarPelicula;
