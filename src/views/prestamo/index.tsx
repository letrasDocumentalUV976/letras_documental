"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IoClose, IoArrowBack } from "react-icons/io5";
import { HiUserAdd } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Image from "next/image";
import {
  FieldValues,
  useForm,
  UseFormRegisterReturn,
} from "react-hook-form";
import toast from "react-hot-toast";
import { Book, Student } from "@/types";
import Combobox from "@/component/Combobox/Combobox";
import {
  createLoan,
  createStudent,
  fetchBooks,
  fetchStudents,
  selectBooks,
  selectBooksStatus,
  selectLoans,
  selectStudents,
  selectStudentsStatus,
  useV1Dispatch,
  useV1Selector,
} from "@/store";

interface Props {
  closeModal: () => void;
  openModal: boolean;
}

const FormField = ({
  label,
  placeholder,
  registration,
  error,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  type?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
      {...registration}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

const Index = ({ closeModal, openModal }: Props) => {
  const dispatch = useV1Dispatch();
  const students = useV1Selector(selectStudents);
  const studentsStatus = useV1Selector(selectStudentsStatus);
  const books = useV1Selector(selectBooks);
  const booksStatus = useV1Selector(selectBooksStatus);
  const loans = useV1Selector(selectLoans);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [openModalStudent, setOpenModalStudent] = useState(false);
  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false);
  const [isSubmittingLoan, setIsSubmittingLoan] = useState(false);

  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const selectedBook: Book | null = useMemo(
    () => books.find((book) => book.id === selectedBookId) ?? null,
    [books, selectedBookId]
  );
  const selectedStudent: Student | null = useMemo(
    () => students.find((student) => student.id === selectedStudentId) ?? null,
    [students, selectedStudentId]
  );

  const loanedBookIds = useMemo(
    () =>
      new Set(
        loans.filter((loan) => loan.status === "Loaned").map((loan) => loan.book.id)
      ),
    [loans]
  );
  const availableBooks = useMemo(
    () => books.filter((book) => !loanedBookIds.has(book.id)),
    [books, loanedBookIds]
  );

  const loanDate = useMemo(() => new Date(), []);
  const returnDate = useMemo(
    () => new Date(new Date().setDate(loanDate.getDate() + 15)),
    [loanDate]
  );

  useEffect(() => {
    if (studentsStatus === "idle") dispatch(fetchStudents());
    if (booksStatus === "idle") dispatch(fetchBooks());
  }, [dispatch, studentsStatus, booksStatus]);

  const onSubmitStudent = (data: FieldValues) => {
    setIsSubmittingStudent(true);
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
      })
      .finally(() => setIsSubmittingStudent(false));
  };

  const onSubmitPrestamo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !selectedStudent) {
      toast.error("Asegurate de seleccionar un libro y un estudiante");
      return;
    }

    const libroPrestado = loans.find(
      (loan) => loan.book.id === selectedBook.id && loan.status === "Loaned"
    );

    if (libroPrestado) {
      toast.error("El libro seleccionado ya ha sido prestado");
      return;
    }

    setIsSubmittingLoan(true);
    dispatch(
      createLoan({
        book: selectedBook,
        student: selectedStudent,
        status: "Loaned",
        loanDate: loanDate.toLocaleDateString(),
        returnDate: returnDate.toLocaleDateString(),
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Prestamo agregado correctamente");
        closeModal();
      })
      .catch(() => toast.error("Ocurrio un error, intentelo más tarde"))
      .finally(() => setIsSubmittingLoan(false));
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 ${
        openModal
          ? "animate-fade-up"
          : "animate-jump-out animate-once animate-duration-1000"
      }`}
    >
      {openModalStudent ? (
        <form
          onSubmit={handleSubmit(onSubmitStudent)}
          className="my-8 w-full max-w-md rounded-xl bg-white shadow-xl"
        >
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
            <button
              type="button"
              onClick={() => setOpenModalStudent(false)}
              aria-label="Volver"
              className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <IoArrowBack size={20} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Nuevo Estudiante
              </h2>
              <p className="text-xs text-gray-500">
                Todos los campos son requeridos
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-5">
            <FormField
              label="Nombre Completo"
              placeholder="Nombre Completo"
              registration={register("name", {
                required: "El nombre es requerido",
                setValueAs: (value) =>
                  typeof value === "string" ? value.trim() : value,
              })}
              error={errors?.name?.message as string}
            />
            <FormField
              label="Matrícula"
              placeholder="S21016338"
              registration={register("enrollmentNumber", {
                required: "La matrícula es requerida",
                setValueAs: (value) =>
                  typeof value === "string" ? value.trim().toUpperCase() : value,
                pattern: {
                  value: /^S\d{8}$/,
                  message:
                    "La matrícula debe iniciar con 'S' seguido de 8 dígitos (Ej. S21016338)",
                },
                validate: (value: string) =>
                  !students.some(
                    (student) => student.enrollmentNumber.toUpperCase() === value
                  ) || "La matrícula ya ha sido registrada",
              })}
              error={errors?.enrollmentNumber?.message as string}
            />
            <FormField
              label="Correo"
              placeholder="Correo"
              registration={register("email", {
                required: "El correo es requerido",
                setValueAs: (value) =>
                  typeof value === "string" ? value.trim() : value,
                pattern: {
                  value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
                  message: "El correo no es válido",
                },
              })}
              error={errors?.email?.message as string}
            />

            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpenModalStudent(false)}
                className="rounded-md border-2 border-primary p-2 font-medium text-primary transition-colors hover:bg-primary/5 sm:w-1/3"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmittingStudent}
                className="flex items-center justify-center gap-2 rounded-md bg-primary p-2 font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-1/3"
              >
                {isSubmittingStudent && (
                  <AiOutlineLoading3Quarters
                    className="animate-spin"
                    size={18}
                  />
                )}
                Guardar
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="my-8 w-full max-w-3xl rounded-xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Nuevo Préstamo
              </h2>
              <p className="text-sm text-gray-500">
                Selecciona el libro y el estudiante
              </p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              aria-label="Cerrar"
              className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <IoClose size={24} />
            </button>
          </div>

          <form
            onSubmit={onSubmitPrestamo}
            className="flex flex-col gap-6 p-5 lg:flex-row"
          >
            <div className="flex w-full flex-col gap-5 lg:w-1/2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Libro
                </label>
                <Combobox
                  value={selectedBookId}
                  onChange={setSelectedBookId}
                  placeholder="Buscar libro por título o autor"
                  emptyMessage="No hay libros disponibles"
                  options={availableBooks.map((book) => ({
                    id: book.id,
                    label: book.title,
                    description: book.author,
                  }))}
                />
                {availableBooks.length === 0 && (
                  <p className="text-xs text-amber-600">
                    No hay libros disponibles para prestar
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Estudiante
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Combobox
                      value={selectedStudentId}
                      onChange={setSelectedStudentId}
                      placeholder="Buscar estudiante por nombre o matrícula"
                      emptyMessage="No hay estudiantes registrados"
                      options={students.map((student) => ({
                        id: student.id,
                        label: student.name,
                        description: student.enrollmentNumber,
                      }))}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenModalStudent(true)}
                    aria-label="Agregar estudiante"
                    className="shrink-0 rounded-md border border-gray-300 p-2.5 text-primary transition-colors hover:bg-primary/5"
                  >
                    <HiUserAdd size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-5 lg:w-1/2">
              <div className="flex flex-col gap-4 rounded-md bg-gray-50 p-4">
                <div className="flex gap-3">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-primary/10">
                    {selectedBook?.image ? (
                      <Image
                        src={selectedBook.image}
                        alt={selectedBook.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-primary/40">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-gray-800">
                      {selectedBook?.title || "Sin libro seleccionado"}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {selectedBook?.author}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {[selectedBook?.publisher, selectedBook?.publicationYear]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Estudiante
                  </p>
                  <p className="truncate text-sm text-gray-800">
                    {selectedStudent?.name || "Sin estudiante seleccionado"}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {[selectedStudent?.enrollmentNumber, selectedStudent?.email]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-gray-200 pt-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Préstamo
                    </p>
                    <p className="text-sm text-gray-800">
                      {loanDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Devolución
                    </p>
                    <p className="text-sm text-gray-800">
                      {returnDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border-2 border-primary p-2 font-medium text-primary transition-colors hover:bg-primary/5 sm:w-1/3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLoan}
                  className="flex items-center justify-center gap-2 rounded-md bg-primary p-2 font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-1/3"
                >
                  {isSubmittingLoan && (
                    <AiOutlineLoading3Quarters
                      className="animate-spin"
                      size={18}
                    />
                  )}
                  Guardar
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
