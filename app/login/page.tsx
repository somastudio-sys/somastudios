import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Sign in to your password-protected Soma dream diary and archive.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <>
      <header className="site-header site-header--page">
        <SiteNav variant="inner" />
      </header>
      <div
        className="login-body"
        style={{ minHeight: "60vh", padding: "2rem 1.5rem 3rem" }}
      >
        <LoginForm />
      </div>
      <SiteFooter />
    </>
  );
}
