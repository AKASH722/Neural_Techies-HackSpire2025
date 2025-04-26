'use client'
import React from 'react';

const steps = [
    {
        number: "1",
        title: "Set your topic and goals",
        description: "Tell us what you want to learn and what your end goal is."
    },
    {
        number: "2",
        title: "Get a customized path + smart quizzes",
        description: "We'll create a learning journey tailored just for you."
    },
    {
        number: "3",
        title: "Learn, adapt, and master",
        description: "Work through content that adapts to your pace and style."
    },
    {
        number: "4",
        title: "Track your progress visually",
        description: "See how far you've come with intuitive progress tracking."
    }
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-16 bg-[#f5f5ff] dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        How LearnFlow Works
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
                        Your personalized learning journey in four simple steps
                    </p>
                </div>
                <div className="relative">
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-[#e4dfff] h-full"></div>

                    <div className="space-y-12 relative">
                        {steps.map((step, index) => (
                            <div key={index} className={`md:flex ${index % 2 === 0 ? '' : 'md:flex-row-reverse'} items-center`}>
                                <div className="flex-1 md:text-right p-6">
                                    <div className={`${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#6e56cf] text-white mb-4">
                                            {step.number}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                                        <p className="mt-2 text-gray-600 dark:text-gray-300">{step.description}</p>
                                    </div>
                                </div>
                                <div className="mx-auto md:mx-0 flex items-center justify-center">
                                    <div className="h-12 w-12 rounded-full border-4 border-[#6e56cf] bg-white z-10"></div>
                                </div>
                                <div className="flex-1 p-6"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}