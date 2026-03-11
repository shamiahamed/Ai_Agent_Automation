import { Clock } from 'lucide-react';

const RemindersView = ({ reminders }) => {
    return (
        <div className="glass-panel rounded-2xl p-6 h-full flex flex-col border-t-4 border-t-purple-500 m-2">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                    <Clock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide">Active Reminders</h2>
                <span className="ml-auto bg-slate-800 text-sm px-3 py-1 rounded-full text-slate-300 font-mono">{reminders.length} active</span>
            </div>
            {reminders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500">No reminders set.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4">
                    {reminders.map(r => (
                        <div key={r.id} className="bg-slate-800/50 hover:bg-slate-700/50 p-5 rounded-xl border border-purple-500/20 transition-all flex flex-col">
                            <h4 className="font-semibold text-slate-200 text-lg mb-4">{r.message}</h4>
                            <div className="mt-auto flex justify-between items-center text-purple-300">
                                <Clock className="w-4 h-4 opacity-50" />
                                <span className="font-mono bg-purple-500/20 px-3 py-1.5 rounded-lg">{r.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RemindersView;
