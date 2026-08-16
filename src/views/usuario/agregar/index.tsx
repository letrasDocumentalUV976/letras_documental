"use client";

import React, { useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "@/component/TextField/TextField";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { UserValidator } from "@/validator/UsuariosValidatos";
import {
  createUser,
  fetchUsers,
  selectUsers,
  selectUsersStatus,
  updateUser,
  useV1Dispatch,
  useV1Selector,
} from "@/store";

const AgregarUsuario = () => {
  const dispatch = useV1Dispatch();
  const users = useV1Selector(selectUsers);
  const usersStatus = useV1Selector(selectUsersStatus);
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(UserValidator),
  });

  const onSubmit = (data: FieldValues) => {
    const input = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    const loadingToast = toast.loading("Guardando datos...");
    const result = id
      ? dispatch(updateUser({ id, input })).unwrap()
      : dispatch(createUser(input)).unwrap();

    result
      .then(() => {
        toast.success(id ? "¡Usuario actualizado!" : "¡Usuario agregado!");
        router.push("/usuario");
      })
      .catch(() => {
        toast.error("Error al guardar los datos.");
      })
      .finally(() => toast.dismiss(loadingToast));
  };

  useEffect(() => {
    if (id && usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [id, usersStatus, dispatch]);

  useEffect(() => {
    if (!id) return;
    const user = users.find((item) => item.id === id);
    if (user) {
      reset({ name: user.name, email: user.email, password: "" });
    }
  }, [id, users, reset]);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-[900px] p-5">
        <p className="text-2xl font-bold">Información de la pelicula</p>
        <form className="flex flex-col justify-center items-center gap-5 py-5">
          <TextField
            label="Nombre"
            errors={!!errors.name}
            placeholder="Nombre"
            value={watch("name")}
            type={"text"}
            isLabel={false}
            message={errors?.name?.message}
            {...register("name")}
          />

          <TextField
            label="Correo"
            errors={!!errors.email}
            placeholder="Correo"
            value={watch("email")}
            type={"text"}
            isLabel={false}
            message={errors?.email?.message}
            {...register("email")}
          />

          <TextField
            label="Contraseña"
            errors={!!errors.password}
            placeholder="Contraseña"
            value={watch("password")}
            type={"password"}
            isLabel={false}
            message={errors?.password?.message}
            {...register("password")}
          />
        </form>
        <div className="flex flex-row justify-end items-center gap-5 w-full">
          <button
            onClick={() =>
              reset({
                name: "",
                email: "",
                password: "",
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

export default AgregarUsuario;
