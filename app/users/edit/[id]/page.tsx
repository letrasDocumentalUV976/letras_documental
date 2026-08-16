import { Metadata } from "next";
import React from "react";
import Usuario from "@/views/usuario/agregar";

export const metadata: Metadata = {
  title: "Editar usuario",
  description: "Sistema de administración de documental de letras españolas",
};

const page = () => {
  return <Usuario />;
};

export default page;
