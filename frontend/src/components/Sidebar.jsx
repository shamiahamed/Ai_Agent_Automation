import { Home, CheckCircle, Calendar, Clock } from 'lucide-react';

const Sidebar = ({
    currentView,
    setCurrentView,
    isSidebarOpen,
    setIsSidebarOpen,
    tasksCount,
    meetingsCount,
    remindersCount
}) => {
    return (
        <>
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40 w-64 glass-panel border-r border-white/5 
                transform transition-transform duration-300 ease-in-out flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        AgentOS
                    </h1>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <button
                        onClick={() => { setCurrentView('home'); setIsSidebarOpen(false); }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'home' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Home</span>
                    </button>

                    <button
                        onClick={() => { setCurrentView('tasks'); setIsSidebarOpen(false); }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'tasks' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Tasks</span>
                        {tasksCount > 0 && <span className="ml-auto bg-slate-900 text-xs px-2 py-0.5 rounded-full">{tasksCount}</span>}
                    </button>

                    <button
                        onClick={() => { setCurrentView('meetings'); setIsSidebarOpen(false); }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'meetings' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Meetings</span>
                        {meetingsCount > 0 && <span className="ml-auto bg-slate-900 text-xs px-2 py-0.5 rounded-full">{meetingsCount}</span>}
                    </button>

                    <button
                        onClick={() => { setCurrentView('reminders'); setIsSidebarOpen(false); }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'reminders' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">Reminders</span>
                        {remindersCount > 0 && <span className="ml-auto bg-slate-900 text-xs px-2 py-0.5 rounded-full">{remindersCount}</span>}
                    </button>
                </nav>

                <div className="p-4 border-t border-white/5 text-xs text-slate-500 font-mono text-center">
                    LangGraph Multi-Agent Runtime
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
