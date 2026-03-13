import React from 'react';
import { Sparkles, TrendingUp, Zap, BarChart3 } from 'lucide-react';

const InsightsView = ({ tasksCount, meetingsCount, remindersCount }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                    AI Insights
                </h2>
                <p className="text-slate-400">Strategic overview of your productivity ecosystem.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Productivity Score Card */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
                            <Zap className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg">+12% vs last week</span>
                    </div>
                    <h3 className="text-slate-300 font-medium mb-1">Productivity Score</h3>
                    <p className="text-4xl font-bold text-white">84<span className="text-xl text-slate-500">/100</span></p>
                    <div className="mt-4 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                </div>

                {/* Automation Impact Card */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-slate-300 font-medium mb-1">Time Saved</h3>
                    <p className="text-4xl font-bold text-white">4.2<span className="text-xl text-slate-500">h</span></p>
                    <p className="text-xs text-emerald-500 mt-2 font-medium italic">Estimated by LangGraph</p>
                </div>

                {/* Load Distribution Card */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-orange-500/10 to-red-500/10 md:col-span-2 lg:col-span-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-slate-300 font-medium mb-1">Context Load</h3>
                    <p className="text-4xl font-bold text-white">{tasksCount + meetingsCount + remindersCount}</p>
                    <p className="text-xs text-slate-500 mt-2 font-mono">Active tracking items</p>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl mb-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-4">Agent OS Recommendation</h3>
                    <p className="text-slate-300 leading-relaxed max-w-2xl">
                        Based on your current load of <span className="text-indigo-400 font-bold">{tasksCount} tasks</span> and 
                        <span className="text-blue-400 font-bold"> {meetingsCount} upcoming meetings</span>, 
                        the AI suggests rescheduling low-priority items to later this evening to avoid burnout.
                    </p>
                    <button className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium border border-white/10">
                        Optimize Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsightsView;
