"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <div id="home" className="relative overflow-hidden pt-16">
      <div className="mx-auto">
        <div className="relative z-10 bg-transparent pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-3xl lg:pb-28 xl:pb-32">
          <main className="mx-auto mt-10 px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <div className="mb-6 flex sm:justify-center lg:justify-start">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#e4dfff]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#6e56cf] text-xl font-bold text-white">
                    LF
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Master Any Topic.</span>
                <span className="block text-[#6e56cf] dark:text-[#e4dfff]">
                  Your Personalized AI Learning Journey Awaits.
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                Simplify complex topics, build your learning path, and sharpen
                your skills — all with the power of AI.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    href="/auth/login"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#6e56cf] px-8 py-3 text-base font-medium text-white hover:bg-[#5a46af] md:px-10 md:py-4 md:text-lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
                <div className="mt-3 sm:ml-3 sm:mt-0">
                  <a
                    href="#how-it-works"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#e4dfff] px-8 py-3 text-base font-medium text-[#6e56cf] hover:bg-[#d3cbfa] md:px-10 md:py-4 md:text-lg"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="relative aspect-square lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <Image
          className="mt-32 aspect-square"
          src="/landing-hero.png"
          alt="Learning dashboard visualization"
          fill
        />
      </div>
    </div>
  );
}
