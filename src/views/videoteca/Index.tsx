"use client";

import TextField from "@/component/TextField/TextField";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import CardMovie from "@/component/CardMovie";
import { Movie } from "@/types";
import {
  fetchMovies,
  selectMovies,
  selectMoviesStatus,
  useV1Dispatch,
  useV1Selector,
} from "@/store";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";

const Index = () => {
  const dispatch = useV1Dispatch();
  const peliculas = useV1Selector(selectMovies);
  const moviesStatus = useV1Selector(selectMoviesStatus);
  const { register, watch, setValue } = useForm();

  const filterMovies = peliculas.filter((movie) =>
    movie.title?.toLowerCase().includes(watch("search")?.toLowerCase())
  );

  useEffect(() => {
    setValue("search", "");
    dispatch(fetchMovies());
  }, [dispatch, setValue]);

  if (moviesStatus === "loading" || moviesStatus === "idle") {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center p-5">
        <p className="text-2xl font-bold">Videoteca</p>
        <div className="w-[200px] lg:w-[400px]">
          <TextField
            label="Búsqueda"
            placeholder="Búsqueda"
            value={watch("search")}
            type={"text"}
            isLabel={false}
            {...register("search")}
          />
        </div>
      </div>
      {filterMovies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
            {filterMovies.map((pelicula: Movie) => (
              <CardMovie key={pelicula.id} {...pelicula} />
            ))}
          </div>
        </>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default Index;
