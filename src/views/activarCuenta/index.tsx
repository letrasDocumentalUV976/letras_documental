"use client";

import { useEffect, useState } from "react";
import TextField from "@/component/TextField/TextField";
import Loading from "@/component/Loader/Loader";
import Logo from "../../../public/Logo.png";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useForm, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SetPasswordValidator } from "@/validator/UserValidator";
import { completeInvitationRequest, getInvitationRequest } from "@/store";
import { InvitationDetails } from "@/types";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ActivarCuenta = () => {
  const params = useParams();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const router = useRouter();

  const [checkStatus, setCheckStatus] = useState<
    "loading" | "valid" | "invalid"
  >("loading");
  const [invitation, setInvitation] = useState<InvitationDetails | null>(
    null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SetPasswordValidator),
  });

  useEffect(() => {
    if (!token) return;
    getInvitationRequest(token)
      .then((data) => {
        setInvitation(data);
        setCheckStatus("valid");
      })
      .catch(() => setCheckStatus("invalid"));
  }, [token]);

  const onSubmit = (data: FieldValues) => {
    if (!token) return;
    setIsSubmitting(true);
    completeInvitationRequest(token, data.password)
      .then(() => {
        toast.success("Cuenta activada correctamente, ya puedes iniciar sesión");
        router.push("/login");
      })
      .catch((error) => {
        toast.error(error?.message || "No se pudo activar la cuenta");
        setIsSubmitting(false);
      });
  };

  if (checkStatus === "loading") {
    return <Loading />;
  }

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
        {checkStatus === "invalid" ? (
          <div className="flex w-full max-w-[380px] flex-col items-center gap-3 rounded-xl bg-white p-6 text-center shadow-lg lg:p-8">
            <h2 className="text-xl font-bold text-gray-800">
              Enlace no válido
            </h2>
            <p className="text-sm text-gray-500">
              Este enlace de activación ya no es válido o ha expirado. Pide
              al administrador que te envíe una nueva invitación.
            </p>
            <Link
              href="/login"
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              Volver a Iniciar Sesión
            </Link>
          </div>
        ) : (
          <form
            className="flex w-full max-w-[380px] flex-col gap-4 rounded-xl bg-white p-6 shadow-lg lg:p-8"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Activa tu cuenta
              </h2>
              <p className="text-sm text-gray-500">
                Hola {invitation?.name}, define tu contraseña para ingresar
                con {invitation?.email}.
              </p>
            </div>

            <div className="relative">
              <TextField
                label="Contraseña"
                placeholder="••••••••"
                value={watch("password")}
                type={showPassword ? "text" : "password"}
                isLabel
                errors={Boolean(errors.password)}
                message={errors.password?.message as string}
                {...register("password")}
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

            <TextField
              label="Confirmar contraseña"
              placeholder="••••••••"
              value={watch("confirmPassword")}
              type={showPassword ? "text" : "password"}
              isLabel
              errors={Boolean(errors.confirmPassword)}
              message={errors.confirmPassword?.message as string}
              {...register("confirmPassword")}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary p-2.5 font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && (
                <AiOutlineLoading3Quarters className="animate-spin" size={18} />
              )}
              {isSubmitting ? "Activando..." : "Activar cuenta"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ActivarCuenta;
