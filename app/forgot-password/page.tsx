import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a password reset link for your Soma dream diary.",
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <>
      <header className="site-header site-header--page">
        <SiteNav variant="inner" />
      </header>
      <div
        className="login-body"
        style={{ minHeight: "60vh", padding: "2rem 1.5rem 3rem" }}
      >
        <ForgotPasswordForm />
      </div>
      <SiteFooter />
    </>
  );
}
