"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsRegisterForm, setIsAuthModalOpen } from "@/redux/globalSlice";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import registerAction from "@/lib/actions/registerAction";
import { log } from "console";
import loginAction from "@/lib/actions/loginAction";

type FormValues = {
  name?: string;
  email: string;
  password: string;
  repeatPassword?: string;
  phoneNumber?: string;
};

function Register() {
  const [showPassword, setShowPassword] = useState({
    password: false,
    repeatPassword: false,
  });

  const dispatch = useAppDispatch();
  const isRegisterForm = useAppSelector((state) => state.global.isRegisterForm);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>();
  console.log("REGISTER FORM ERRORS:", errors);

  const router = useRouter();
  const [state, action, isPending] = useActionState(registerAction, undefined);
  const [logInState, logAction, isLoginPending] = useActionState(
    loginAction,
    undefined
  );

  console.log("REGISTER FORM STATE:", logInState?.message);

  const togglePasswordVisibility = (field: "password" | "repeatPassword") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const toggleIsRegisterForm = (value: string) => {
    dispatch(setIsRegisterForm(value !== "LOGIN"));
  };
  useEffect(() => {
    if (state?.success) {
      dispatch(setIsRegisterForm(false));
    }
  }, [state]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative bg-white py-2 px-4 mx-4 z-30 w-full m-auto shadow-custom-light rounded-lg flex flex-col items-center justify-center h-full">
        <div
          onClick={() => dispatch(setIsAuthModalOpen(false))}
          className="bg-white cursor-pointer z-50 w-8 h-8 rounded-full flex items-center justify-center absolute -top-9 -right-2"
        >
          <X />
        </div>

        <h1 className="text-3xl font-bold mb-8">
          {isRegisterForm ? "შექმენი ანგარიში" : "გაიარე ავტორიზაცია"}
        </h1>

        <div className="font-bold text-md md:text-xl flex items-center justify-between gap-8">
          <div
            onClick={() => toggleIsRegisterForm("LOGIN")}
            className={`${
              !isRegisterForm ? "text-black" : "text-gray-500"
            } w-5/6 text-center cursor-pointer`}
          >
            <h1>ავტორიზაცია</h1>
            <hr className="mt-2" />
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div
            onClick={() => toggleIsRegisterForm("")}
            className={`${
              isRegisterForm ? "text-black" : "text-gray-500"
            } w-5/6 text-center cursor-pointer`}
          >
            <h1>რეგისტრაცია</h1>
            <hr className="mt-2" />
          </div>
        </div>
        {isRegisterForm ? (
          <form action={action} className="w-full mt-4 space-y-4">
            <div>
              <input
                {...register("name", {
                  required: "შეიყვანეთ სახელი, გვარი!",
                })}
                className="w-full py-2 px-3 border rounded-md"
                placeholder="სახელი, გვარი"
              />
              {state?.errors?.name && (
                <p className="text-red-500 text-sm py-px">
                  {state?.errors.name}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("phoneNumber", {
                  required: "შეიყვანეთ მობილურის ნომერი!",
                })}
                className="w-full py-2 px-3 border rounded-md"
                placeholder="მობილურის ნომერი"
                maxLength={9}
              />
              {state?.errors?.phoneNumber && (
                <p className="text-red-500 text-sm py-px">
                  {state?.errors.phoneNumber}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("email", { required: "შეიყვანეთ ელ.ფოსტა!" })}
                className="w-full py-2 px-3 border rounded-md"
                placeholder="მეილი"
                type="email"
              />
              {state?.errors?.email && (
                <p className="text-red-500 text-sm py-px">
                  {state?.errors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                {...register("password", { required: "შეიყვანეთ პაროლი!" })}
                className="w-full py-2 px-3 border rounded-md"
                placeholder="პაროლი"
                type={showPassword.password ? "text" : "password"}
              />
              <span
                onClick={() => togglePasswordVisibility("password")}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword.password ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </span>
              {state?.errors?.password && (
                <p className="text-red-500 text-sm py-px">
                  {state?.errors.password}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                {...register("repeatPassword", {
                  required: "გაიმეორეთ პაროლი!",
                })}
                className="w-full py-2 px-3 border rounded-md"
                placeholder="გაიმეორე პაროლი"
                type={showPassword.repeatPassword ? "text" : "password"}
              />
              <span
                onClick={() => togglePasswordVisibility("repeatPassword")}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword.repeatPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </span>
              {errors.repeatPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.repeatPassword.message}
                </p>
              )}
            </div>

            {state?.message && (
              <p className="text-red-500 text-sm py-px">{state?.message}</p>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="bg-black text-white font-semibold w-full rounded-md py-3 hover:bg-gray-800 transition"
            >
              {isRegisterForm ? "რეგისტრაცია" : "შესვლა"}
            </button>
          </form>
        ) : (
          <form action={logAction} className="w-full mt-4 space-y-4">
            <div>
              <input
                {...register("email", { required: "შეიყვანეთ ელ.ფოსტა!" })}
                className="w-full py-2 px-3 border rounded-md"
                placeholder="მეილი"
                type="email"
              />
              {logInState?.errors?.email && (
                <p className="text-red-500 text-sm py-px">
                  {logInState?.errors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                {...register("password", { required: "შეიყვანეთ პაროლი!" })}
                className="w-full py-2 px-3 border rounded-md"
                placeholder="პაროლი"
                type={showPassword.password ? "text" : "password"}
              />
              <span
                onClick={() => togglePasswordVisibility("password")}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword.password ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </span>
              {logInState?.errors?.password && (
                <p className="text-red-500 text-sm py-px">
                  {logInState?.errors.password}
                </p>
              )}
            </div>

            {logInState?.message && (
              <p className="text-red-500 text-sm py-px">
                {logInState?.message}
              </p>
            )}
            <button
              type="submit"
              disabled={isLoginPending}
              className="bg-black text-white font-semibold w-full rounded-md py-3 hover:bg-gray-800 transition"
            >
              {isRegisterForm ? "რეგისტრაცია" : "შესვლა"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
