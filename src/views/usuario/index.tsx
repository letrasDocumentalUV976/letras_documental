"use client";

import CardUser from "@/component/CardUser";
import LinkButton from "@/component/LinkButton/LinkButton";
import TextField from "@/component/TextField/TextField";
import { PublicUser } from "@/types";
import {
  deleteUser,
  fetchUsers,
  selectUsers,
  selectUsersStatus,
  useV1Dispatch,
  useV1Selector,
} from "@/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import Loading from "@/component/Loader/Loader";
import Empty from "@/component/Empty/Empty";
import ConfirmModal from "@/component/ConfirmModal/ConfirmModal";

const Index = () => {
  const dispatch = useV1Dispatch();
  const users = useV1Selector(selectUsers);
  const usersStatus = useV1Selector(selectUsersStatus);
  const router = useRouter();
  const { register, watch, setValue } = useForm();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PublicUser | null>(null);

  useEffect(() => {
    setValue("search", "");
    dispatch(fetchUsers());
  }, [dispatch, setValue]);

  const search = watch("search") || "";
  const filteredUsers = users.filter(
    (user: PublicUser) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const user = pendingDelete;

    setDeletingId(user.id);
    dispatch(deleteUser(user.id))
      .unwrap()
      .then(() => {
        toast.success("Usuario eliminado correctamente");
      })
      .catch(() => {
        toast.error("Error al eliminar el usuario");
      })
      .finally(() => {
        setDeletingId(null);
        setPendingDelete(null);
      });
  };

  if (usersStatus === "loading" || usersStatus === "idle") return <Loading />;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Usuarios</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-[220px] lg:w-[320px]">
            <TextField
              label="Búsqueda"
              placeholder="Buscar por nombre o correo..."
              value={watch("search")}
              type="text"
              isLabel={false}
              {...register("search")}
            />
          </div>
          <LinkButton href="/users/add" text="Agregar Usuario" />
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="flex flex-col gap-3 p-5">
          {filteredUsers.map((user: PublicUser) => (
            <CardUser
              key={user.id}
              user={user}
              actions={
                <>
                  <button
                    onClick={() => router.push(`/users/edit/${user.id}`)}
                    aria-label={`Editar ${user.name}`}
                    className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary"
                  >
                    <MdModeEditOutline size={20} />
                  </button>
                  <button
                    onClick={() => setPendingDelete(user)}
                    disabled={deletingId === user.id}
                    aria-label={`Eliminar ${user.name}`}
                    className="rounded-md p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <MdDelete size={20} />
                  </button>
                </>
              }
            />
          ))}
        </div>
      ) : (
        <Empty />
      )}

      <ConfirmModal
        open={!!pendingDelete}
        title="Eliminar usuario"
        description={`¿Eliminar a "${pendingDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={!!deletingId}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default Index;
