'use client'
import { BookOpen, Map, BrainCircuit } from 'lucide-react';
import React from 'react';

const features = [
    {
        title: "Content Simplifier",
        description: "Simplify textbooks, lectures, and videos instantly using AI.",
        icon: <BookOpen className="w-12 h-12 text-primary" />
    },
    {
        title: "Learning Path Generator",
        description: "Create a custom step-by-step journey based on your goals.",
        icon: <Map className="w-12 h-12 text-primary" />
    },
    {
        title: "Smart Quiz Builder",
        description: "Dynamic quizzes that adapt to your level and performance.",
        icon: <BrainCircuit className="w-12 h-12 text-primary" />
    }
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-12 bg-white dark:bg-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Learn the skills companies need
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-[#f5f5ff] dark:bg-slate-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                            <div className="px-6 py-8">
                                <div className="flex items-center justify-center h-24">
                                    {React.cloneElement(feature.icon, { className: "w-12 h-12 text-[#6e56cf]" })}
                                </div>
                                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white text-center">{feature.title}</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}