"use server";

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
    console.log("USER login DATA:", userFormData);
    console.log(
      `URl forms: = ${process.env.BASE_API_URL}${process.env.URL_USER_LOGIN}`
    );
    const response = await fetch(
      `${process.env.BASE_API_URL}${process.env.URL_USER_LOGIN}`,
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

      // If the response contains a known error message
      if (responseJson.error) {
        return {
          success: false,
          message: responseJson.error,
        };
      }

      // Fallback if validation-style errors are provided
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
      `${process.env.BASE_API_URL}${
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

    // Parse the user data from the response
    let user;
    try {
      user = await getUserResponse.json();
    } catch (error) {
      return {
        success: false,
        message: "Error parsing user data from the response.",
      };
    }
    return {
      success: true,
      apiMessage: "User login successfully",
      user,
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
