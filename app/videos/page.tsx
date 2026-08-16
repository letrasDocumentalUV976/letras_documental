import { Metadata } from "next";
import React from "react";
import Index from "@/views/videoteca/Index";

export const metadata: Metadata = {
  title: "Videoteca",
  description: "Sistema de administración de documental de letras españolas",
};

const page = () => {
  return <Index />;
};

export default page;
