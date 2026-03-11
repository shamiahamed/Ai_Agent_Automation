import { CheckCircle } from 'lucide-react';

const TasksView = ({ tasks }) => {
    return (
        <div className="glass-panel rounded-2xl p-6 h-full flex flex-col border-t-4 border-t-emerald-500 m-2">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide">All Action Items</h2>
                <span className="ml-auto bg-slate-800 text-sm px-3 py-1 rounded-full text-slate-300 font-mono">{tasks.length} total</span>
            </div>
            {tasks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500">No tasks found. Ask the AI to create one!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4">
                    {tasks.map(t => (
                        <div key={t.id} className="bg-slate-800/50 hover:bg-slate-700/50 p-5 rounded-xl border border-emerald-500/20 transition-all flex flex-col gap-2">
                            <h4 className="font-semibold text-slate-200 text-lg">{t.title}</h4>
                            <div className="mt-auto pt-4 flex justify-between items-center">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400">Pending</span>
                                <span className="text-slate-500 text-xs font-mono text-opacity-50">ID: {t.id}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TasksView;
