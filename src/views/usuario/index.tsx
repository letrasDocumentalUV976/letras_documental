"use client";

import LinkButton from "@/component/LinkButton/LinkButton";
import { IUsuario } from "@/interfaces/interfacesBooks";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";

const Index = () => {
  const router = useRouter();
  const [usuarios, setUsuario] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<IUsuario | null>(null);
  const [loadingType, setLoadingType] = useState<{
    isLoading: boolean;
    isDeleting: boolean;
  }>({
    isLoading: true,
    isDeleting: false,
  });

  useEffect(() => {
    handleGetUsuarios();
  }, []);

  const handleGetUsuarios = async () => {
    fetch("/api/usuarios")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setUsuario(data.data);
        } else {
          toast.error("Por el momento no es posible obtener las peliculas");
        }
        setLoadingType({
          ...loadingType,
          isLoading: false,
        });
      });
  };

  if (loadingType.isLoading) return <Loading />;

  const handleDelete = async () => {
    if (loadingType?.isDeleting) return;
    fetch(`/api/usuarios/delete/${usuarioSeleccionado?.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success(data.message);
          setUsuarioSeleccionado(null);
          handleGetUsuarios();
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => {
        toast.error("Error al eliminar la pelicula");
      });
  };

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
                {usuarios.map((usuario: IUsuario) => (
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
                      {usuario.nombre}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {usuario.correo}
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
