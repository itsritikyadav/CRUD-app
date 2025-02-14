"use client";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className="bg-gray-100">
        <QueryClientProvider client={queryClient}>
          {/* Navbar */}
          <nav className="navbar bg-primary text-white">
            <div className="container mx-auto">
              <a className="btn btn-ghost normal-case text-xl">CRUD App</a>
            </div>
          </nav>

          {/* Main Content */}
          <main className="container mx-auto p-4">{children}</main>

          {/* Footer */}
          <footer className="footer p-4 bg-gray-800 text-white flex justify-center items-center">
            © 2025 CRUD App. All rights reserved.
          </footer>

        </QueryClientProvider>
      </body>
    </html>
  );
}
