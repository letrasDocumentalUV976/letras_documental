import { Metadata } from "next";
import React from "react";
import Usuario from "@/views/usuario";

export const metadata: Metadata = {
  title: "Usuarios",
  description: "Sistema de administración de documental de letras españolas",
};

const page = () => {
  return <Usuario />;
};

export default page;
