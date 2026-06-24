import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { isEmailConfigured } from "@/lib/email";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a password reset link for your Soma dream diary.",
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  const emailConfigured = isEmailConfigured();
  const devFallbackEnabled =
    process.env.PASSWORD_RESET_DEV_FALLBACK === "true";

  return (
    <>
      <header className="site-header site-header--page">
        <SiteNav variant="inner" />
      </header>
      <div
        className="login-body"
        style={{ minHeight: "60vh", padding: "2rem 1.5rem 3rem" }}
      >
        <ForgotPasswordForm
          emailConfigured={emailConfigured}
          devFallbackEnabled={devFallbackEnabled}
        />
      </div>
      <SiteFooter />
    </>
  );
}
