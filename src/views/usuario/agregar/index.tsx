"use client";

import React, { useEffect, useState } from "react";
import {
  useForm,
  FieldValues,
  UseFormRegisterReturn,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  UserInviteValidator,
  UserEditValidator,
} from "@/validator/UserValidator";
import { UserInput } from "@/types";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  fetchUsers,
  inviteUser,
  selectUsers,
  selectUsersStatus,
  updateUser,
  useV1Dispatch,
  useV1Selector,
} from "@/store";

const FormField = ({
  label,
  placeholder,
  registration,
  error,
  type = "text",
  hint,
}: {
  label: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  type?: string;
  hint?: string;
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
    {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

const AgregarUsuario = () => {
  const dispatch = useV1Dispatch();
  const users = useV1Selector(selectUsers);
  const usersStatus = useV1Selector(selectUsersStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(id ? UserEditValidator : UserInviteValidator),
  });

  const onSubmit = (data: FieldValues) => {
    setIsSubmitting(true);

    if (id) {
      const input: Partial<UserInput> = {
        name: data.name,
        email: data.email,
      };
      if (data.password) input.password = data.password;

      dispatch(updateUser({ id, input }))
        .unwrap()
        .then(() => {
          toast.success("Usuario actualizado correctamente");
          router.push("/users");
        })
        .catch(() => toast.error("Error al actualizar el usuario"))
        .finally(() => setIsSubmitting(false));
      return;
    }

    dispatch(inviteUser({ name: data.name, email: data.email }))
      .unwrap()
      .then(() => {
        toast.success("Se envió un correo de invitación al usuario");
        router.push("/users");
      })
      .catch((error) => {
        toast.error(error?.message || "Error al invitar al usuario");
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleReset = () => {
    reset({ name: "", email: "", password: "" });
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
    <div className="mx-auto w-full max-w-7xl p-5">
      <Link
        href="/users"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
      >
        <IoArrowBack size={16} />
        Volver a Usuarios
      </Link>

      <h2 className="mt-4 text-2xl font-bold text-gray-800">
        {id ? "Editar Usuario" : "Agregar Usuario"}
      </h2>
      <p className="mb-8 text-sm text-gray-500">
        {id
          ? "Completa la información del usuario."
          : "Se le enviará un correo con un enlace para que defina su propia contraseña e ingrese al sistema."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          label="Nombre"
          placeholder="Nombre"
          registration={register("name")}
          error={errors?.name?.message}
        />

        <FormField
          label="Correo"
          placeholder="correo@ejemplo.com"
          registration={register("email")}
          error={errors?.email?.message}
          hint={
            id
              ? undefined
              : "Recibirá un correo con un enlace para crear su contraseña"
          }
        />

        {id && (
          <FormField
            label="Contraseña"
            placeholder="••••••••"
            type="password"
            registration={register("password")}
            error={errors?.password?.message}
            hint="Deja este campo en blanco para no cambiarla"
          />
        )}

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
            {id ? "Actualizar" : "Enviar invitación"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarUsuario;
