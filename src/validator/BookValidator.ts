import * as yup from "yup";

export const BookValidator = yup.object().shape({
  image: yup.string().required("Debes subir una imagen"),
  title: yup.string().required("Debes ingresar un título"),
  author: yup.string().required("Debes ingresar un autor"),
  publisher: yup.string().required("Debes ingresar una editorial"),
  pageCount: yup.string().required("Debes ingresar un número de páginas"),
  publicationYear: yup
    .string()
    .required("Debes ingresar un año de publicación"),
  location: yup.object().shape({
    column: yup.number().optional(),
    row: yup.number().optional(),
    shelf: yup.string().oneOf(["1", "2"]).required(),
  }),
  type: yup.string().required("Debes ingresar un tipo de libro"),
  description: yup.string().required("Debes ingresar una descripción"),
  quantity: yup.number().required("Debes ingresar una cantidad"),
});
