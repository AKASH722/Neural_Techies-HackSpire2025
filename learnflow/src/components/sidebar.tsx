'use client'
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Logout from '@/section/auth/logout';
import {
    LayoutDashboard, BookOpen, FileText, Trophy, LibraryBig
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const [activeItem, setActiveItem] = useState('dashboard');

    // Update active item based on the current path when component mounts
    useEffect(() => {
        const path = pathname.split('/')[1] || 'dashboard';
        setActiveItem(path);
    }, [pathname]);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { id: 'quiz', label: 'Quiz', icon: <BookOpen size={20} />, path: '/quiz' },
        { id: 'course', label: 'Course', icon: <LibraryBig size={20} />, path: '/course' },
        { id: 'summarizer', label: 'Summarizer', icon: <FileText size={20} />, path: '/summarizer' },
        { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={20} />, path: '/leaderboard' },
    ];

    const handleNavigation = (itemId: string) => {
        setActiveItem(itemId);
        const item = menuItems.find(item => item.id === itemId);
        if (item) {
            router.push(item.path);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:border-r md:border-sidebar-border md:bg-sidebar md:text-sidebar-foreground md:shadow-sm">
                <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
                    <div className="bg-primary text-primary-foreground font-bold rounded w-8 h-8 flex items-center justify-center">
                        L
                    </div>
                    <span className="ml-2 font-bold text-lg">LearnFlow</span>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <TooltipProvider>
                        {menuItems.map((item) => (
                            <Tooltip key={item.id} delayDuration={300}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={activeItem === item.id ? "secondary" : "ghost"}
                                        className={`w-full justify-start px-4 py-3 h-auto relative ${activeItem === item.id ? 'font-medium' : ''}`}
                                        onClick={() => handleNavigation(item.id)}
                                    >
                                        {activeItem === item.id && (
                                            <span className="absolute left-0 top-0 bottom-0 w-1 bg-sidebar-primary rounded-r"></span>
                                        )}
                                        <span className={activeItem === item.id ? 'text-sidebar-primary' : ''}>
                                            {item.icon}
                                        </span>
                                        <span className="ml-3">{item.label}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </nav>

                <Separator className="my-2" />

                <div className="p-4">
                    <Logout
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                    />
                </div>
            </aside>

            {/* Mobile/Tablet Top Navbar */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border h-14 flex items-center justify-between px-4 mx-4 shadow-sm">
                <div className="flex items-center">
                    <div className="bg-primary text-primary-foreground font-bold rounded w-8 h-8 flex items-center justify-center">
                        L
                    </div>
                    <span className="ml-2 font-bold text-lg">LearnFlow</span>
                </div>

                <div>
                    <Logout
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                    />
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border shadow-lg">
                <nav className="flex items-center justify-around">
                    {menuItems.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            className={`flex flex-col items-center justify-center py-2 px-1 flex-1 h-16 rounded-none ${activeItem === item.id
                                ? 'bg-sidebar-accent/30 text-sidebar-primary'
                                : 'hover:bg-sidebar-accent/20 hover:text-sidebar-primary'
                                }`}
                            onClick={() => handleNavigation(item.id)}
                        >
                            {item.icon}
                            <span className="text-xs mt-1">{item.label}</span>
                        </Button>
                    ))}
                </nav>
            </div>

            {/* Main Content Container */}
            <main className="flex-1 md:ml-64 p-4 mt-14 md:mt-0">
                {/* Your page content goes here */}
                <div className="pb-16 md:pb-0">
                    <div className="p-4 bg-card rounded-lg shadow">
                        <h1 className="text-xl font-bold mb-4">{activeItem.charAt(0).toUpperCase() + activeItem.slice(1)} Content</h1>
                        <p>Your {activeItem} content will appear here</p>
                    </div>
                </div>
            </main>
        </div>
    );
}