import * as yup from "yup";

const baseUserShape = {
  name: yup.string().required("El nombre es requerido"),
  email: yup
    .string()
    .email("El correo no es válido")
    .required("El correo es requerido"),
};

export const UserValidator = yup.object({
  ...baseUserShape,
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
});

export const UserEditValidator = yup.object({
  ...baseUserShape,
  password: yup
    .string()
    .test(
      "min-length-if-present",
      "La contraseña debe tener al menos 6 caracteres",
      (value) => !value || value.length >= 6
    ),
});
