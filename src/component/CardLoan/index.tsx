import { Loan } from "@/types";
import { formatDateWithWeekday } from "@/utils/Utils";
import Image from "next/image";
import clsx from "clsx";
import React from "react";

interface CardLoanProps {
  loan: Loan;
  isOverdue: boolean;
  actions?: React.ReactNode;
}

const CardLoan = ({ loan, isOverdue, actions }: CardLoanProps) => {
  const statusLabel =
    loan.status === "Returned" ? "Entregado" : isOverdue ? "Vencido" : "Prestado";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="relative h-40 w-full shrink-0 bg-primary/10">
        {loan.book?.image ? (
          <Image
            src={loan.book.image}
            alt={loan.book.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-primary/40">
            Sin imagen
          </div>
        )}
        <span
          className={clsx(
            "absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-semibold",
            loan.status === "Returned"
              ? "bg-green-100 text-green-700"
              : isOverdue
                ? "bg-red-100 text-red-700"
                : "bg-primary/10 text-primary"
          )}
        >
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3
          className="line-clamp-1 font-bold text-gray-800"
          title={loan.book?.title}
        >
          {loan.book?.title}
        </h3>
        <p className="line-clamp-1 text-sm text-gray-500">
          {loan.student?.name}
        </p>

        <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500">
          <span>Préstamo: {formatDateWithWeekday(loan.loanDate)}</span>
          <span>Devolución: {formatDateWithWeekday(loan.returnDate)}</span>
        </div>
      </div>

      {actions && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 p-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default CardLoan;
