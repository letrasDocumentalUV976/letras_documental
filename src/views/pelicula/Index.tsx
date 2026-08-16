"use client";

import CardMovie from "@/component/CardMovie";
import LinkButton from "@/component/LinkButton/LinkButton";
import TextField from "@/component/TextField/TextField";
import { Movie } from "@/types";
import {
  deleteMovie,
  fetchMovies,
  selectMovies,
  selectMoviesStatus,
  useV1Dispatch,
  useV1Selector,
} from "@/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";
import ConfirmModal from "@/component/ConfirmModal/ConfirmModal";

const Index = () => {
  const dispatch = useV1Dispatch();
  const movies = useV1Selector(selectMovies);
  const moviesStatus = useV1Selector(selectMoviesStatus);
  const router = useRouter();
  const { register, watch, setValue } = useForm();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Movie | null>(null);

  useEffect(() => {
    setValue("search", "");
    if (moviesStatus === "idle") dispatch(fetchMovies());
  }, [dispatch, setValue, moviesStatus]);

  const search = watch("search") || "";
  const filteredMovies = movies.filter((movie: Movie) =>
    movie.title?.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const movie = pendingDelete;

    setDeletingId(movie.id);
    dispatch(deleteMovie(movie.id))
      .unwrap()
      .then(() => {
        toast.success("Película eliminada correctamente");
      })
      .catch(() => {
        toast.error("Error al eliminar la película");
      })
      .finally(() => {
        setDeletingId(null);
        setPendingDelete(null);
      });
  };

  if (moviesStatus === "loading" || moviesStatus === "idle")
    return <Loading />;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Películas</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-[220px] lg:w-[320px]">
            <TextField
              label="Búsqueda"
              placeholder="Buscar por título..."
              value={watch("search")}
              type="text"
              isLabel={false}
              {...register("search")}
            />
          </div>
          <LinkButton href="/movies/add" text="Agregar Película" />
        </div>
      </div>

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMovies.map((movie: Movie) => (
            <CardMovie
              key={movie.id}
              movie={movie}
              actions={
                <>
                  <button
                    onClick={() => router.push(`/movies/edit/${movie.id}`)}
                    aria-label={`Editar ${movie.title}`}
                    className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary"
                  >
                    <MdModeEditOutline size={20} />
                  </button>
                  <button
                    onClick={() => setPendingDelete(movie)}
                    disabled={deletingId === movie.id}
                    aria-label={`Eliminar ${movie.title}`}
                    className="rounded-md p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <MdDelete size={20} />
                  </button>
                </>
              }
            />
          ))}
        </div>
      ) : (
        <Empty />
      )}

      <ConfirmModal
        open={!!pendingDelete}
        title="Eliminar película"
        description={`¿Eliminar "${pendingDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={!!deletingId}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default Index;
