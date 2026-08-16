"use client";

import LinkButton from "@/component/LinkButton/LinkButton";
import { Movie } from "@/types";
import {
  deleteMovie,
  fetchMovies,
  selectMovies,
  selectMoviesStatus,
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
  const movies = useV1Selector(selectMovies);
  const moviesStatus = useV1Selector(selectMoviesStatus);
  const router = useRouter();
  const [peliculasSeleccionadas, setPeliculasSeleccionadas] =
    useState<Movie>();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleDelete = async () => {
    if (isDeleting || !peliculasSeleccionadas) return;
    setIsDeleting(true);
    dispatch(deleteMovie(peliculasSeleccionadas.id))
      .unwrap()
      .catch(() => {
        toast.error("Error al eliminar la pelicula");
      })
      .finally(() => {
        setPeliculasSeleccionadas(undefined);
        setIsDeleting(false);
      });
  };

  if (moviesStatus === "loading" || moviesStatus === "idle") return <Loading />;

  return (
    <>
      <div className="flex flex-row justify-between items-center p-5">
        <h2 className="text-2xl font-bold">Peliculas</h2>
        <LinkButton href="/movies/add" text="Agregar Pelicula" />
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
                      `/movies/edit/${
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
                {movies?.map((pelicula: Movie) => (
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
                      {pelicula.title}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {pelicula.director}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {pelicula.publicationYear}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {pelicula.type}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {pelicula.duration}
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
