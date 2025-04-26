'use client'
import { ArrowRight, Check } from 'lucide-react';
import React from 'react';

export function CTASection() {
    return (
        <>
            <section className="py-16 bg-[#6e56cf]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-white">
                            Your journey to smarter learning starts here
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-[#f5f5ff] mx-auto">
                            Ready to dive in and transform the way you learn?
                        </p>
                        <div className="mt-8">
                            <a href="#" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#6e56cf] bg-white hover:bg-[#f5f5ff] md:py-4 md:text-lg md:px-10">
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </a>
                        </div>
                        <div className="mt-8 max-w-lg mx-auto flex justify-center">
                            <div className="flex items-center mr-6">
                                <Check className="flex-shrink-0 h-5 w-5 text-[#e4dfff]" />
                                <p className="ml-2 text-white">Free to start</p>
                            </div>
                            <div className="flex items-center mr-6">
                                <Check className="flex-shrink-0 h-5 w-5 text-[#e4dfff]" />
                                <p className="ml-2 text-white">No credit card required</p>
                            </div>
                            <div className="flex items-center">
                                <Check className="flex-shrink-0 h-5 w-5 text-[#e4dfff]" />
                                <p className="ml-2 text-white">Cancel anytime</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-800 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-[#6e56cf] rounded-md flex items-center justify-center text-white font-bold text-xl">LF</div>
                                <span className="ml-2 text-xl font-bold text-white">LearnFlow</span>
                            </div>
                            <p className="mt-2 text-gray-400">
                                AI-powered learning for the modern student
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
                            <ul className="mt-4 space-y-4">
                                <li><a href="#" className="text-base text-gray-300 hover:text-[#e4dfff]">Features</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-[#e4dfff]">Pricing</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-[#e4dfff]">Tutorials</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                            <ul className="mt-4 space-y-4">
                                <li><a href="#" className="text-base text-gray-300 hover:text-[#e4dfff]">Help Center</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-[#e4dfff]">Community</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-[#e4dfff]">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                            <ul className="mt-4 space-y-4">
                                <li><a href="#" className="text-base text-gray-300 hover:text-[#e4dfff]">About</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-[#e4dfff]">Blog</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-[#e4dfff]">Careers</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
                        <div className="flex space-x-6 md:order-2">
                            {/* Social icons would go here */}
                        </div>
                        <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
                            &copy; 2025 LearnFlow. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}