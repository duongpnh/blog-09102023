import * as yup from "yup";

export const signInSchema = yup
  .object({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();
