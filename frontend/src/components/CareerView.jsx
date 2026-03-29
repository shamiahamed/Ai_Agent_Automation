import React, { useState, useEffect } from 'react';
import { Briefcase, User, Send, ExternalLink, ShieldCheck, Zap, Loader2 } from 'lucide-react';

const CareerView = ({ jobs, profile, onUpdateProfile, onApply }) => {
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'profile'
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileForm, setProfileForm] = useState(profile || {
    full_name: '',
    email: '',
    skills: '',
    bio: '',
    target_roles: ''
  });

  useEffect(() => {
    if (profile) setProfileForm(profile);
  }, [profile]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    await onUpdateProfile(profileForm);
    setIsUpdating(false);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Career Command Center</h1>
          <p className="text-slate-400">Automate your job search with AgentOS</p>
        </div>
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'feed' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Job Feed
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            AI Profile
          </button>
        </div>
      </div>

      {activeTab === 'feed' ? (
        <div className="grid grid-cols-1 gap-6">
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-white/10">
              <Briefcase className="w-16 h-16 text-slate-700 mb-4" />
              <p className="text-slate-500 text-lg">No scouted jobs yet.</p>
              <p className="text-slate-600 text-sm mt-1">Try saying "Find me jobs for React Developer" in the chat.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-slate-800/40 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                         job.status === 'Applied' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                       }`}>
                         {job.status}
                       </span>
                       <span className="text-slate-500 text-xs flex items-center gap-1">
                         <MapPin className="w-3 h-3" /> {job.location}
                       </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                    <p className="text-indigo-300 font-medium">{job.company}</p>
                    <p className="text-slate-400 text-sm mt-3 line-clamp-2">{job.description}</p>
                    
                    {job.draft_message && (
                      <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <ShieldCheck className="w-3 h-3" /> AI Application Draft
                        </p>
                        <p className="text-slate-300 text-xs italic line-clamp-3 leading-relaxed">
                          "{job.draft_message}"
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <a 
                      href={job.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors border border-white/5"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <button 
                      onClick={() => onApply(job)}
                      disabled={job.status === 'Applied'}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                        job.status === 'Applied' 
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
                      }`}
                    >
                      {job.status === 'Applied' ? (
                        <>
                          <ShieldCheck className="w-5 h-5" />
                          Applied
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Auto-Apply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto w-full">
          <form onSubmit={handleProfileSubmit} className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-600/20 rounded-2xl border border-indigo-500/30">
                <User className="text-indigo-400 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Application Profile</h2>
                <p className="text-sm text-slate-500">This data helps the agent tailor your applications</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Skills (Comma separated)</label>
              <input 
                type="text" 
                value={profileForm.skills}
                onChange={(e) => setProfileForm({...profileForm, skills: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="React, Python, LangChain, Tailwind..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Professional Bio</label>
              <textarea 
                rows="4"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                placeholder="Brief summary of your experience..."
              />
            </div>

            <button 
              type="submit" 
              disabled={isUpdating}
              className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
            >
              {isUpdating ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
              {isUpdating ? 'Saving...' : 'Save AI Profile'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const MapPin = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

export default CareerView;
