import { Book } from "@/types";
import { parseTypeTags } from "@/utils/Utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardBookProps {
  book: Book;
  href?: string;
  actions?: React.ReactNode;
  unavailable?: boolean;
}

const CardBook = ({ book, href, actions, unavailable }: CardBookProps) => {
  const className =
    "flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg";
  const typeTags = parseTypeTags(book.type);

  const content = (
    <>
      <div className="relative h-40 w-full shrink-0 bg-primary/10">
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-primary/40">
            Sin imagen
          </div>
        )}
        {unavailable && (
          <span className="absolute right-2 top-2 rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
            No disponible
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3
          className="line-clamp-1 font-bold text-gray-800"
          title={book.title}
        >
          {book.title}
        </h3>
        <p className="line-clamp-1 text-sm text-gray-500">{book.author}</p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>Año: {book.publicationYear}</span>
          <span>Páginas: {book.pageCount}</span>
        </div>
        <p className="line-clamp-1 text-xs text-gray-500">{book.publisher}</p>
        {typeTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {typeTags.map((tag) => (
              <span
                key={tag}
                className="inline-block w-fit rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
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

export default CardBook;
