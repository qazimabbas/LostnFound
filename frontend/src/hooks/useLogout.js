import { useSetRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);

  const logout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      // Remove user data from localStorage
      localStorage.removeItem("user");

      // Clear user data from Recoil state
      setUser(null);

      showSuccessToast("Logged out successfully");
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  return logout;
};

export default useLogout;
