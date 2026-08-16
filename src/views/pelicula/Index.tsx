"use client";

import LinkButton from "@/component/LinkButton/LinkButton";
import { IGlobal } from "@/interfaces/globalState";
import { IMovie } from "@/interfaces/interfacesBooks";
import { setMovies } from "@/redux/movies";
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

interface IIndexProps {
  movies: IMovie[];
  setPeliculas: (movies: IMovie[]) => void;
}

const Index = ({ movies, setPeliculas }: IIndexProps) => {
  const router = useRouter();
  const [peliculasSeleccionadas, setPeliculasSeleccionadas] =
    useState<IMovie>();
  const [loadingType, setLoadingType] = useState<{
    isLoading: boolean;
    isDeleting: boolean;
  }>({
    isLoading: true,
    isDeleting: false,
  });

  useEffect(() => {
    handleGetPeliculas();
  }, []);

  const handleGetPeliculas = async () => {
    if (movies === undefined || movies?.length < 1) {
      fetch("/api/peliculas")
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            setPeliculas(data.data);
          } else {
            toast.error("Por el momento no es posible obtener las peliculas");
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
    fetch(`/api/peliculas/delete/${peliculasSeleccionadas?.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          handleGetPeliculas();
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => {
        toast.error("Error al eliminar la pelicula");
      })
      .finally(() => {
        setPeliculasSeleccionadas(undefined);
      });
  };

  if (loadingType.isLoading) return <Loading />;

  return (
    <>
      <div className="flex flex-row justify-between items-center p-5">
        <h2 className="text-2xl font-bold">Peliculas</h2>
        <LinkButton href="/pelicula/agregar" text="Agregar Pelicula" />
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 p-5">
          <div className="col-span-1">
            <div className="flex flex-row justify-between items-center">
              <p className="text-lg font-bold">Todas las peliculas</p>
              <div className="flex flex-row justify-between items-center">
                <MdModeEditOutline
                  size={28}
                  className="cursor-pointer"
                  color={!peliculasSeleccionadas ? "gray" : "black"}
                  onClick={() =>
                    router.push(
                      `/pelicula/editar/${
                        peliculasSeleccionadas?.id || "jhooasdas"
                      }`
                    )
                  }
                />
                <MdDelete
                  size={28}
                  className="cursor-pointer"
                  color={!peliculasSeleccionadas ? "gray" : "black"}
                  onClick={handleDelete}
                />
              </div>
            </div>

            <br />
            <table className="table-auto border-collapse border border-gray-400 w-full max-h-[700px] overflow-auto">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Titulo</th>
                  <th className="border border-gray-400 px-4 py-2">Director</th>
                  <th className="border border-gray-400 px-4 py-2">Año</th>
                  <th className="border border-gray-400 px-4 py-2">Tipo</th>
                  <th className="border border-gray-400 px-4 py-2">Duracion</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {movies?.map((pelicula: IMovie) => (
                  <tr
                    key={pelicula.id}
                    onClick={() => setPeliculasSeleccionadas(pelicula)}
                    className={clsx(
                      "cursor-pointer",
                      pelicula.id === peliculasSeleccionadas?.id &&
                        "bg-primary/80 text-white"
                    )}
                  >
                    <td className="border border-gray-400 px-4 py-2">
                      {pelicula.titulo}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {pelicula.director}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {pelicula.anioPublicacion}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {pelicula.tipo}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {pelicula.duracion}
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
    movies: state.movies.movies || [],
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setPeliculas: (movies: IMovie[]) => dispatch(setMovies(movies)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
