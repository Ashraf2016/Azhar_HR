import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsLoggedIn } from "@/contexts/isLoggedinContext";

// Hook: call at top of a page component to ensure user is logged in.
export default function useRequireAuth() {
  const { isLoggedIn } = useIsLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to login page when not authenticated
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);
}
