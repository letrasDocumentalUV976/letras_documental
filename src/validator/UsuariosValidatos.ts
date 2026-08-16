import * as yup from "yup";

export const UserValidator = yup.object({
  name: yup.string().required("El nombre es requerido"),
  email: yup
    .string()
    .email("El correo no es valido")
    .required("El correo es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
});
