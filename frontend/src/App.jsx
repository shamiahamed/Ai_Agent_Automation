import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import TasksView from './components/TasksView';
import MeetingsView from './components/MeetingsView';
import RemindersView from './components/RemindersView';
import InsightsView from './components/InsightsView';
import CareerView from './components/CareerView';

const App = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data State
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);

  // Chat State
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'Hi! I am your AI assistant. Try saying "Add task: Finish project" or "Schedule a meeting tomorrow at 3 PM".' }
  ]);

  // Auto-scroll chat to bottom
  const chatEndRef = useRef(null);
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch all data from backend
  const fetchData = async () => {
    try {
      const [tasksRes, meetingsRes, remindersRes, jobsRes, profileRes] = await Promise.all([
        fetch('http://localhost:8000/tasks'),
        fetch('http://localhost:8000/meetings'),
        fetch('http://localhost:8000/reminders'),
        fetch('http://localhost:8000/jobs'),
        fetch('http://localhost:8000/profile')
      ]);

      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (meetingsRes.ok) setMeetings(await meetingsRes.json());
      if (remindersRes.ok) setReminders(await remindersRes.json());
      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (profileRes.ok) setProfile(await profileRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdateProfile = async (formData) => {
    const prompt = `Update my profile: My name is ${formData.full_name}, email is ${formData.email}, phone is ${formData.phone}, linkedin_url is ${formData.linkedin_url}, gender is ${formData.gender}, disability is ${formData.disability}, sponsorship is ${formData.sponsorship}, skills are ${formData.skills}, bio is ${formData.bio}, target roles are ${formData.target_roles}`;
    await handleSubmit({ preventDefault: () => { } }, prompt);
  };

  const handleApplyToJob = async (job) => {
    // Force the browser to open the tab immediately, bypassing backend OS restrictions
    const sep = job.link.includes('?') ? '&' : '?';
    window.open(`${job.link}${sep}agentos_autofill=true`, '_blank', 'noreferrer');

    const prompt = `Apply to the job: ${job.title} at ${job.company}`;
    await handleSubmit({ preventDefault: () => { } }, prompt);
  };

  // Initial fetch and scroll setup
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Background check for reminders every minute
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      reminders.forEach(r => {
        if (dismissedAlerts.has(r.id)) return;

        // Parse "HH:MM:SS"
        const [h, m] = r.time.split(':').map(Number);
        const reminderMinutes = h * 60 + m;
        const diff = reminderMinutes - currentMinutes;

        // Trigger if due within 5 minutes (and not already past)
        if (diff >= 0 && diff <= 5) {
          setActiveAlert(r);
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, [reminders, dismissedAlerts]);

  // Handle user submission
  const handleSubmit = async (e, manualInput = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const userMsg = manualInput || input.trim();
    if (!userMsg) return;

    if (!manualInput) setInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: userMsg })
      });

      const data = await response.json();

      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: data.response || "Something went wrong."
      }]);

      setNotifications(prev => [{
        id: Date.now(),
        message: `Action completed: ${userMsg.slice(0, 30)}...`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, ...prev].slice(0, 5));

      await fetchData();

    } catch (error) {
      console.error("Agent Error:", error);
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: "Error communicating with the backend."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (text) => {
    setCurrentView('home');
    setInput(text);
    // Focus the chat input implicitly by setting currentView to home which has the input
  };

  // --- Main Layout ---
  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden text-slate-200 font-sans">

      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-slate-800 rounded-lg text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        tasksCount={tasks.length}
        meetingsCount={meetings.length}
        remindersCount={reminders.length}
        onQuickAction={handleQuickAction}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900 shadow-inner">
        {/* Header for mobile spacing */}
        <div className="md:hidden h-16 w-full flex items-center px-4 border-b border-white/5 glass-panel">
          <span className="text-lg font-bold text-white tracking-wide">AgentOS View</span>
        </div>

        <div className="flex-1 h-full w-full max-w-7xl mx-auto p-4 md:p-6 overflow-y-auto">
          {currentView === 'home' && (
            <HomeView
              chatHistory={chatHistory}
              isLoading={isLoading}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              chatEndRef={chatEndRef}
              notifications={notifications}
            />
          )}
          {currentView === 'tasks' && <TasksView tasks={tasks} />}
          {currentView === 'meetings' && <MeetingsView meetings={meetings} />}
          {currentView === 'reminders' && <RemindersView reminders={reminders} />}
          {currentView === 'career' && (
            <CareerView
              jobs={jobs}
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onApply={handleApplyToJob}
            />
          )}
          {currentView === 'insights' && (
            <InsightsView
              tasksCount={tasks.length}
              meetingsCount={meetings.length}
              remindersCount={reminders.length}
            />
          )}
        </div>
      </main>

      {/* Reminder Popup Overlay */}
      {activeAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-800 border-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] rounded-3xl p-8 max-w-md w-full transform animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center animate-bounce">
                <Menu className="w-10 h-10 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Upcoming Reminder!</h3>
                <p className="text-indigo-300 font-medium mb-4">Starts in less than 5 minutes</p>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 mb-6">
                  <p className="text-xl text-slate-200">"{activeAlert.message}"</p>
                  <p className="text-sm text-slate-500 mt-2 font-mono">{activeAlert.time}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDismissedAlerts(prev => new Set([...prev, activeAlert.id]));
                  setActiveAlert(null);
                }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg shadow-lg transition-all hover:scale-[1.02] active:scale-95"
              >
                I'm on it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
