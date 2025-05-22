"use server";

import { cookies } from "next/headers"; // Use Next.js' built-in cookies API

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
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    console.log("USER login DATA:", userFormData);
    console.log(
      `URl forms: = ${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.URL_USER_LOGIN}`
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.URL_USER_LOGIN}`,
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

      if (responseJson.error) {
        return {
          success: false,
          message: responseJson.error,
        };
      }

      if (responseJson.errors && typeof responseJson.errors === "object") {
        Object.entries(responseJson.errors).forEach(([field, message]) => {
          if (typeof field === "string" && typeof message === "string") {
            const formattedField: string =
              field.charAt(0).toLowerCase() + field.slice(1);
            fieldErrors[formattedField] = message;
          }
        });
      }
      return {
        success: false,
        message: "Validation error",
        errors: fieldErrors,
      };
    }

    // URL_GET_USER
    const getUserResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${
        process.env.URL_GET_USER
      }/${encodeURIComponent(responseJson.id)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle error in getting user data
    if (!getUserResponse.ok) {
      const errorJson = await getUserResponse.json();
      return {
        success: false,
        message: errorJson.error || "Failed to fetch user data after login.",
      };
    }

    const user = await getUserResponse.json();
    const token = await responseJson.token;

    return {
      success: true,
      apiMessage: "User login successfully",
      user,
      token,
      formData: {
        email: userFormData.email,
        password: userFormData.password,
      },
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}
