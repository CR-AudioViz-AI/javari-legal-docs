"use client";
// app/signup/page.tsx — same reasoning as app/login/page.tsx.
import { useEffect } from "react";

export default function SignupRedirect() {
  useEffect(() => {
    const dest = encodeURIComponent(window.location.origin + "/dashboard");
    window.location.replace(`https://craudiovizai.com/signup?returnTo=${dest}`);
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#f9fafb", fontFamily: "system-ui" }}>
      <p style={{ color: "#6b7280" }}>Taking you to create an account&hellip;</p>
    </div>
  );
}
