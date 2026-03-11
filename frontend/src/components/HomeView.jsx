import { Bot, Bell } from 'lucide-react';

const HomeView = ({
    chatHistory,
    isLoading,
    input,
    setInput,
    handleSubmit,
    chatEndRef,
    notifications
}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full p-2">
            {/* Chat Interface */}
            <div className="w-full lg:w-3/5 flex flex-col glass-panel rounded-2xl overflow-hidden h-full">
                <div className="bg-slate-800/80 p-4 border-b border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white tracking-wide">Multi-Agent AI</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-xs text-emerald-400 font-medium tracking-wider uppercase">Online</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-[400px]">
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} bot-message`}>
                            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                                ? 'bg-blue-600/90 text-white rounded-tr-sm border border-blue-500/50'
                                : 'bg-slate-800/90 text-slate-200 rounded-tl-sm border border-white/5'
                                }`}>
                                <p className="text-[15px] leading-relaxed relative z-10">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start bot-message">
                            <div className="bg-slate-800/90 rounded-2xl rounded-tl-sm p-4 border border-white/5 flex gap-2 items-center">
                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="p-4 bg-slate-800/50 border-t border-white/5">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a command to AI..."
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-full py-3 px-5 pr-14 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
                            disabled={isLoading}
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                            disabled={isLoading || !input.trim()}
                        >
                            <svg className="w-5 h-5 translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </div>
                </form>
            </div>

            {/* Recent Notifications Widget */}
            <div className="w-full lg:w-2/5 flex flex-col gap-6">
                <div className="glass-panel rounded-2xl p-5 border-t-4 border-t-indigo-500 flex-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                            <Bell className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Recent Automations</h3>
                    </div>
                    {notifications.length === 0 ? (
                        <p className="text-slate-500 text-sm italic py-4 text-center">No recent AI activity.</p>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map(n => (
                                <div key={n.id} className="flex gap-4 items-start border-l-2 border-indigo-500/50 pl-3">
                                    <div className="text-xs font-mono text-indigo-300 mt-1">{n.time}</div>
                                    <div className="text-sm text-slate-300">{n.message}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeView;
