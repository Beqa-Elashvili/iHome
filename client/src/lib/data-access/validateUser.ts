"use server";

export default async function validateEmail(email: string) {
  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}/${process.env.URL_USER_EMAIL_CHECK}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("DATA EMAIL SHOULD BE BOOLEAN:", data);
      return data?.data?.userfound;
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return false;
  }
}
