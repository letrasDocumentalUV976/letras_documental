"use client";

import { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";

import Logo from "../../../public/Logo.png";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const [active, setActive] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  useEffect(() => {
    const autenticado = localStorage.getItem("autenticado");
    setIsLogged(Boolean(autenticado));
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("autenticado");
      localStorage.removeItem("user");
      window.location.reload();
    }
  };

  const desactiveMenu = () => {
    setActive(false);
  };

  if (active) {
    return (
      <div className="fixed hrefp-0 left-0 z-50 flex flex-col items-center justify-center w-screen h-screen bg-primary">
        <div className="absolute top-5 right-5" onClick={handleClick}>
          <IoClose color={"white"} size={28} />
        </div>

        <ul className="text-white">
          <li className="p-4 text-lg font-bold text-center">
            <Link onClick={desactiveMenu} href={"/"}>
              Inicio
            </Link>
          </li>

          <li className="p-4 text-lg font-bold text-center">
            <Link onClick={desactiveMenu} href={"/library"}>
              Biblioteca
            </Link>
          </li>
          <li className="p-4 text-lg font-bold text-center">
            <Link onClick={desactiveMenu} href={"/videos"}>
              Videoteca
            </Link>
          </li>

          <li className="p-4 text-lg font-bold text-center">
            <Link onClick={desactiveMenu} href={"/books"}>
              Libros
            </Link>
          </li>
          <li className="p-4 text-lg font-bold text-center">
            <Link onClick={desactiveMenu} href={"/movies"}>
              Película
            </Link>
          </li>
          <li className="p-4 text-lg font-bold text-center">
            <Link onClick={desactiveMenu} href={"/users"}>
              Usuarios
            </Link>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <>
      <header className="flex flex-row items-center justify-between w-screen px-4 bg-primary">
        <div onClick={handleClick} className="lg:hidden">
          <RxHamburgerMenu color={"white"} size={28} />
        </div>

        <nav className="hidden lg:flex text-white">
          <ul className="flex flex-row">
            <li className="p-4 text-lg font-bold text-center">
              <Link href={"/"}>Inicio</Link>
            </li>

            <li className="p-4 text-lg font-bold text-center">
              <Link href={"/library"}>Biblioteca</Link>
            </li>
            <li className="p-4 text-lg font-bold text-center">
              <Link href={"/videos"}>Videoteca</Link>
            </li>

            <li className="p-4 text-lg font-bold text-center">
              <Link href={"/books"}>Libros</Link>
            </li>
            <li className="p-4 text-lg font-bold text-center">
              <Link href={"/movies"}>Película</Link>
            </li>
            <li className="p-4 text-lg font-bold text-center">
              <Link href={"/users"}>Usuarios</Link>
            </li>
          </ul>
        </nav>

        <div className="flex flex-row items-center justify-center gap-5">
          <section className="flex flex-row items-center justify-center text-secondary-a">
            <Image src={Logo} alt="Logo" width={80} height={80} />
            <h1 className="text-white">Centro Documental</h1>
          </section>
          {!isLogged && (
            <Link
              href={"/login"}
              className="flex flex-col justify-center items-center gap-1 cursor-pointer"
            >
              <CiLogin size={24} color="white" />
              <p className="text-white text-[12px]">Iniciar Sesión</p>
            </Link>
          )}
          {isLogged && (
            <CiLogout
              onClick={handleLogout}
              size={35}
              color="white"
              className="cursor-pointer"
            />
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
