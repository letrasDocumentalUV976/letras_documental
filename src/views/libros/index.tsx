"use client";

import LinkButton from "@/component/LinkButton/LinkButton";
import { IGlobal } from "@/interfaces/globalState";
import { IBook } from "@/interfaces/interfacesBooks";
import { setBooks } from "@/redux/books";
import { Dispatch } from "@reduxjs/toolkit";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { connect } from "react-redux";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";

interface IProps {
  books: IBook[];
  setBooks: (books: IBook[]) => void;
}

const Index = ({ books, setBooks }: IProps) => {
  const router = useRouter();
  const [librosSeleccionados, setLibrosSeleccionados] = useState<IBook | null>(
    null
  );
  const [loadingType, setLoadingType] = useState<{
    isLoading: boolean;
    isDeleting: boolean;
  }>({
    isLoading: true,
    isDeleting: false,
  });

  useEffect(() => {
    handleGetLibros();
  }, []);

  const handleGetLibros = async () => {
    if (books === undefined || books?.length < 1) {
      fetch("/api/libros")
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            setBooks(data.data);
          } else {
            toast.error("Por el momento no es posible obtener los libros");
          }
          setLoadingType({
            ...loadingType,
            isLoading: false,
          });
        });
    } else {
      setLoadingType({
        ...loadingType,
        isLoading: false,
      });
    }
  };

  const handleDelete = async () => {
    if (loadingType?.isDeleting) return;
    fetch(`/api/libros/delete/${librosSeleccionados?.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success(data.message);
          setLibrosSeleccionados(null);
          handleGetLibros();
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => {
        toast.error("Error al eliminar el libro");
      });
  };

  if (loadingType.isLoading) return <Loading />;

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
                {books.map((libro: IBook) => (
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
                      {libro.titulo}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {libro.autor}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {libro.anioPublicacion}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {libro.editorial}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {libro.tipo}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {libro.numPag}
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

const mapStateToProps = (state: IGlobal) => {
  return {
    books: state.books.books || [],
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setBooks: (books: IBook[]) => dispatch(setBooks(books)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
