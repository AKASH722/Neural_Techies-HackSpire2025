'use client'
import Link from 'next/link';
import React from 'react';

export function Navbar() {
    return (
        <nav className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="w-10 h-10 bg-[#6e56cf] rounded-md flex items-center justify-center text-white font-bold text-xl">LF</div>
                            <span className="ml-2 text-xl font-bold text-[#6e56cf] dark:text-[#e4dfff]">LearnFlow</span>
                        </div>
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <a href="#home" className="border-transparent text-gray-500 hover:border-[#6e56cf] hover:text-[#6e56cf] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Home
                            </a>
                            <a href="#features" className="border-transparent text-gray-500 hover:border-[#6e56cf] hover:text-[#6e56cf] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Features
                            </a>
                            <a href="#how-it-works" className="border-transparent text-gray-500 hover:border-[#6e56cf] hover:text-[#6e56cf] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                How It Works
                            </a>
                            <a href="#testimonials" className="border-transparent text-gray-500 hover:border-[#6e56cf] hover:text-[#6e56cf] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Testimonials
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Link href="/auth/login" className="text-gray-600 hover:text-[#6e56cf] px-3 py-2 text-sm font-medium">
                            Login
                        </Link>
                        <Link href="/auth/signup" className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6e56cf] hover:bg-[#5a46af] focus:outline-none">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}