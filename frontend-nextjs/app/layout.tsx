import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Shuttle Frontend",
  description: "Shared frontend for campus shuttle backend comparisons.",
};

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Login" },
  { href: "/buses", label: "Buses" },
  { href: "/routes", label: "Routes" },
  { href: "/stops", label: "Stops" },
  { href: "/eta", label: "ETA" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="background-orb orb-one" />
        <div className="background-orb orb-two" />
        <div className="app-shell">
          <header className="topbar">
            <Link href="/" className="brand">
              Campus Shuttle
            </Link>
            <nav className="nav">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
