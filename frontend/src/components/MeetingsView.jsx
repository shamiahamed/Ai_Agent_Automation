import { Calendar } from 'lucide-react';

const MeetingsView = ({ meetings }) => {
    return (
        <div className="glass-panel rounded-2xl p-6 h-full flex flex-col border-t-4 border-t-blue-500 m-2">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                    <Calendar className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide">Scheduled Meetings</h2>
                <span className="ml-auto bg-slate-800 text-sm px-3 py-1 rounded-full text-slate-300 font-mono">{meetings.length} upcoming</span>
            </div>
            {meetings.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500">No meetings scheduled.</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-4">
                    {meetings.map(m => (
                        <div key={m.id} className="bg-slate-800/50 hover:bg-slate-700/50 p-5 rounded-xl border border-blue-500/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h4 className="font-semibold text-slate-200 text-lg">{m.title}</h4>
                                <div className="text-sm text-slate-400 mt-1">Status: Confirmed</div>
                            </div>
                            <div className="text-right">
                                <div className="text-blue-400 font-medium">{m.date}</div>
                                <div className="text-blue-300 text-lg font-mono">{m.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MeetingsView;
