"use client";

import CardMovie from "@/component/CardMovie";
import TextField from "@/component/TextField/TextField";
import { Movie } from "@/types";
import {
  fetchMovies,
  selectMovies,
  selectMoviesStatus,
  useV1Dispatch,
  useV1Selector,
} from "@/store";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";

const Index = () => {
  const dispatch = useV1Dispatch();
  const movies = useV1Selector(selectMovies);
  const moviesStatus = useV1Selector(selectMoviesStatus);
  const { register, watch, setValue } = useForm();

  useEffect(() => {
    setValue("search", "");
    dispatch(fetchMovies());
  }, [dispatch, setValue]);

  const search = watch("search") || "";
  const filteredMovies = movies.filter((movie: Movie) =>
    movie.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (moviesStatus === "loading" || moviesStatus === "idle") {
    return <Loading />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Videoteca</h2>
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
      </div>

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMovies.map((movie: Movie) => (
            <CardMovie key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default Index;
