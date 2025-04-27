import React from "react";
import Navigation from "@/components/navigation";
import Chatbot from "@/section/chat/chatbot";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Navigation>
      {children}
      <Chatbot />
    </Navigation>
  );
}
