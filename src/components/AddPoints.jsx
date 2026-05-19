import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TEAMS = [
  "Compassionate Cobras", "Resilient Rhinos", "Disciplined Dragons",
  "Humble Hyenas", "Brave Bisons", "Positive Peacocks",
  "Loyal Lions", "Grateful Gorillas",
];

const INITIAL_PRESETS = [
  { id: 1, label: "Answering in mic",    points: 5,  color: "bg-gray-600 hover:bg-gray-700 text-white" },
  { id: 2, label: "War Cry",             points: 10, color: "bg-gray-600 hover:bg-gray-700 text-white" },
  { id: 3, label: "Hunt the Wolf",       points: 25, color: "bg-gray-600 hover:bg-gray-700 text-white" },
  { id: 4, label: "Volunteering",        points: 5,  color: "bg-gray-600 hover:bg-gray-700 text-white" },
  { id: 5, label: "Discipline Deduction", points: -5, color: "bg-gray-600 hover:bg-gray-700 text-white" },
];

const DAYS = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];

export default function AddPoints() {
  const [activePage,      setActivePage]      = useState("Search Scoreboard");
  const [selectedTeam,    setSelectedTeam]    = useState("Compassionate Cobras");
  const [activity,        setActivity]        = useState("");
  const [points,          setPoints]          = useState("");
  const [currentDay,      setCurrentDay]      = useState(0);
  const [presets,         setPresets]         = useState(INITIAL_PRESETS);
  const [log,             setLog]             = useState([]);
  const [showEditPresets, setShowEditPresets] = useState(false);
  const [editPreset,      setEditPreset]      = useState(null);
  const [newPreset,       setNewPreset]       = useState({ label: "", points: "" });
  const [flash,           setFlash]           = useState(null);
  const [darkMode,        setDarkMode]        = useState(false);
  const [sidebarOpen,     setSidebarOpen]     = useState(false);
  const [activeTab,       setActiveTab]       = useState("form"); // mobile tab: "form" | "totals"

  // ── Your original backend state ──
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state.username;
  const users    = location.state.users;
  const school   = location.state.school;
  const navItems = ["Dashboard", "Add Schools", "Search Scoreboard", "Add Users"];
  const url      = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"];
  const darkModeStatus = location.state.darkMode;

  useEffect(() => {
    setDarkMode(darkModeStatus);
  }, [darkModeStatus]);
  
  // ─────────────────────────────────

  // Dark mode classes
  const dm = {
    page:    darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300",
    title:   darkMode ? "border-gray-700 text-white"  : "border-gray-200 text-gray-900",
    sidebar: darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-400",
    main:    darkMode ? "bg-gray-800"                 : "bg-gray-50",
    card:    darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    text:    darkMode ? "text-gray-100"               : "text-gray-700",
    subtext: darkMode ? "text-gray-400"               : "text-gray-500",
    input:   darkMode ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-500" : "bg-white border-green-300 text-gray-700 focus:ring-green-300",
    select:  darkMode ? "bg-gray-700 border-gray-600 text-green-300" : "bg-green-50 border-green-300 text-green-700",
    row:     darkMode ? "hover:bg-gray-700 border-gray-700" : "hover:bg-gray-50 border-gray-50",
    logRow:  darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-50 hover:bg-gray-50",
    presetBg:darkMode ? "bg-gray-700"                : "bg-gray-50",
    dayBtn:  darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-green-300",
    thead:   darkMode ? "bg-gray-700 text-gray-300"   : "bg-gray-50 text-gray-500",
    teamRow: darkMode ? "bg-gray-700 border-gray-600" : "bg-green-50 border-green-300",
  };

  const inputClass = `border rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 transition w-full ${dm.input}`;

  // ── Your original handlers (untouched) ──
  const showFlash = (msg, color) => {
    setFlash({ msg, color });
    setTimeout(() => setFlash(null), 1800);
  };

  const handleAdd = (pts = null, label = null) => {
    const finalPoints   = pts   ?? parseInt(points);
    const finalActivity = label ?? activity;
    if (!finalActivity || isNaN(finalPoints)) { alert("Fill activity and points."); return; }
    const entry = {
      id: Date.now(), team: selectedTeam,
      activity: finalActivity, points: finalPoints,
      day: DAYS[currentDay],
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };
    setLog((prev) => [entry, ...prev]);
    setActivity(""); setPoints("");
    showFlash(`+${finalPoints} pts added to ${selectedTeam}`, finalPoints >= 0 ? "bg-green-500" : "bg-red-500");
  };

  const handlePresetClick  = (preset) => handleAdd(preset.points, preset.label);

  const handleSavePreset = () => {
    const pts = parseInt(newPreset.points);
    if (!newPreset.label || isNaN(pts)) { alert("Fill preset fields."); return; }
    if (editPreset) {
      setPresets(presets.map((p) => p.id === editPreset.id ? { ...p, label: newPreset.label, points: pts } : p));
    } else {
      setPresets([...presets, { id: Date.now(), label: newPreset.label, points: pts, color: "bg-gray-600 hover:bg-gray-700 text-white" }]);
    }
    setNewPreset({ label: "", points: "" }); setEditPreset(null);
  };

  const teamTotal = (team) => log.filter((l) => l.team === team).reduce((s, l) => s + l.points, 0);
  // ────────────────────────────────────────

  return (
    <div className={`min-h-screen border-2 border-dashed rounded-xl font-mono transition-colors duration-300 ${dm.page}`}>

      {/* ── Top Bar ── */}
      <div className={`flex items-center justify-between px-4 py-4 border-b ${dm.title}`}>

        {/* Hamburger */}
        <button onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className={`text-base md:text-xl font-bold text-center flex-1 ${dm.title}`}>
          Welcome to Entercon Score Page!
        </h1>

        {/* Dark Mode Toggle */}
        <button onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
            darkMode ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" : "bg-gray-800 text-white hover:bg-gray-700"
          }`}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-73px)] relative">

        {/* ── Mobile Overlay ── */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Sidebar ── */}
        <div className={`
          fixed md:static z-50 top-0 left-0 h-full
          w-64 md:w-56 shrink-0
          flex flex-col gap-6 px-6 py-8
          border-r transition-transform duration-300
          ${dm.sidebar}
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
        `}>
          <div className="flex items-center justify-between md:hidden mb-2">
            <span className={`text-sm font-bold ${dm.text}`}>Menu</span>
            <button onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
          </div>

          {navItems.map((item, index) => (
            <button key={item}
              onClick={() => {
                setActivePage(item);
                setSidebarOpen(false);
                navigate(url[index], { state: { username, users, school, darkMode } });
              }}
              className={`text-left text-sm font-mono transition-all duration-150 hover:text-blue-500 ${
                activePage === item ? "text-blue-500 font-bold" : dm.text
              }`}>
              {item}
            </button>
          ))}
        </div>

        {/* ── Main Content ── */}
        <div className={`flex-1 px-4 md:px-8 py-5 md:py-6 flex flex-col gap-4 md:gap-5 ${dm.main}`}>

          {/* Flash */}
          {flash && (
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-lg ${flash.color}`}>
              {flash.msg}
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base md:text-lg font-bold text-pink-500">Add Points</h2>
              <p className={`text-xs mt-0.5 ${dm.subtext}`}>Log scores and activities per team</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full">
                {log.length} Events Logged
              </span>
              <div className={`flex items-center gap-1 border rounded-lg px-3 py-1.5 ${dm.dayBtn}`}>
                <button onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
                  className={`font-bold text-sm transition-colors ${dm.subtext} hover:text-blue-500`}>‹</button>
                <span className={`text-xs font-bold mx-1 ${dm.text}`}>{DAYS[currentDay]}</span>
                <button onClick={() => setCurrentDay(Math.min(DAYS.length - 1, currentDay + 1))}
                  className={`font-bold text-sm transition-colors ${dm.subtext} hover:text-blue-500`}>›</button>
              </div>
            </div>
          </div>

          {/* Mobile Tab Switch */}
          <div className={`flex md:hidden gap-2 border rounded-xl p-1.5 ${dm.card}`}>
            {["form", "totals"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab ? "bg-pink-500 text-white" : `${dm.text} hover:bg-gray-100`
                }`}>
                {tab === "form" ? "➕ Add Points" : "🏆 Totals & Log"}
              </button>
            ))}
          </div>

          {/* ── Desktop: 2 col | Mobile: tabs ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

            {/* LEFT: Form + Presets */}
            <div className={`flex flex-col gap-4 ${activeTab === "totals" ? "hidden md:flex" : "flex"}`}>

              {/* Entry Card */}
              <div className={`border-2 border-green-300 rounded-xl p-4 md:p-5 shadow-sm ${dm.card}`}>
                <h3 className="text-sm font-bold text-green-500 mb-4 pb-2 border-b border-green-200">
                  ➕ Add Points Entry
                </h3>

                {/* Team */}
                <div className="mb-3">
                  <label className={`text-xs font-bold uppercase tracking-wide mb-1 block ${dm.subtext}`}>Team Name</label>
                  <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}
                    className={`border rounded-lg px-3 py-2 text-sm font-bold font-mono w-full focus:outline-none focus:ring-2 focus:ring-green-300 transition ${dm.select}`}>
                    {TEAMS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                {/* Activity */}
                <div className="mb-3">
                  <label className={`text-xs font-bold uppercase tracking-wide mb-1 block ${dm.subtext}`}>Activity / Reason</label>
                  <input type="text" placeholder="e.g. Answering in mic"
                    value={activity} onChange={(e) => setActivity(e.target.value)}
                    className={inputClass} />
                </div>

                {/* Points + Day */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wide mb-1 block ${dm.subtext}`}>Points (+/-)</label>
                    <input type="number" placeholder="e.g. +5 or -5"
                      value={points} onChange={(e) => setPoints(e.target.value)}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wide mb-1 block ${dm.subtext}`}>Day</label>
                    <div className={`border rounded-lg px-3 py-1.5 flex items-center justify-between ${dm.dayBtn}`}>
                      <button onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
                        className={`font-bold transition-colors hover:text-green-500 ${dm.subtext}`}>‹</button>
                      <span className={`text-sm font-bold ${dm.text}`}>{DAYS[currentDay]}</span>
                      <button onClick={() => setCurrentDay(Math.min(DAYS.length - 1, currentDay + 1))}
                        className={`font-bold transition-colors hover:text-green-500 ${dm.subtext}`}>›</button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => handleAdd()}
                    className="bg-orange-400 hover:bg-orange-500 active:scale-95 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all">
                    Add
                  </button>
                  <button onClick={() => handleAdd(5, activity || "+5 Quick")}
                    className="bg-green-500 hover:bg-green-600 active:scale-95 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all">
                    +5 Quick
                  </button>
                  <button onClick={() => handleAdd(-5, activity || "-5 Penalty")}
                    className="bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all">
                    -5 Penalty
                  </button>
                </div>
              </div>

              {/* Presets */}
              <div className={`border rounded-xl p-4 shadow-sm ${dm.card}`}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className={`text-sm font-bold ${dm.text}`}>⚡ Quick Presets</h3>
                  <button onClick={() => setShowEditPresets(!showEditPresets)}
                    className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">
                    Edit Presets (one-tap)
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button key={preset.id} onClick={() => handlePresetClick(preset)}
                      className={`text-xs font-bold px-3 py-2 rounded-lg active:scale-95 transition-all text-left ${preset.color}`}>
                      {preset.label} ({preset.points > 0 ? "+" : ""}{preset.points})
                    </button>
                  ))}
                </div>

                {/* Edit Presets Panel */}
                {showEditPresets && (
                  <div className={`mt-4 border-t pt-4 ${darkMode ? "border-gray-600" : "border-gray-100"}`}>
                    <h4 className={`text-xs font-bold uppercase tracking-wide mb-3 ${dm.subtext}`}>
                      {editPreset ? "Edit Preset" : "Add New Preset"}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className={`text-xs font-semibold mb-1 block ${dm.subtext}`}>Label</label>
                        <input type="text" placeholder="Activity name"
                          value={newPreset.label}
                          onChange={(e) => setNewPreset({ ...newPreset, label: e.target.value })}
                          className={`border rounded-lg px-2 py-1.5 text-xs w-full focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${
                            darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-200 text-gray-700"
                          }`} />
                      </div>
                      <div>
                        <label className={`text-xs font-semibold mb-1 block ${dm.subtext}`}>Points</label>
                        <input type="number" placeholder="e.g. 10 or -5"
                          value={newPreset.points}
                          onChange={(e) => setNewPreset({ ...newPreset, points: e.target.value })}
                          className={`border rounded-lg px-2 py-1.5 text-xs w-full focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${
                            darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-200 text-gray-700"
                          }`} />
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <button onClick={handleSavePreset}
                        className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg active:scale-95 transition-all">
                        {editPreset ? "Save Edit" : "Add Preset"}
                      </button>
                      {editPreset && (
                        <button onClick={() => { setEditPreset(null); setNewPreset({ label: "", points: "" }); }}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-4 py-1.5 rounded-lg active:scale-95 transition-all">
                          Cancel
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      {presets.map((p) => (
                        <div key={p.id} className={`flex items-center justify-between rounded-lg px-3 py-1.5 ${dm.presetBg}`}>
                          <span className={`text-xs font-bold ${dm.text}`}>{p.label} ({p.points > 0 ? "+" : ""}{p.points})</span>
                          <div className="flex gap-1">
                            <button onClick={() => { setEditPreset(p); setNewPreset({ label: p.label, points: String(p.points) }); }}
                              className="text-xs text-yellow-500 hover:text-yellow-400 font-bold px-2 py-0.5 rounded transition-colors">✏️</button>
                            <button onClick={() => setPresets(presets.filter((x) => x.id !== p.id))}
                              className="text-xs text-red-400 hover:text-red-500 font-bold px-2 py-0.5 rounded transition-colors">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Team Totals + Log */}
            <div className={`flex flex-col gap-4 ${activeTab === "form" ? "hidden md:flex" : "flex"}`}>

              {/* Team Totals */}
              <div className={`border rounded-xl p-4 shadow-sm ${dm.card}`}>
                <h3 className={`text-sm font-bold mb-3 pb-2 border-b ${dm.text} ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                  🏆 Team Totals — {DAYS[currentDay]}
                </h3>
                <div className="flex flex-col gap-1.5">
                  {TEAMS.map((team) => {
                    const total = teamTotal(team);
                    const max   = Math.max(...TEAMS.map((t) => teamTotal(t)), 1);
                    const pct   = Math.round((total / max) * 100);
                    return (
                      <div key={team} onClick={() => setSelectedTeam(team)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                          selectedTeam === team ? dm.teamRow : `hover:${darkMode ? "bg-gray-700" : "bg-gray-50"}`
                        }`}>
                        <span className={`text-xs font-bold w-36 truncate ${dm.text}`}>{team}</span>
                        <div className={`flex-1 rounded-full h-2 ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
                          <div className={`h-2 rounded-full transition-all duration-500 ${total < 0 ? "bg-red-400" : "bg-green-400"}`}
                            style={{ width: `${Math.abs(pct)}%` }} />
                        </div>
                        <span className={`text-xs font-bold w-10 text-right ${total < 0 ? "text-red-500" : dm.text}`}>
                          {total > 0 ? "+" : ""}{total}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Log */}
              <div className={`border rounded-xl shadow-sm overflow-hidden flex-1 ${dm.card}`}>
                <div className={`px-4 py-3 border-b flex items-center justify-between ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                  <h3 className={`text-sm font-bold ${dm.text}`}>📋 Recent Log</h3>
                  {log.length > 0 && (
                    <button onClick={() => setLog([])}
                      className="text-xs text-red-400 hover:text-red-500 font-bold transition-colors">
                      Clear All
                    </button>
                  )}
                </div>
                {log.length === 0 ? (
                  <div className={`px-4 py-8 text-center text-xs ${dm.subtext}`}>
                    No points logged yet. Use the form or presets to add entries.
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {log.map((entry) => (
                      <div key={entry.id}
                        className={`flex items-center justify-between px-4 py-2.5 border-b transition-colors ${dm.logRow}`}>
                        <div className="flex flex-col min-w-0">
                          <span className={`text-xs font-bold truncate ${dm.text}`}>{entry.team}</span>
                          <span className={`text-xs truncate ${dm.subtext}`}>{entry.activity} · {entry.day} · {entry.time}</span>
                        </div>
                        <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ml-2 shrink-0 ${
                          entry.points >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                        }`}>
                          {entry.points > 0 ? "+" : ""}{entry.points}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}