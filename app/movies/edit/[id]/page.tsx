import React from "react";

import EditarPelicula from "@/views/pelicula/agregarPelicula";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Libro",
  description: "Sistema de administración de documental de letras españolas",
};

const page = () => {
  return <EditarPelicula />;
};

export default page;
