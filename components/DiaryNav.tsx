"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/diaryApi";

const TABS = [
  { href: "/diary", label: "Diary" },
  { href: "/diary/stories", label: "Stories" },
  { href: "/diary/settings", label: "Settings" },
] as const;

type Props = {
  email?: string;
};

export default function DiaryNav({ email }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  function isActive(href: string): boolean {
    if (href === "/diary") return pathname === "/diary";
    return pathname.startsWith(href);
  }

  return (
    <header className="diary-nav-bar">
      <div className="diary-nav-bar-inner">
        <nav className="diary-nav-tabs" aria-label="Diary">
          {TABS.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`diary-nav-tab${active ? " diary-nav-tab--active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="diary-nav-account">
          {email ? (
            <span className="diary-nav-email" title={email}>
              {email}
            </span>
          ) : null}
          <button
            type="button"
            className="diary-nav-logout-btn"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
