"use client";
// app/login/page.tsx
// LegalEase never had a real login page at all - the local auth API routes
// were unreachable dead code, and nothing else provided a way in. One
// identity across the platform, per Roy: this sends people to the real login
// and back, the same pattern used for javari-partners.
import { useEffect } from "react";

export default function LoginRedirect() {
  useEffect(() => {
    const dest = encodeURIComponent(window.location.origin + "/dashboard");
    window.location.replace(`https://craudiovizai.com/login?redirect=${dest}`);
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#f9fafb", fontFamily: "system-ui" }}>
      <p style={{ color: "#6b7280" }}>Taking you to sign in&hellip;</p>
    </div>
  );
}
