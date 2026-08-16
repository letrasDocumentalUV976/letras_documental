import { Metadata } from "next";
import React from "react";
import Biblioteca from "@/views/biblioteca/index";

export const metadata: Metadata = {
  title: "Biblioteca",
  description: "Sistema de administración de documental de letras españolas",
};

const page = () => {
  return <Biblioteca />;
};

export default page;
