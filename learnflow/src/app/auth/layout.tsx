import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="grid min-h-screen place-content-center">
      {children}
    </section>
  );
}
