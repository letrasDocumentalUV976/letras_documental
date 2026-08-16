"use client";

import TextField from "@/component/TextField/TextField";
import Logo from "../../../public/Logo.png";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm, FieldValues } from "react-hook-form";
import { login, useV1Dispatch } from "@/store";

const Login = () => {
  const router = useRouter();
  const dispatch = useV1Dispatch();
  const { register, watch, handleSubmit } = useForm();

  const onSubmit = (data: FieldValues) => {
    if (typeof window === "undefined") return;
    dispatch(login({ email: data.email, password: data.password }))
      .unwrap()
      .then((user) => {
        localStorage.setItem("autenticado", "true");
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Usuario autenticado correctamente");
        router.push("/");
      })
      .catch(() => {
        toast.error("Error al autenticar el usuario");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary">
      <form
        className="w-[320px] flex flex-col justify-center gap-4 bg-white rounded-md p-5 h-[600px] lg:w-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-center">
          <div className="flex flex-col w-[100px] items-center justify-center bg-primary rounded-md shadow-md">
            <Image src={Logo} alt="Logo" width={100} height={100} />
          </div>
        </div>

        <TextField
          label="Correo"
          placeholder="Correo"
          value={watch("email")}
          type={"text"}
          isLabel={false}
          {...register("email")}
        />

        <TextField
          label="Password"
          placeholder="Password"
          value={watch("password")}
          type={"password"}
          isLabel={false}
          {...register("password")}
        />

        <button type="submit" className="bg-primary text-white p-2 rounded-md">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
