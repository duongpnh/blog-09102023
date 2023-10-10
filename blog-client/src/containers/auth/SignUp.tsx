import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "./validation-schema/sign-up.schema";

type InputSignUp = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const inputClass =
  "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputSignUp>({
    resolver: yupResolver(signUpSchema),
  });
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from: Location };
  const from = state ? state.from.pathname : "/";

  const signUpMutation = useMutation({
    mutationFn: (data: InputSignUp) => {
      const { passwordConfirm: _, ...restData } = data;
      return axios
        .post("http://localhost:3000/api/auth/sign-up", restData)
        .then((res) => {
          console.log("🚀 ~ file: SignUp.tsx:25 ~ mutationFn: ~ res:", res);
          return res;
        });
    },
    onSuccess: (res: any, vars: any, context: any) => {
      console.log("🚀 ~ file: SignUp.tsx:26 ~ SignUp ~ vars:", vars);
      console.log("🚀 ~ file: SignUp.tsx:26 ~ SignUp ~ context:", context);

      navigate(from, { replace: true });
    },
    onError: (error) => {
      console.log(
        "🚀 ~ file: SignUp.tsx:23 ~ SignUp ~ error:",
        error.response.data,
      );
    },
  });

  const onSubmit: SubmitHandler<InputSignUp> = async (data: InputSignUp) => {
    signUpMutation.mutate(data);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 h-full">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign up your account
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
              action="#"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register("firstName", { required: true })}
                    id="firstName"
                    placeholder="First Name"
                    className={
                      inputClass +
                      (errors.firstName?.message
                        ? " dark:border-red-500"
                        : " dark:border-gray-600")
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
                  >
                    Last Name
                  </label>
                  <input
                    type="lastName"
                    {...register("lastName", { required: true })}
                    id="lastName"
                    placeholder="Last Name"
                    className={
                      inputClass +
                      (errors.lastName?.message
                        ? " dark:border-red-500"
                        : " dark:border-gray-600")
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
                >
                  Your email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email Address is required",
                  })}
                  id="email"
                  className={
                    inputClass +
                    (errors.email?.message
                      ? " dark:border-red-500"
                      : " dark:border-gray-600")
                  }
                  placeholder="Email"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("password", { required: true })}
                    id="password"
                    placeholder="••••••••"
                    className={
                      inputClass +
                      (errors.password?.message
                        ? " dark:border-red-500"
                        : " dark:border-gray-600")
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="passwordConfirm"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
                  >
                    Password Confirm
                  </label>
                  <input
                    type="password"
                    {...register("passwordConfirm")}
                    id="passwordConfirm"
                    placeholder="••••••••"
                    className={
                      inputClass +
                      (errors.passwordConfirm?.message
                        ? " dark:border-red-500"
                        : " dark:border-gray-600")
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                {/* <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                            </div>
                        </div> */}
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 btn-primary"
              >
                {signUpMutation.isLoading ? (
                  <span className="loading loading-dots loading-xs"></span>
                ) : (
                  "Sign Up"
                )}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                You have an account{" "}
                <Link
                  to="/"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
