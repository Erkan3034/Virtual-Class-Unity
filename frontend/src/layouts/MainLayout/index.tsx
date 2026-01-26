import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, LogOut, GraduationCap, Box } from 'lucide-react';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
                <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <GraduationCap size={20} className="text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Virtual Class</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/teacher"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'hover:bg-slate-800 text-slate-400'
                            }`
                        }
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Teacher Panel</span>
                    </NavLink>

                    <NavLink
                        to="/unity"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'hover:bg-slate-800 text-slate-400'
                            }`
                        }
                    >
                        <Box size={20} />
                        <span className="font-medium">Unity Integration</span>
                    </NavLink>

                    <NavLink
                        to="/debug"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' : 'hover:bg-slate-800 text-slate-400'
                            }`
                        }
                    >
                        <ShieldCheck size={20} />
                        <span className="font-medium">Debug Dashboard</span>
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
