import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Soma dream diary account and cloud archive.",
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  return (
    <>
      <header className="site-header site-header--page">
        <SiteNav />
      </header>
      <div
        className="login-body"
        style={{ minHeight: "60vh", padding: "2rem 1.5rem 3rem" }}
      >
        <SignupForm />
      </div>
      <SiteFooter />
    </>
  );
}
