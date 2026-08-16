import { Metadata } from "next";
import React from "react";
import Pelicula from "@/views/pelicula/Index";

export const metadata: Metadata = {
  title: "Peliculas",
  description: "Sistema de administración de documental de letras españolas",
};

const page = () => {
  return <Pelicula />;
};

export default page;
