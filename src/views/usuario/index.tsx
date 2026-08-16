"use client";

import LinkButton from "@/component/LinkButton/LinkButton";
import { PublicUser } from "@/types";
import {
  deleteUser,
  fetchUsers,
  selectUsers,
  selectUsersStatus,
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
  const usuarios = useV1Selector(selectUsers);
  const usersStatus = useV1Selector(selectUsersStatus);
  const router = useRouter();
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<PublicUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = async () => {
    if (isDeleting || !usuarioSeleccionado) return;
    setIsDeleting(true);
    dispatch(deleteUser(usuarioSeleccionado.id))
      .unwrap()
      .then(() => {
        toast.success("Usuario eliminado correctamente");
        setUsuarioSeleccionado(null);
      })
      .catch(() => {
        toast.error("Error al eliminar el usuario");
      })
      .finally(() => setIsDeleting(false));
  };

  if (usersStatus === "loading" || usersStatus === "idle") return <Loading />;

  return (
    <>
      <div className="flex flex-row justify-between items-center p-5">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <LinkButton href="/usuario/agregar" text="Agregar Pelicula" />
      </div>

      {usuarios.length > 0 ? (
        <div className="grid grid-cols-2 p-5">
          <div className="col-span-1">
            <div className="flex flex-row justify-between items-center">
              <p className="text-lg font-bold">Todas las peliculas</p>
              <div className="flex flex-row justify-between items-center">
                <MdModeEditOutline
                  size={28}
                  className="cursor-pointer"
                  color={!usuarioSeleccionado ? "gray" : "black"}
                  onClick={() =>
                    router.push(
                      `/usuario/editar/${
                        usuarioSeleccionado?.id || "jhooasdas"
                      }`
                    )
                  }
                />
                <MdDelete
                  size={28}
                  className="cursor-pointer"
                  color={!usuarioSeleccionado ? "gray" : "black"}
                  onClick={handleDelete}
                />
              </div>
            </div>

            <br />
            <table className="table-auto border-collapse border border-gray-400 w-full">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Nombre</th>
                  <th className="border border-gray-400 px-4 py-2">Correo</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {usuarios.map((usuario) => (
                  <tr
                    key={usuario.id}
                    onClick={() => setUsuarioSeleccionado(usuario)}
                    className={clsx(
                      "cursor-pointer",
                      usuario.id === usuarioSeleccionado?.id &&
                        "bg-primary/80 text-white"
                    )}
                  >
                    <td className="border border-gray-400 px-4 py-2">
                      {usuario.name}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {usuario.email}
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
