"use client";

import LinkButton from "@/component/LinkButton/LinkButton";
import { Book } from "@/types";
import {
  deleteBook,
  fetchBooks,
  selectBooks,
  selectBooksStatus,
  useV1Dispatch,
  useV1Selector,
} from "@/store";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";

const Index = () => {
  const dispatch = useV1Dispatch();
  const books = useV1Selector(selectBooks);
  const booksStatus = useV1Selector(selectBooksStatus);
  const router = useRouter();
  const [librosSeleccionados, setLibrosSeleccionados] = useState<Book | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleDelete = async () => {
    if (isDeleting || !librosSeleccionados) return;
    setIsDeleting(true);
    dispatch(deleteBook(librosSeleccionados.id))
      .unwrap()
      .then(() => {
        toast.success("Libro eliminado correctamente");
        setLibrosSeleccionados(null);
      })
      .catch(() => {
        toast.error("Error al eliminar el libro");
      })
      .finally(() => setIsDeleting(false));
  };

  if (booksStatus === "loading" || booksStatus === "idle") return <Loading />;

  return (
    <>
      <div className="flex flex-row justify-between items-center p-5">
        <h2 className="text-2xl font-bold">Libros</h2>
        <LinkButton href="/libros/agregar" text="Agregar Libro" />
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-2 p-5">
          <div className="col-span-1">
            <div className="flex flex-row justify-between items-center">
              <p className="text-lg font-bold">Todos los libros</p>
              <div className="flex flex-row justify-between items-center">
                <MdModeEditOutline
                  size={28}
                  className="cursor-pointer"
                  color={!librosSeleccionados ? "gray" : "black"}
                  onClick={() =>
                    router.push(`/libros/editar/${librosSeleccionados?.id}`)
                  }
                />
                <MdDelete
                  size={28}
                  className="cursor-pointer"
                  color={!librosSeleccionados ? "gray" : "black"}
                  onClick={handleDelete}
                />
              </div>
            </div>

            <br />
            <table className="table-auto border-collapse border border-gray-400 w-full max-h-[700px] overflow-auto">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Titulo</th>
                  <th className="border border-gray-400 px-4 py-2">Autor</th>
                  <th className="border border-gray-400 px-4 py-2">Año</th>
                  <th className="border border-gray-400 px-4 py-2">
                    Editorial
                  </th>
                  <th className="border border-gray-400 px-4 py-2">Tipo</th>
                  <th className="border border-gray-400 px-4 py-2">
                    Número de páginas
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {books.map((libro: Book) => (
                  <tr
                    key={libro.id}
                    onClick={() => setLibrosSeleccionados(libro)}
                    className={clsx(
                      "cursor-pointer",
                      libro.id === librosSeleccionados?.id &&
                        "bg-primary/80 text-white"
                    )}
                  >
                    <td className="border border-gray-400 px-4 py-2">
                      {libro.title}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {libro.author}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {libro.publicationYear}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {libro.publisher}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {libro.type}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {libro.pageCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-span-1">
            <h2 className="text-2xl font-bold"></h2>
          </div>
        </div>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default Index;
