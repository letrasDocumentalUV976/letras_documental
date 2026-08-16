"use client";

import { getFecha } from "@/utils/Utils";
import ModalPrestamo from "@/views/prestamo";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";
import CardLoan from "@/component/CardLoan";
import ConfirmModal from "@/component/ConfirmModal/ConfirmModal";
import { Loan } from "@/types";
import {
  fetchLoans,
  selectLoans,
  selectLoansStatus,
  selectSessionUser,
  updateLoan,
  useV1Dispatch,
  useV1Selector,
} from "@/store";

const Index = () => {
  const dispatch = useV1Dispatch();
  const loans = useV1Selector(selectLoans);
  const loansStatus = useV1Selector(selectLoansStatus);
  const sessionUser = useV1Selector(selectSessionUser);
  const [openModal, setOpenModal] = useState(false);
  const [pendingReturn, setPendingReturn] = useState<Loan | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    if (loansStatus === "idle") dispatch(fetchLoans());
  }, [dispatch, loansStatus]);

  const confirmEntregar = () => {
    if (!pendingReturn) return;
    const loan = pendingReturn;

    setReturningId(loan.id);
    dispatch(updateLoan({ id: loan.id, input: { status: "Returned" } }))
      .unwrap()
      .then(() => {
        toast.success("Prestamo entregado correctamente");
      })
      .catch(() => {
        toast.error("Error al actualizar el prestamo");
      })
      .finally(() => {
        setReturningId(null);
        setPendingReturn(null);
      });
  };

  const sendEmail = (email: string) => {
    fetch(`/api/email?correo=${email}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
  };

  if (loansStatus === "loading" || loansStatus === "idle") {
    return <Loading />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Hola, {sessionUser?.name} ✋🏻
          </h2>
          <p className="text-sm text-gray-500">{getFecha()}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="rounded-md bg-primary px-5 py-2 font-medium text-white transition-colors hover:bg-primary/90"
        >
          Nuevo Préstamo
        </button>
      </div>

      {loans.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loans.map((loan) => {
            const isOverdue =
              loan.status !== "Returned" &&
              loan.returnDate < new Date().toISOString();
            return (
              <CardLoan
                key={loan.id}
                loan={loan}
                isOverdue={isOverdue}
                actions={
                  loan.status !== "Returned" ? (
                    <>
                      {isOverdue && (
                        <button
                          type="button"
                          onClick={() => sendEmail(loan.student.email)}
                          className="rounded-md border border-gray-300 px-2 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                        >
                          Solicitar Devolución
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setPendingReturn(loan)}
                        disabled={returningId === loan.id}
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Entregar
                      </button>
                    </>
                  ) : undefined
                }
              />
            );
          })}
        </div>
      ) : (
        <Empty />
      )}

      <ConfirmModal
        open={!!pendingReturn}
        title="Entregar préstamo"
        description={`¿Confirmas la entrega de "${pendingReturn?.book?.title}"?`}
        confirmText="Entregar"
        isLoading={!!returningId}
        onConfirm={confirmEntregar}
        onCancel={() => setPendingReturn(null)}
      />

      {openModal && (
        <ModalPrestamo
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default Index;
