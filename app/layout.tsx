"use client";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const navItem = (href: string, label: string) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`px-4 py-2 rounded-lg transition ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <html lang="en">
      <body>
        {isLoginPage ? (
          children
        ) : (
          <div className="flex h-screen bg-gray-950">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
              {/* Logo / Title */}
              <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold text-white tracking-wide">
                  RustDesk
                </h1>
                <p className="text-sm text-gray-400">Management</p>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-2 p-4">
                {navItem("/dashboard", "Dashboard")}
                {navItem("/address-book", "Address Books")}
                {navItem("/sessions", "Sessions")}
              </nav>

              {/* Bottom (Logout) */}
              <div className="mt-auto p-4 border-t border-gray-800">
                <Link
                  href="/login"
                  className="block text-center bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                >
                  Logout
                </Link>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-linear-to-br from-gray-950 via-gray-900 to-black text-gray-100 p-8">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
