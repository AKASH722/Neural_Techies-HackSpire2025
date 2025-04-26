"use client";
import { ChevronRight, Star } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";

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

export function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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
                  <Image
                    height={48}
                    width={48}
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
                    &#34;
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
  );
}
