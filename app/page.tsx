import { Metadata } from "next";
import Index from "@/views/inicio/inicio";

export const metadata: Metadata = {
  title: "Inicio",
  description: "Sistema de administración de documental de letras españolas",
};

const Page = () => {
  return <Index />;
};

export default Page;
