import axios from "axios";
import { useAppDispatch } from "@/app/redux"; // Redux hook
import { setIsUser } from "@/redux/globalSlice"; // Redux action to set user

const useGetProtectedData = () => {
  const dispatch = useAppDispatch();

  const getProtectedData = async () => {
    const token = localStorage.getItem("token"); // 🔁 Get token from localStorage
    console.log("Token from localStorage:", token);

    if (!token) {
      console.warn("No token found in localStorage.");
      dispatch(setIsUser(null));
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/protectedRoute`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🛂 Send token in Authorization header
          },
        }
      );

      if (response.data?.user) {
        console.log("User data retrieved:", response.data.user);
        dispatch(setIsUser(response.data.user));
      } else {
        console.warn("No user data returned from protected route.");
        dispatch(setIsUser(null));
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn("Unauthorized or expired token.");
      } else {
        console.error("Error accessing protected route:", error);
      }
      dispatch(setIsUser(null));
    }
  };

  return { getProtectedData };
};

export default useGetProtectedData;
