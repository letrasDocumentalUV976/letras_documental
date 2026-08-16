import React from "react";

import Index from "@/views/pelicula/agregarPelicula/index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agregar Película",
  description: "Sistema de administración de documental de letras españolas",
};

const page = () => {
  return <Index />;
};

export default page;
