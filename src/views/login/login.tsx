"use client";

import { useState } from "react";
import TextField from "@/component/TextField/TextField";
import Logo from "../../../public/Logo.png";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm, FieldValues } from "react-hook-form";
import { login, useV1Dispatch } from "@/store";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Login = () => {
  const router = useRouter();
  const dispatch = useV1Dispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: FieldValues) => {
    setIsSubmitting(true);
    dispatch(login({ email: data.email, password: data.password }))
      .unwrap()
      .then(() => {
        toast.success("Usuario autenticado correctamente");
        router.push("/");
      })
      .catch((error) => {
        toast.error(error?.message || "Correo o contraseña incorrectos");
        setIsSubmitting(false);
      });
  };

  return (
    <div className="flex min-h-screen flex-col bg-primary md:flex-row">
      <div className="flex flex-col items-center justify-center gap-4 px-8 py-12 text-center md:w-1/2 md:items-start md:text-left">
        <div className="flex w-[90px] items-center justify-center rounded-xl bg-white/10 p-2 shadow-md">
          <Image src={Logo} alt="Logo" width={72} height={72} />
        </div>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">
          Centro Documental
        </h1>
        <p className="max-w-sm text-sm text-white/70">
          Sistema de administración documental de letras españolas: libros,
          películas y préstamos en un solo lugar.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-12 md:pb-0">
        <form
          className="flex w-full max-w-[380px] flex-col gap-4 rounded-xl bg-white p-6 shadow-lg lg:p-8"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-gray-500">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <TextField
            label="Correo"
            placeholder="correo@ejemplo.com"
            value={watch("email")}
            type="text"
            isLabel
            errors={Boolean(errors.email)}
            message="El correo es obligatorio"
            {...register("email", { required: true })}
          />

          <div className="relative">
            <TextField
              label="Contraseña"
              placeholder="••••••••"
              value={watch("password")}
              type={showPassword ? "text" : "password"}
              isLabel
              errors={Boolean(errors.password)}
              message="La contraseña es obligatoria"
              {...register("password", { required: true })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <IoEyeOffOutline size={20} />
              ) : (
                <IoEyeOutline size={20} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary p-2.5 font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && (
              <AiOutlineLoading3Quarters className="animate-spin" size={18} />
            )}
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
