"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSession } from "@/lib/diaryApi";

export default function DiaryGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSession()
      .then(({ authenticated }) => {
        if (cancelled) return;
        if (authenticated) {
          setAllowed(true);
        } else {
          router.replace("/login");
        }
      })
      .catch(() => {
        if (!cancelled) router.replace("/login");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!allowed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Redirecting to login…</p>
      </div>
    );
  }

  return (
    <div className="diary-theme">
      <div className="stars" aria-hidden="true" />
      <div className="twinkling" aria-hidden="true" />
      {children}
    </div>
  );
}
