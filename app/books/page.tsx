import React from "react";

import Index from "@/views/libros/index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Libros",
  description: "Sistema de administración de documental de letras españolas",
};

const page = () => {
  return <Index />;
};

export default page;
