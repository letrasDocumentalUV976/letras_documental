import { Movie } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardMovieProps {
  movie: Movie;
  href?: string;
  actions?: React.ReactNode;
}

const typeLabels: Record<Movie["type"], string> = {
  original: "Original",
  copy: "Copia",
  bluray: "Blu-ray",
};

const CardMovie = ({ movie, href, actions }: CardMovieProps) => {
  const className =
    "flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg";

  const content = (
    <>
      <div className="relative h-40 w-full shrink-0 bg-primary/10">
        {movie.image ? (
          <Image
            src={movie.image}
            alt={movie.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-primary/40">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3
          className="line-clamp-1 font-bold text-gray-800"
          title={movie.title}
        >
          {movie.title}
        </h3>
        <p className="line-clamp-1 text-sm text-gray-500">{movie.director}</p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>Año: {movie.publicationYear}</span>
          <span>Duración: {movie.duration}</span>
        </div>
        <p className="line-clamp-1 text-xs text-gray-500">{movie.genre}</p>
        {movie.type && (
          <span className="mt-2 inline-block w-fit rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {typeLabels[movie.type] ?? movie.type}
          </span>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className}>
      {content}
      {actions && (
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default CardMovie;
