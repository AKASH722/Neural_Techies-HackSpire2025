"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Logout from "@/section/auth/logout";
import { BookOpen, FileText, LayoutDashboard, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Navigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeItem = pathname.split("/")[1] || "dashboard";

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    {
      id: "simplifier",
      label: "Content Simplifier",
      icon: <FileText size={20} />,
      path: "/simplifier",
    },
    {
      id: "learning-path",
      label: "Learning Path",
      icon: <Route size={20} />,
      path: "/learning-path",
    },
    {
      id: "quiz",
      label: "Quiz Builder",
      icon: <BookOpen size={20} />,
      path: "/quiz",
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Desktop Sidebar */}
      <aside className="md:border-sidebar-border md:bg-sidebar md:text-sidebar-foreground hidden md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col md:border-r md:shadow-sm">
        <div className="border-sidebar-border flex h-16 items-center border-b px-4 font-sans">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary font-bold text-primary-foreground">
            LF
          </div>
          <span className="ml-2 text-lg font-bold">LearnFlow</span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeItem === item.id ? "secondary" : "ghost"}
              className={`relative h-auto w-full justify-start px-4 py-3 ${activeItem === item.id ? "font-medium" : ""}`}
              asChild
            >
              <Link href={item.path} passHref>
                {activeItem === item.id && (
                  <span className="bg-sidebar-primary absolute bottom-0 left-0 top-0 w-1 rounded-r"></span>
                )}
                <span
                  className={
                    activeItem === item.id ? "text-sidebar-primary" : ""
                  }
                >
                  {item.icon}
                </span>
                <span className="ml-3">{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>

        <Separator className="my-2" />

        <div className="px-3 py-2">
          <Logout
            variant="ghost"
            className={`relative h-auto w-full justify-start px-4 py-3`}
          />
        </div>
      </aside>

      {/* Mobile/Tablet Top Navbar */}
      <div className="bg-sidebar border-sidebar-border fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b px-4 shadow-sm md:hidden">
        <div className="flex items-center font-sans">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary font-bold text-primary-foreground">
            LF
          </div>
          <span className="ml-2 text-lg font-bold">LearnFlow</span>
        </div>

        <div>
          <Logout variant="ghost" size="icon" className="gap-3 rounded-full" />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="bg-sidebar border-sidebar-border fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg md:hidden">
        <nav className="flex items-center justify-around gap-3">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="secondary"
              className={`m-4 flex aspect-square flex-1 flex-col items-center justify-center rounded-full ${
                activeItem !== item.id
                  ? "bg-sidebar-accent/30 text-sidebar-primary"
                  : "hover:bg-sidebar-accent/20 hover:text-sidebar-primary"
              }`}
              asChild
            >
              <Link href={item.path} passHref>
                {item.icon}
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content Container */}
      <main className="mt-14 flex-1 p-4 md:ml-64 md:mt-0">{children}</main>
    </div>
  );
}
