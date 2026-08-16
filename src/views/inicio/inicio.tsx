"use client";

import { getFecha } from "@/utils/Utils";
import ModalPrestamo from "@/views/prestamo";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import clsx from "clsx";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";
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

  useEffect(() => {
    dispatch(fetchLoans());
  }, [dispatch]);

  const handleEntregar = (loanId: string) => {
    dispatch(updateLoan({ id: loanId, input: { status: "Returned" } }))
      .unwrap()
      .then(() => {
        toast.success("Prestamo entregado correctamente");
      })
      .catch(() => {
        toast.error("Error al actualizar el prestamo");
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
    <>
      <div className="flex flex-row items-center justify-between p-4 text-lg font-bold">
        <div>
          <h2>Hola, {sessionUser?.name} ✋🏻</h2>
          <p>{getFecha()}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="bg-primary text-white px-5 py-2 rounded-md"
        >
          Nuevo Prestamo
        </button>
      </div>

      {loans.length > 0 ? (
        <div className="grid grid-cols-4 gap-4 p-5">
          {loans.map((loan, index: number) => {
            const isOverdue = loan.returnDate < new Date().toISOString();
            return (
              <div
                key={index}
                className={clsx(
                  "w-[350px] rounded-md shadow-md flex flex-row justify-center items-center gap-2 cursor-pointer",
                  isOverdue ? "bg-red-200" : "bg-white"
                )}
              >
                <div className="w-[40%] h-full bg-primary/50 rounded-md">
                  <Image
                    src={loan.book?.image}
                    alt="libro"
                    width={120}
                    height={200}
                    className="rounded-md w-full h-full object-fill"
                  />
                </div>
                <div className="w-[60%] px-2">
                  <div>
                    <label className="text-sm font-bold">Estudiante: </label>
                    <p className="text-md">{loan.student?.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-bold">Libro: </label>
                    <p className="text-md">{loan.book?.title}</p>
                  </div>

                  <div>
                    <label className="text-sm font-bold">
                      Fecha de Prestamo:{" "}
                    </label>
                    <p className="text-md">{loan.loanDate}</p>
                  </div>

                  <div>
                    <label className="text-sm font-bold">
                      Fecha de Devolución:{" "}
                    </label>
                    <p className="text-md">{loan.returnDate}</p>
                  </div>
                  <div className="flex flex-row justify-end p-2 gap-2">
                    {isOverdue && (
                      <button
                        type="button"
                        onClick={() => {
                          sendEmail(loan.student.email);
                        }}
                        className="bg-primary text-white px-2 py-2 rounded-md text-[12px]"
                      >
                        Solicitar Devolución
                      </button>
                    )}

                    {loan.status === "Returned" ? (
                      <p className="text-md">Entregado</p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          handleEntregar(loan.id);
                        }}
                        className="bg-primary text-white px-2 py-2 rounded-md text-[12px]"
                      >
                        Entregar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty />
      )}

      {openModal && (
        <ModalPrestamo
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
        />
      )}
    </>
  );
};

export default Index;
