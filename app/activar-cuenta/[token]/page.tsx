import { Metadata } from "next";
import React from "react";
import ActivarCuenta from "@/views/activarCuenta";

export const metadata: Metadata = {
  title: "Activar Cuenta",
  description: "Sistema de administración de documental de letras españolas",
};

const page = () => {
  return <ActivarCuenta />;
};

export default page;
