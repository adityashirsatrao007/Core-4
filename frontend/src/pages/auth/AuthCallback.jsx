import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/common/Loader";

/**
 * AuthCallback — handles the Google OAuth redirect.
 *
 * Backend redirects to: /auth/callback?token=<jwt>
 * This page:
 *  1. Reads the ?token= param
 *  2. Stores it + fetches /auth/me via loginWithToken()
 *  3. Redirects to /dashboard
 *
 * On error or missing token: redirects to /login?error=...
 */
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error || !token) {
      navigate(`/login?error=${error || "no_token"}`, { replace: true });
      return;
    }

    loginWithToken(token)
      .then(() => navigate("/dashboard", { replace: true }))
      .catch(() => navigate("/login?error=auth_failed", { replace: true }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <Loader fullPage />;
}
