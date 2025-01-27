import { useSetRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);

  const logout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error during logout");
      }

      // Clear user from state
      setUser(null);
      showSuccessToast("Logged out successfully");
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  return logout;
};

export default useLogout;
