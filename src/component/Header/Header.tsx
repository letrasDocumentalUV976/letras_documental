"use client";

import { useState } from "react";
import { CiLogout, CiLogin } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

import Logo from "../../../public/Logo.png";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { selectSessionUser, useV1Selector } from "@/store";
import { signOutUser } from "@/services/firebase/auth.service";
import ConfirmModal from "@/component/ConfirmModal/ConfirmModal";

type NavLink = {
  href: string;
  label: string;
};

const publicLinks: NavLink[] = [
  { href: "/library", label: "Biblioteca" },
  { href: "/videos", label: "Videoteca" },
];

const privateLinks: NavLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/books", label: "Libros" },
  { href: "/movies", label: "Película" },
  { href: "/users", label: "Usuarios" },
];

const Header = () => {
  const [active, setActive] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const sessionUser = useV1Selector(selectSessionUser);
  const isLogged = Boolean(sessionUser);

  const handleClick = () => {
    setActive(!active);
  };

  const handleLogoutClick = () => {
    setConfirmLogoutOpen(true);
  };

  const confirmLogout = () => {
    signOutUser().finally(() => {
      setConfirmLogoutOpen(false);
      router.push("/login");
    });
  };

  const desactiveMenu = () => {
    setActive(false);
  };

  const navLinks = isLogged ? [...privateLinks, ...publicLinks] : publicLinks;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-primary shadow-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <Link
            href={"/"}
            className="flex flex-row items-center gap-2 shrink-0"
          >
            <Image src={Logo} alt="Logo" width={44} height={44} />
            <h1 className="hidden text-lg font-semibold text-white sm:block">
              Centro Documental
            </h1>
          </Link>

          <nav className="hidden lg:flex">
            <ul className="flex flex-row items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 ${
                      isActive(link.href) ? "bg-white/15" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-row items-center gap-3">
            {!isLogged && (
              <Link
                href={"/login"}
                className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:flex"
              >
                <CiLogin size={20} />
                Iniciar Sesión
              </Link>
            )}
            {isLogged && (
              <button
                onClick={handleLogoutClick}
                aria-label="Cerrar sesión"
                className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:flex"
              >
                <CiLogout size={20} />
                Cerrar Sesión
              </button>
            )}

            <button
              onClick={handleClick}
              aria-label="Abrir menú"
              className="rounded-md p-1.5 text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              <RxHamburgerMenu size={26} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          active ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={handleClick}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            active ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute right-0 top-0 flex h-full w-72 max-w-[80vw] flex-col bg-primary shadow-xl transition-transform duration-300 ${
            active ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-base font-semibold text-white">Menú</span>
            <button
              onClick={handleClick}
              aria-label="Cerrar menú"
              className="rounded-md p-1 text-white transition-colors hover:bg-white/10"
            >
              <IoClose size={24} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-2">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    onClick={desactiveMenu}
                    href={link.href}
                    className={`block rounded-md px-3 py-3 text-base font-medium text-white transition-colors hover:bg-white/10 ${
                      isActive(link.href) ? "bg-white/15" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-white/10 px-3 py-4">
            {!isLogged && (
              <Link
                onClick={desactiveMenu}
                href={"/login"}
                className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                <CiLogin size={22} />
                Iniciar Sesión
              </Link>
            )}
            {isLogged && (
              <button
                onClick={() => {
                  desactiveMenu();
                  handleLogoutClick();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                <CiLogout size={22} />
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmLogoutOpen}
        title="Cerrar sesión"
        description="¿Estás seguro de que deseas cerrar sesión?"
        confirmText="Cerrar sesión"
        variant="danger"
        onConfirm={confirmLogout}
        onCancel={() => setConfirmLogoutOpen(false)}
      />
    </>
  );
};

export default Header;
