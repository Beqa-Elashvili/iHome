"use server";
import { error } from "console";
import validateEmail from "../data-access/validateUser";

/**
 * 1. get data from form
 * 2. validate data with zod
 * 3. check if user already exists
 * 4. collect data for registration
 * 5. create user
 */

export default async function registerAction(
  _prevState: unknown,
  formData: FormData
) {
  console.log("FORM DATA:", formData);
  // 1. get data from form
  const userFormData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phoneNumber: formData.get("phoneNumber") as string,
  };

  // 2. validate data with zod

  // // 3. check if user already exists
  // const userValidationResult = await validateEmail(userFormData.email);

  // console.log("USER VALIDATION RESULT:", userValidationResult);
  // if (userValidationResult === true) {
  //   return {
  //     success: false,
  //     message: { email: `user with ${userFormData.email} exist!` },
  //     formData: {
  //       email: userFormData.email,
  //       name: userFormData.name,
  //       phoneNumber: userFormData.phoneNumber,
  //     },
  //   };
  // }

  try {
    console.log("USER REGISTRATION DATA:", userFormData);
    console.log(
      `URl forms: = ${process.env.BASE_API_URL}${process.env.URL_USER_REGISTER}`
    );
    const response = await fetch(
      `${process.env.BASE_API_URL}${process.env.URL_USER_REGISTER}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userFormData),
      }
    );

    const responseJson = await response.json();
    console.log("RESPONSE BODY:", responseJson);

    if (!response.ok) {
      const fieldErrors: { [key: string]: string } = {};

      if (responseJson.error && responseJson.error.includes("already exists")) {
        return {
          success: false,
          message: responseJson.error,
        };
      }

      const errors: { [key: string]: string } = responseJson.errors;
      Object.entries(errors).forEach(([field, message]) => {
        const formattedField = field.charAt(0).toLowerCase() + field.slice(1);
        fieldErrors[formattedField] = message;
      });

      return {
        success: false,
        message: responseJson.error || "User registration error",
        errors: fieldErrors,
      };
    }

    return {
      success: true,
      apiMessage: "User registered successfully",
      formData: {
        email: userFormData.email,
        password: userFormData.password,
        name: userFormData.name,
        phoneNumber: userFormData.phoneNumber,
      },
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}
