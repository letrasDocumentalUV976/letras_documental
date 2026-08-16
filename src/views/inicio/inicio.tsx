"use client";

import { IPrestamo, IUsuario } from "@/interfaces/interfacesBooks";
import { getFecha } from "../../../app/utils/Utils";
import ModalPrestamo from "@/views/prestamo";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { IGlobal } from "@/interfaces/globalState";
import { Dispatch } from "@reduxjs/toolkit";
import { setPrestamos } from "@/redux/prestamos";
import { connect } from "react-redux";
import clsx from "clsx";
import { setUsuario } from "@/redux/usuario";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";

interface IProps {
  prestamos: IPrestamo[];
  user: IUsuario;
  setPrestamos: (prestamos: IPrestamo[]) => void;
  setUsuario: (usuario: IUsuario) => void;
}

const Index = ({ prestamos, setPrestamos, user }: IProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [usuarioLS, setUsuarioLS] = useState<IUsuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newPrestamoObserver, setNewPrestamoObserver] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setUsuarioLS(user ? JSON.parse(user) : null);
  }, []);

  useEffect(() => {
    if (newPrestamoObserver) {
      fetch("/api/prestamo", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            setPrestamos(data.data);
          } else {
            toast.error(data.message);
          }
        });
    }
  }, [newPrestamoObserver, setNewPrestamoObserver]);

  useEffect(() => {
    if (!user) {
      const usuario = JSON.parse(localStorage.getItem("user") || "{}");
      if (usuario) {
        setUsuario(usuario);
      }
    }

    if (prestamos === undefined || prestamos.length < 1) {
      fetch("/api/prestamo", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            setPrestamos(data.data);
          } else {
            toast.error(data.message);
          }
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleEntregar = (prestamo: IPrestamo) => {
    const prestamoDevuelto = {
      ...prestamo,
      estado: "Entregado",
    };
    fetch("/api/prestamo", {
      method: "PUT",
      body: JSON.stringify(prestamoDevuelto),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success(data.message);

          const prestamosActualizados = prestamos.map(
            (prestamoItem: IPrestamo) => {
              if (prestamoItem.id === prestamo.id) {
                return prestamoDevuelto;
              }
              return prestamoItem;
            }
          );

          setPrestamos(prestamosActualizados);
        } else {
          toast.error(data.message);
        }
      });
  };

  const sendEmail = (prestamo: IPrestamo) => {
    fetch(`/api/email?correo=${prestamo.estudiante.correo}`, {
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between p-4 text-lg font-bold">
        <div>
          <h2>Hola, {usuarioLS?.nombre} ✋🏻</h2>
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

      {prestamos.length > 0 ? (
        <div className="grid grid-cols-4 gap-4 p-5">
          {prestamos.map((prestamo: IPrestamo, index: number) => {
            return (
              <div
                key={index}
                className={clsx(
                  "w-[350px] rounded-md shadow-md flex flex-row justify-center items-center gap-2 cursor-pointer",
                  prestamo.fechaDevolucion < new Date().toISOString()
                    ? "bg-red-200"
                    : "bg-white"
                )}
              >
                <div className="w-[40%] h-full bg-primary/50 rounded-md">
                  <Image
                    src={prestamo?.libro?.imagen}
                    alt="libro"
                    width={120}
                    height={200}
                    className="rounded-md w-full h-full object-fill"
                  />
                </div>
                <div className="w-[60%] px-2">
                  <div>
                    <label className="text-sm font-bold">Estudiante: </label>
                    <p className="text-md">{prestamo?.estudiante?.nombre}</p>
                  </div>

                  <div>
                    <label className="text-sm font-bold">Libro: </label>
                    <p className="text-md">{prestamo?.libro?.titulo}</p>
                  </div>

                  <div>
                    <label className="text-sm font-bold">
                      Fecha de Prestamo:{" "}
                    </label>
                    <p className="text-md">{prestamo?.fechaPrestamo}</p>
                  </div>

                  <div>
                    <label className="text-sm font-bold">
                      Fecha de Devolución:{" "}
                    </label>
                    <p className="text-md">{prestamo?.fechaDevolucion}</p>
                  </div>
                  <div className="flex flex-row justify-end p-2 gap-2">
                    {prestamo.fechaDevolucion < new Date().toISOString() && (
                      <button
                        type="button"
                        onClick={() => {
                          sendEmail(prestamo);
                        }}
                        className="bg-primary text-white px-2 py-2 rounded-md text-[12px]"
                      >
                        Solicitar Devolución
                      </button>
                    )}

                    {prestamo?.estado === "Entregado" ? (
                      <p className="text-md">Entregado</p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          handleEntregar(prestamo);
                        }}
                        className="bg-primary text-white px-2 py-2 rounded-md text-[12px]"
                      >
                        {prestamo?.estado === "Entregado"
                          ? "Entregado"
                          : "Entregar"}
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
          prestamos={prestamos}
          setNewPrestamoObserver={setNewPrestamoObserver}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: IGlobal) => {
  return {
    prestamos: state.prestamos.prestamos || [],
    user: state.user.usuario || {},
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setPrestamos: (prestamos: IPrestamo[]) => dispatch(setPrestamos(prestamos)),
    setUsuario: (usuario: IUsuario) => dispatch(setUsuario(usuario)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
