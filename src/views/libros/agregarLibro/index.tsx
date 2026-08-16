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
import { IBook } from "@/interfaces/interfacesBooks";
import { setBooks } from "@/redux/books";
import { connect } from "react-redux";
import { Dispatch } from "redux";

interface IAgregarTextoProps {
  setBooks: (movies: IBook[]) => void;
}

const AgregarTexto = ({ setBooks }: IAgregarTextoProps) => {
  const [image, setImage] = useState<string>("");
  const [respisaSelected, setRespisaSelected] = useState<string>("2");
  const router = useRouter();
  const params = useParams();

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
    const ubicacion = {
      col: selectedCell?.col,
      row: selectedCell?.row,
      respisa: respisaSelected,
    };
    setValue("ubicacion", ubicacion);
  }, [respisaSelected, setValue, selectedCell?.col, selectedCell?.row]);

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
      setValue("imagen", data.url);
      setImage(data.url);
    } else {
      alert("Error al subir la imagen");
    }
  };

  const onSubmit = async (data: FieldValues) => {
    data.imagen =
      image ||
      "https://res.cloudinary.com/dvt4vznxn/image/upload/v1736555915/yivyktkgvcjxprwwnwui.png";
    data.id = Array.isArray(params.id) ? params.id[0] : params.id || "";
    const response = await fetch(
      `/api/libros/${params.id ? "editar" : "agregar"}`,
      {
        method: params.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const dataResponse = await response.json();
    if (dataResponse.status === 200) {
      toast.success(dataResponse.message);
      setBooks([]);
      router.push("/libros");
    } else {
      toast.error(dataResponse.message);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetch(`/api/libros/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            reset(data.data);
            setImage(data.data.imagen);
            setRespisaSelected(data.data.ubicacion.respisa);
            setSelectedCell({
              col: data.data.ubicacion.col,
              row: data.data.ubicacion.row,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [params.id, reset]);

  return (
    <div className="grid grid-cols-3 p-5">
      <div className="col-span-1 flex justify-center items-start">
        <UploadImage
          image={image}
          handleImageCapture={handleUpload}
          {...register("imagen")}
        />
      </div>
      <div className="col-span-2">
        <p className="text-2xl font-bold">Información del libro</p>
        <form className="flex flex-col justify-center items-center gap-5 py-5">
          <TextField
            label="Título"
            errors={!!errors.titulo}
            placeholder="Título"
            value={watch("titulo")}
            type={"text"}
            isLabel={false}
            message={errors?.titulo?.message}
            {...register("titulo")}
          />

          <TextField
            label="Autor"
            errors={!!errors.titulo}
            placeholder="Autor"
            value={watch("autor")}
            type={"text"}
            isLabel={false}
            message={errors?.autor?.message}
            {...register("autor")}
          />

          <TextField
            label="Editorial"
            errors={!!errors.titulo}
            placeholder="Editorial"
            value={watch("editorial")}
            type={"text"}
            isLabel={false}
            message={errors?.editorial?.message}
            {...register("editorial")}
          />

          <div className="flex flex-row justify-center items-center gap-5 w-full">
            <TextField
              label="Número de Página"
              errors={!!errors.titulo}
              placeholder="Número de Página"
              value={watch("numPag")}
              type={"text"}
              isLabel={false}
              message={errors?.numPag?.message}
              {...register("numPag")}
            />

            <TextField
              label="Año de Publicación"
              errors={!!errors.titulo}
              placeholder="Año de Publicación"
              value={watch("anioPublicacion")}
              type={"text"}
              isLabel={false}
              message={errors?.anioPublicacion?.message}
              {...register("anioPublicacion")}
            />
          </div>
          <TextField
            label="Tipo"
            errors={!!errors.titulo}
            placeholder="Tipo"
            value={watch("tipo")}
            type={"text"}
            isLabel={false}
            message={errors?.tipo?.message}
            {...register("tipo")}
          />

          <TextField
            label="N° Ejemplares"
            errors={!!errors.cantidad}
            placeholder="Número de Ejemplares"
            value={watch("cantidad")?.toString()}
            type={"text"}
            isLabel={false}
            message={errors?.cantidad?.message}
            {...register("cantidad")}
          />

          <div className="w-full">
            <textarea
              {...register("descripcion")}
              placeholder="Descripción"
              className="w-full min-h-[120px] max-h-[200px] border-solid border-gray-400 border-[1px] rounded-md outline-none p-2"
            />
            {errors.descripcion && (
              <p className="text-red-500">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="flex flex-row justify-center items-center w-full text-center">
            <button
              type="button"
              onClick={() => setRespisaSelected("1")}
              className={clsx(
                "p-2 border-[1px] w-full border-primary",
                respisaSelected === "1"
                  ? "bg-primary text-white"
                  : "bg-white  text-primary"
              )}
            >
              Repisa 1
            </button>
            <button
              type="button"
              onClick={() => setRespisaSelected("2")}
              className={clsx(
                "p-2 border-[1px] w-full border-primary",
                respisaSelected === "2"
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
            row={respisaSelected === "1" ? 3 : 4}
            col={respisaSelected === "1" ? 5 : 6}
          />
          {errors.ubicacion && (
            <p className="text-center text-red-500">
              {errors.ubicacion.message}
            </p>
          )}
        </form>
        <div className="flex flex-row justify-end items-center gap-5 w-full">
          <button
            onClick={() =>
              reset({
                titulo: "",
                autor: "",
                editorial: "",
                numPag: "",
                anioPublicacion: "",
                tipo: "",
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
            {params.id ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setBooks: (movies: IBook[]) => dispatch(setBooks(movies)),
  };
};

export default connect(null, mapDispatchToProps)(AgregarTexto);
