import * as yup from "yup";

export const MovieValidator = yup.object({
  title: yup.string().required("El titulo es requerido"),
  director: yup.string().required("El director es requerido"),
  publicationYear: yup
    .string()
    .required("El año de publicacion es requerido"),
  type: yup
    .string()
    .oneOf(["original", "copy", "bluray"])
    .required("El tipo es requerido"),
  duration: yup.string().required("La duracion es requerida"),
  genre: yup.string().required("El genero es requerido"),
  country: yup.string().required("El pais es requerido"),
  language: yup.string().required("El idioma es requerido"),
  subtitles: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Los subtitulos son requeridos"),
  image: yup.string(),
});
