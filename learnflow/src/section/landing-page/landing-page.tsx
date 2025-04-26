"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  Map,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      quote:
        "LearnFlow made coding finally make sense to me! The personalized path kept me motivated.",
      avatar: "/api/placeholder/48/48",
    },
    {
      name: "Alex Johnson",
      role: "Marketing Professional",
      quote:
        "I was able to master SEO concepts in half the time thanks to the smart quiz feature.",
      avatar: "/api/placeholder/48/48",
    },
    {
      name: "Marco Chen",
      role: "Data Science Student",
      quote:
        "The way LearnFlow simplifies complex machine learning concepts is incredible!",
      avatar: "/api/placeholder/48/48",
    },
  ];

  const features = [
    {
      title: "Content Simplifier",
      description:
        "Simplify textbooks, lectures, and videos instantly using AI.",
      icon: <BookOpen className="h-12 w-12 text-primary" />,
    },
    {
      title: "Learning Path Generator",
      description: "Create a custom step-by-step journey based on your goals.",
      icon: <Map className="h-12 w-12 text-primary" />,
    },
    {
      title: "Smart Quiz Builder",
      description: "Dynamic quizzes that adapt to your level and performance.",
      icon: <BrainCircuit className="h-12 w-12 text-primary" />,
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Set your topic and goals",
      description: "Tell us what you want to learn and what your end goal is.",
    },
    {
      number: "2",
      title: "Get a customized path + smart quizzes",
      description: "We'll create a learning journey tailored just for you.",
    },
    {
      number: "3",
      title: "Learn, adapt, and master",
      description: "Work through content that adapts to your pace and style.",
    },
    {
      number: "4",
      title: "Track your progress visually",
      description: "See how far you've come with intuitive progress tracking.",
    },
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5ff] to-[#e4dfff] dark:from-slate-900 dark:to-[#6e56cf]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <div className="flex flex-shrink-0 items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#6e56cf] text-xl font-bold text-white">
                  LF
                </div>
                <span className="ml-2 text-xl font-bold text-[#6e56cf] dark:text-[#e4dfff]">
                  LearnFlow
                </span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a
                  href="#home"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-[#6e56cf] hover:text-[#6e56cf]"
                >
                  Home
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-[#6e56cf] hover:text-[#6e56cf]"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-[#6e56cf] hover:text-[#6e56cf]"
                >
                  How It Works
                </a>
                <a
                  href="#testimonials"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-[#6e56cf] hover:text-[#6e56cf]"
                >
                  Testimonials
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/auth/login"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#6e56cf]"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-[#6e56cf] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#5a46af] focus:outline-none"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home" className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 bg-transparent pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-3xl lg:pb-28 xl:pb-32">
            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
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
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="mt-32"
            src="/image.png"
            alt="Learning dashboard visualization"
          />
        </div>
      </div>

      {/* Feature Highlights Section */}
      <section id="features" className="bg-white py-12 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Learn the skills companies need
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="transform overflow-hidden rounded-lg bg-[#f5f5ff] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-700"
              >
                <div className="px-6 py-8">
                  <div className="flex h-24 items-center justify-center">
                    {React.cloneElement(feature.icon, {
                      className: "w-12 h-12 text-[#6e56cf]",
                    })}
                  </div>
                  <h3 className="mt-4 text-center text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="bg-[#f5f5ff] py-16 dark:bg-slate-900"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              How LearnFlow Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300">
              Your personalized learning journey in four simple steps
            </p>
          </div>
          <div className="relative">
            {/* Timeline connector */}
            <div className="absolute left-1/2 hidden h-full w-1 -translate-x-1/2 transform bg-[#e4dfff] md:block"></div>

            {/* Steps */}
            <div className="relative space-y-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`md:flex ${index % 2 === 0 ? "" : "md:flex-row-reverse"} items-center`}
                >
                  <div className="flex-1 p-6 md:text-right">
                    <div
                      className={`${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                    >
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#6e56cf] text-white">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className="mx-auto flex items-center justify-center md:mx-0">
                    <div className="z-10 h-12 w-12 rounded-full border-4 border-[#6e56cf] bg-white"></div>
                  </div>
                  <div className="flex-1 p-6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Student Feedback/Testimonial Section */}
      <section id="testimonials" className="bg-white py-16 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              What Our Learners Say
            </h2>
          </div>
          <div className="relative mx-auto max-w-3xl">
            <div className="overflow-hidden">
              <div className="transform transition-all duration-300">
                <div className="rounded-lg bg-[#f5f5ff] p-8 shadow-lg dark:bg-slate-700">
                  <div className="mb-6 flex items-center">
                    <img
                      className="mr-4 h-12 w-12 rounded-full"
                      src={testimonials[activeTestimonial].avatar}
                      alt={testimonials[activeTestimonial].name}
                    />
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        {testimonials[activeTestimonial].name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {testimonials[activeTestimonial].role}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-0 top-0 -translate-x-4 -translate-y-8 transform font-serif text-6xl text-[#6e56cf]">
                      "
                    </span>
                    <p className="relative z-10 text-lg text-gray-600 dark:text-gray-300">
                      {testimonials[activeTestimonial].quote}
                    </p>
                    <div className="mt-8 flex justify-between">
                      <div className="flex">
                        {[0, 1, 2].map((i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i <= activeTestimonial ? "text-[#6e56cf]" : "text-gray-300"} cursor-pointer`}
                            onClick={() => setActiveTestimonial(i)}
                          />
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={prevTestimonial}
                          className="rounded-full bg-[#e4dfff] p-2 hover:bg-[#d3cbfa] dark:bg-slate-600 dark:hover:bg-slate-500"
                        >
                          <ChevronRight className="h-5 w-5 rotate-180 transform" />
                        </button>
                        <button
                          onClick={nextTestimonial}
                          className="rounded-full bg-[#e4dfff] p-2 hover:bg-[#d3cbfa] dark:bg-slate-600 dark:hover:bg-slate-500"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-[#6e56cf] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Your journey to smarter learning starts here
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-[#f5f5ff]">
              Ready to dive in and transform the way you learn?
            </p>
            <div className="mt-8">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-[#6e56cf] hover:bg-[#f5f5ff] md:px-10 md:py-4 md:text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
            <div className="mx-auto mt-8 flex max-w-lg justify-center">
              <div className="mr-6 flex items-center">
                <Check className="h-5 w-5 flex-shrink-0 text-[#e4dfff]" />
                <p className="ml-2 text-white">Free to start</p>
              </div>
              <div className="mr-6 flex items-center">
                <Check className="h-5 w-5 flex-shrink-0 text-[#e4dfff]" />
                <p className="ml-2 text-white">No credit card required</p>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 flex-shrink-0 text-[#e4dfff]" />
                <p className="ml-2 text-white">Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#6e56cf] text-xl font-bold text-white">
                  LF
                </div>
                <span className="ml-2 text-xl font-bold text-white">
                  LearnFlow
                </span>
              </div>
              <p className="mt-2 text-gray-400">
                AI-powered learning for the modern student
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Product
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-[#e4dfff]"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-[#e4dfff]"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-[#e4dfff]"
                  >
                    Tutorials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-[#e4dfff]"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-[#e4dfff]"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-[#e4dfff]"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-[#e4dfff]"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-[#e4dfff]"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-[#e4dfff]"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              {/* Social icons would go here */}
            </div>
            <p className="mt-8 text-base text-gray-400 md:order-1 md:mt-0">
              &copy; 2025 LearnFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
