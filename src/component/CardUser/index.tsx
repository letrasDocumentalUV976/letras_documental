import { PublicUser } from "@/types";
import { formatDateTime } from "@/utils/Utils";
import React from "react";

interface CardUserProps {
  user: PublicUser;
  actions?: React.ReactNode;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const CardUser = ({ user, actions }: CardUserProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-md transition-shadow hover:shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {getInitials(user.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-gray-800">{user.name}</p>
          <p className="truncate text-sm text-gray-500">{user.email}</p>
          <p className="truncate text-xs text-gray-400">
            {user.lastLogin
              ? `Último acceso: ${formatDateTime(user.lastLogin)}`
              : "Aún no ha iniciado sesión"}
          </p>
        </div>
      </div>

      {actions && (
        <div className="flex items-center justify-end gap-2">{actions}</div>
      )}
    </div>
  );
};

export default CardUser;
