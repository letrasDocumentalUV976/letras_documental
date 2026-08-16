"use client";

import { convertToBase64 } from "@/utils/Utils";
import { MovieValidator } from "@/validator/MovieValidator";
import React, { useEffect, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UploadImage from "@/component/UploadImage/UploadImage";
import TextField from "@/component/TextField/TextField";
import toast from "react-hot-toast";
import TextList from "@/component/TextList/TextList";
import { useParams, useRouter } from "next/navigation";
import { countries } from "@/utils/Countries";
import { languages } from "@/utils/Languages";
import { MovieCopyType, YesNo } from "@/types";
import {
  createMovie,
  fetchMovies,
  selectMovies,
  selectMoviesStatus,
  updateMovie,
  useV1Dispatch,
  useV1Selector,
} from "@/store";

const AgregarPelicula = () => {
  const dispatch = useV1Dispatch();
  const movies = useV1Selector(selectMovies);
  const moviesStatus = useV1Selector(selectMoviesStatus);
  const [image, setImage] = useState<string>("");
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
            ? "Pelicula actualizada correctamente"
            : "Pelicula agregada correctamente"
        );
        router.push("/pelicula");
      })
      .catch(() => {
        toast.error(
          id ? "Error al actualizar la pelicula" : "Error al agregar la pelicula"
        );
      });
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
    <div className="grid grid-cols-3 p-5">
      <div className="col-span-1 flex justify-center items-start">
        <UploadImage
          image={image}
          handleImageCapture={handleUpload}
          {...register("image")}
        />
      </div>
      <div className="col-span-2">
        <p className="text-2xl font-bold">Información de la pelicula</p>
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
            label="Director"
            errors={!!errors.director}
            placeholder="Director"
            value={watch("director")}
            type={"text"}
            isLabel={false}
            message={errors?.director?.message}
            {...register("director")}
          />

          <div className="flex flex-row justify-between items-center gap-5 w-full">
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

            <div className="w-full border border-gray-400 rounded-md p-1 relative">
              <select
                name=""
                id=""
                value={watch("type")}
                className="border-transparent w-full h-full p-2 outline-none"
                onChange={(e) =>
                  setValue("type", e.target.value as MovieCopyType)
                }
              >
                <option value="">Seleccionar</option>
                <option value="original">Original</option>
                <option value="copy">Copia</option>
                <option value="bluray">Blue Ray</option>
              </select>
              {!!errors.type && (
                <p className="text-red-500">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-row justify-between items-center gap-5 w-full">
            <TextField
              label="Duración"
              errors={!!errors.duration}
              placeholder="Duración"
              value={watch("duration")}
              type={"text"}
              isLabel={false}
              message={errors?.duration?.message}
              {...register("duration")}
            />

            <TextField
              label="Género"
              errors={!!errors.genre}
              placeholder="Género"
              value={watch("genre")}
              type={"text"}
              isLabel={false}
              message={errors?.genre?.message}
              {...register("genre")}
            />
          </div>

          <TextList
            register={register("country")}
            options={countries}
            placeholder="Pais"
            errors={!!errors.country}
            message={errors?.country?.message}
          />

          <div className="flex flex-row justify-between items-center gap-5 w-full">
            <div className="w-full">
              <TextList
                register={register("language")}
                options={languages}
                placeholder="Idioma"
                errors={!!errors.language}
                message={errors?.language?.message}
              />
            </div>

            <div className="w-full border border-gray-400 rounded-md p-1 relative">
              <select
                name=""
                id=""
                value={watch("subtitles")}
                className="border-transparent w-full h-full p-2 outline-none"
                onChange={(e) =>
                  setValue("subtitles", e.target.value as YesNo)
                }
              >
                <option value="">Seleccionar</option>
                <option value="yes">Si</option>
                <option value="no">No</option>
              </select>
              {!!errors.subtitles && (
                <p className="text-red-500">{errors.subtitles.message}</p>
              )}
            </div>
          </div>
        </form>
        <div className="flex flex-row justify-end items-center gap-5 w-full">
          <button
            onClick={() =>
              reset({
                title: "",
                director: "",
                publicationYear: "",
                duration: "",
                genre: "",
                country: "",
                language: "",
                image: "",
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

export default AgregarPelicula;
