import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../hooks/useAuth";
import { signInSchema } from "./validation-schema/sign-in.schema";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type TInputSignIn = {
  email: string;
  password: string;
};

const inputClass =
  "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

export const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TInputSignIn>({
    resolver: yupResolver(signInSchema),
  });
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const state = location.state as { from: Location };
  const from = state ? state.from.pathname : "/chat";

  const signInMutation = useMutation({
    mutationFn: (data: TInputSignIn) => {
      return axios
        .post("http://localhost:3000/api/auth/sign-in", data)
        .then((res) => {
          console.log("🚀 ~ file: SignIn.tsx:25 ~ mutationFn: ~ res:", res);
          return res;
        });
    },
    onSuccess: (res: any, vars: any, context: any) => {
      console.log("🚀 ~ file: SignIn.tsx:26 ~ SignIn ~ vars:", vars);
      console.log("🚀 ~ file: SignIn.tsx:26 ~ SignIn ~ context:", context);
      if (res.data?.success) {
        const { username, token } = res.data;
        auth.signIn(JSON.stringify({ username, token }), () => {
          navigate(from, { replace: true });
        });
      }
    },
    onError: (error) => {
      console.log(
        "🚀 ~ file: SignIn.tsx:23 ~ SignIn ~ error:",
        error.response.data,
      );
    },
  });

  const onSubmit: SubmitHandler<TInputSignIn> = async (
    payload: TInputSignIn,
  ) => {
    console.log(
      "🚀 ~ file: SignIn.tsx:15 ~ constonSubmit:SubmitHandler<InputSignIn>= ~ data:",
      payload,
    );
    // signInMutation.mutate(payload);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 h-full">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
              action="#"
            >
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
                >
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  id="email"
                  placeholder="example@email.com"
                  className={
                    inputClass +
                    (errors.email?.message
                      ? " dark:border-red-500"
                      : " dark:border-gray-600")
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
                >
                  Password
                </label>
                <input
                  type="password"
                  {...register("password")}
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
              <div className="flex items-center justify-between">
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
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  to="/sign-up"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
