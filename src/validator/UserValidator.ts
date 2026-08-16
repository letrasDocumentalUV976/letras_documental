import * as yup from "yup";

const baseUserShape = {
  name: yup.string().required("El nombre es requerido"),
  email: yup
    .string()
    .email("El correo no es válido")
    .required("El correo es requerido"),
};

export const UserInviteValidator = yup.object({
  ...baseUserShape,
  password: yup.string().notRequired(),
});

export const UserEditValidator = yup.object({
  name: yup.string().required("El nombre es requerido"),
});

export const SetPasswordValidator = yup.object({
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
});
