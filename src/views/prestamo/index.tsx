"use client";

import React, { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { HiUserAdd } from "react-icons/hi";
import TextField from "@/component/TextField/TextField";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Book, Student } from "@/types";
import {
  createLoan,
  createStudent,
  fetchBooks,
  fetchStudents,
  selectBooks,
  selectLoans,
  selectStudents,
  useV1Dispatch,
  useV1Selector,
} from "@/store";

interface Props {
  closeModal: () => void;
  openModal: boolean;
}

const Index = ({ closeModal, openModal }: Props) => {
  const dispatch = useV1Dispatch();
  const students = useV1Selector(selectStudents);
  const books = useV1Selector(selectBooks);
  const loans = useV1Selector(selectLoans);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const [openModalStudent, setOpenModalStudent] = useState(false);

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    null
  );

  const onSubmit = async (data: FieldValues) => {
    if (!data.name || !data.enrollmentNumber || !data.email) {
      toast.error("Todos los campos son requeridos");
      return;
    }

    const enrollmentRegex = /^S\d{8}$/i;
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

    if (!enrollmentRegex.test(data.enrollmentNumber)) {
      toast.error("La matrícula debe empezar con 'S' y contener 8 dígitos.");
      return;
    }

    if (!emailRegex.test(data.email)) {
      toast.error("El correo no es válido");
      return;
    }

    if (
      students.some(
        (student) => student.enrollmentNumber === data.enrollmentNumber
      )
    ) {
      toast.error("La matrícula ya ha sido registrada");
      return;
    }

    dispatch(
      createStudent({
        name: data.name,
        enrollmentNumber: data.enrollmentNumber,
        email: data.email,
      })
    )
      .unwrap()
      .then(() => {
        reset();
        setOpenModalStudent(false);
        toast.success("Estudiante guardado correctamente");
      })
      .catch(() => {
        toast.error("Ocurrió un error, inténtelo más tarde");
      });
  };

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchBooks());
  }, [dispatch]);

  const onSubmitPrestamo = (e: FieldValues) => {
    e.preventDefault();
    if (selectedBook && selectedStudent) {
      const libroPrestado = loans.find(
        (loan) =>
          loan.book.id === selectedBook.id && loan.status === "Loaned"
      );

      if (libroPrestado) {
        toast.error("El libro seleccionado ya ha sido prestado");
        return;
      }

      dispatch(
        createLoan({
          book: selectedBook,
          student: selectedStudent,
          status: "Loaned",
          loanDate: new Date().toLocaleDateString(),
          returnDate: new Date(
            new Date().setDate(new Date().getDate() + 15)
          ).toLocaleDateString(),
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Prestamo agregado correctamente");
          closeModal();
        })
        .catch(() => toast.error("Ocurrio un error, intentelo más tarde"));
    } else {
      toast.error("Asegurate de seleccionar un libro y un estudiante");
    }
  };

  return (
    <div
      className={`w-full h-full bg-black/30 absolute top-0 left-0 z-50 ${
        openModal
          ? "animate-fade-up"
          : "animate-jump-out animate-once animate-duration-1000"
      }`}
    >
      {openModalStudent ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <form
            className="rounded-md p-5 shadow-md w-[50%] h-[50%] bg-white relative flex flex-col gap-5 "
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="text-2xl font-bold">Información del Estudiante</h1>
            <p className="text-red-500">*Todos los campos son requeridos</p>
            <IoCloseCircleOutline
              className="text-primary text-4xl absolute top-1 right-1 cursor-pointer"
              onClick={() => setOpenModalStudent(false)}
            />
            <div className="flex flex-col gap-5">
              <TextField
                label="Nombre Completo"
                errors={!!errors.name}
                placeholder="Nombre Completo"
                value={watch("name")}
                type={"text"}
                isLabel={false}
                message={""}
                {...register("name")}
              />

              <TextField
                label="Matrícula"
                errors={!!errors.enrollmentNumber}
                placeholder="Matrícula"
                value={watch("enrollmentNumber")}
                type={"text"}
                isLabel={false}
                message={""}
                {...register("enrollmentNumber")}
              />

              <TextField
                label="Correo"
                errors={!!errors.email}
                placeholder="Correo"
                value={watch("email")}
                type={"text"}
                isLabel={false}
                message={""}
                {...register("email")}
              />

              <button
                type="submit"
                className="bg-primary text-white px-5 py-2 rounded-md"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-screen h-full flex justify-center items-center">
          <form
            onSubmit={onSubmitPrestamo}
            className="rounded-md p-5 shadow-md w-[50%] h-[50%] bg-white relative flex flex-row gap-5 "
          >
            <IoCloseCircleOutline
              className="text-primary text-4xl absolute top-1 right-1 cursor-pointer"
              onClick={closeModal}
            />
            <div className=" h-full bg-white w-1/2 flex gap-5 flex-col">
              <div className="w-full">
                <div className="w-[200px] lg:w-[400px]">
                  <label className="py-5 font-bold">
                    Ingrese el titulo del Libro
                  </label>
                  <div className="w-full border border-gray-400 rounded-md p-1 relative">
                    <select
                      name=""
                      id=""
                      className="border-transparent w-full h-full p-2 outline-none"
                      onChange={(e) => {
                        const book = books.find(
                          (book) => book.id === e.target.value
                        );
                        setSelectedBook(book ?? null); // Asegúrate de que no sea undefined
                      }}
                    >
                      <option value="">Seleccionar</option>
                      {books.map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="w-[200px] lg:w-[400px]">
                  <label className="py-5 font-bold">Ingresa la matricula</label>
                  <div className="flex flex-row gap-2 items-center">
                    <div className="w-full border border-gray-400 rounded-md p-1 relative">
                      <select
                        name=""
                        id=""
                        className="border-transparent w-full h-full p-2 outline-none"
                        onChange={(e) => {
                          const student = students.find(
                            (student) => student.id === e.target.value
                          );
                          setSelectedStudent(student ?? null); // Asegúrate de que no sea undefined
                        }}
                      >
                        <option value="">Seleccionar</option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.enrollmentNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                    <HiUserAdd
                      className="text-primary text-4xl cursor-pointer"
                      onClick={() => setOpenModalStudent(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full bg-white w-1/2">
              <p className="text-2xl font-bold">Información de Prestamo</p>
              <div>
                <p className="font-bold text-xl">Información del libro</p>
                <p>Titulo: {selectedBook?.title}</p>
                <p>Autor: {selectedBook?.author}</p>
                <p>Año: {selectedBook?.publicationYear}</p>
                <p>Editorial: {selectedBook?.publisher}</p>
              </div>
              <br />

              <div>
                <p className="font-bold text-xl">Información del alumno</p>
                <p>Nombre: {selectedStudent?.name}</p>
                <p>Matricula: {selectedStudent?.enrollmentNumber}</p>
                <p>Correo: {selectedStudent?.email}</p>
              </div>
              <br />

              <div>
                <p className="font-bold text-xl">Información del prestamo</p>
                <p>Fecha de prestamo: {new Date().toLocaleDateString()}</p>
                <p>
                  Fecha de devolución:{" "}
                  {new Date(
                    new Date().setDate(new Date().getDate() + 15)
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="flex justify-end my-5">
                <button
                  type="submit"
                  className="bg-primary text-white px-5 py-2 rounded-md"
                >
                  Guardar Prestamo
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Index;
