import * as yup from "yup";

export const signUpSchema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref("password")], "Password must match")
      .required(),
  })
  .required();
