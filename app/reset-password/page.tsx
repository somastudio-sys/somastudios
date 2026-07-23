import type { Metadata } from "next";
import { Suspense } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your Soma dream diary.",
  robots: { index: false, follow: true },
};

export default function ResetPasswordPage() {
  return (
    <>
      <header className="site-header site-header--page">
        <SiteNav />
      </header>
      <div
        className="login-body"
        style={{ minHeight: "60vh", padding: "2rem 1.5rem 3rem" }}
      >
        <Suspense
          fallback={
            <div className="login-main">
              <div className="login-card">
                <p className="login-note">Loading…</p>
              </div>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
      <SiteFooter />
    </>
  );
}
