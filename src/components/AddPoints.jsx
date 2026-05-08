import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TEAMS = [
  "Compassionate Cobras", "Resilient Rhinos", "Disciplined Dragons",
  "Humble Hyenas", "Brave Bisons", "Positive Peacocks",
  "Loyal Lions", "Grateful Gorillas",
];

const INITIAL_PRESETS = [
  { id: 1, label: "Answering in mic", points: 5,   color: "bg-gray-600 hover:bg-gray-700 text-white" },
  { id: 2, label: "War Cry",          points: 10,  color: "bg-gray-600 hover:bg-gray-700 text-white" },
  { id: 3, label: "Hunt the Wolf",    points: 25,  color: "bg-gray-600 hover:bg-gray-700 text-white" },
  { id: 4, label: "Volunteering",     points: 5,   color: "bg-gray-600 hover:bg-gray-700 text-white" },
  { id: 5, label: "Discipline Deduction", points: -5, color: "bg-gray-600 hover:bg-gray-700 text-white" },
];

const DAYS = ["Day 1","Day 2","Day 3","Day 4","Day 5"];

export default function AddPoints() {
  const [activePage,   setActivePage]   = useState("Search Scoreboard");
  const [selectedTeam, setSelectedTeam] = useState("Compassionate Cobras");
  const [activity,     setActivity]     = useState("");
  const [points,       setPoints]       = useState("");
  const [currentDay,   setCurrentDay]   = useState(0);
  const [presets,      setPresets]      = useState(INITIAL_PRESETS);
  const [log,          setLog]          = useState([]);
  const [showEditPresets, setShowEditPresets] = useState(false);
  const [editPreset,   setEditPreset]   = useState(null);
  const [newPreset,    setNewPreset]    = useState({ label: "", points: "" });
  const [flash,        setFlash]        = useState(null);

  const navigate = useNavigate();
  const navItems = ["Dashboard","Add Schools","Search Scoreboard","Add Users"];
  const url = ["/dashboard","/add-school","/search-scoreboard","/add-users"]

  const inputClass = "border border-green-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 font-mono focus:outline-none focus:ring-2 focus:ring-green-300 bg-white transition w-full";

  const showFlash = (msg, color) => {
    setFlash({ msg, color });
    setTimeout(() => setFlash(null), 1800);
  };

  const handleAdd = (pts = null, label = null) => {
    const finalPoints  = pts   ?? parseInt(points);
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

  const handlePresetClick = (preset) => {
    handleAdd(preset.points, preset.label);
  };

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

  return (
    <div className="min-h-screen bg-white border-2 border-dashed border-gray-300 rounded-xl font-mono">

      {/* Title */}
      <h1 className="text-xl font-bold text-center py-6 border-b border-gray-200">
        Welcome to Entercon Score Page!
      </h1>

      <div className="flex min-h-[700px]">

        {/* Sidebar */}
        <div className="w-56 shrink-0 flex flex-col gap-6 px-6 py-8 border-r border-gray-400">
          {navItems.map((item, index) => (
            <button key={item} onClick={() => {setActivePage(item); navigate(url[index])}}
              className={`text-left text-sm font-mono transition-all duration-150 hover:text-blue-500 ${
                activePage === item ? "text-blue-600 font-bold" : "text-gray-800"
              }`}>
              {item}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 px-8 py-6 bg-gray-50 flex flex-col gap-5">

          {/* Flash */}
          {flash && (
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-lg transition-all ${flash.color}`}>
              {flash.msg}
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-pink-500">Add Points</h2>
              <p className="text-xs text-gray-400 mt-0.5">Log scores and activities per team</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full">
                {log.length} Events Logged
              </span>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
                <button onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
                  className="text-gray-400 hover:text-blue-500 font-bold text-sm transition-colors">‹</button>
                <span className="text-xs font-bold text-gray-700 mx-1">{DAYS[currentDay]}</span>
                <button onClick={() => setCurrentDay(Math.min(DAYS.length - 1, currentDay + 1))}
                  className="text-gray-400 hover:text-blue-500 font-bold text-sm transition-colors">›</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">

            {/* Left: Add Points Form */}
            <div className="flex flex-col gap-4">

              {/* Entry Card */}
              <div className="bg-white border-2 border-green-300 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-green-600 mb-4 pb-2 border-b border-green-100">
                  ➕ Add Points Entry
                </h3>

                {/* Team Selector */}
                <div className="mb-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Team Name</label>
                  <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}
                    className="border border-green-300 rounded-lg px-3 py-2 text-sm font-bold text-green-700 font-mono w-full focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50 transition">
                    {TEAMS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                {/* Activity */}
                <div className="mb-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Activity / Reason</label>
                  <input type="text" placeholder="e.g. Answering in mic"
                    value={activity} onChange={(e) => setActivity(e.target.value)}
                    className={inputClass} />
                </div>

                {/* Points + Day */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Points (+/-)</label>
                    <input type="number" placeholder="e.g. +5 or -5"
                      value={points} onChange={(e) => setPoints(e.target.value)}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Day</label>
                    <div className="border border-green-300 rounded-lg px-3 py-1.5 bg-white flex items-center justify-between">
                      <button onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
                        className="text-gray-400 hover:text-green-500 font-bold transition-colors">‹</button>
                      <span className="text-sm font-bold text-gray-700">{DAYS[currentDay]}</span>
                      <button onClick={() => setCurrentDay(Math.min(DAYS.length - 1, currentDay + 1))}
                        className="text-gray-400 hover:text-green-500 font-bold transition-colors">›</button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
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

              {/* Preset Buttons */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-700">⚡ Quick Presets</h3>
                  <button onClick={() => setShowEditPresets(!showEditPresets)}
                    className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">
                    Edit Presets (one-tap)
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button key={preset.id}
                      onClick={() => handlePresetClick(preset)}
                      className={`text-xs font-bold px-3 py-2 rounded-lg active:scale-95 transition-all ${preset.color} text-left`}>
                      {preset.label} ({preset.points > 0 ? "+" : ""}{preset.points})
                    </button>
                  ))}
                </div>

                {/* Edit Presets Panel */}
                {showEditPresets && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                      {editPreset ? "Edit Preset" : "Add New Preset"}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-gray-400 font-semibold mb-1 block">Label</label>
                        <input type="text" placeholder="Activity name"
                          value={newPreset.label}
                          onChange={(e) => setNewPreset({ ...newPreset, label: e.target.value })}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-full focus:outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 font-semibold mb-1 block">Points</label>
                        <input type="number" placeholder="e.g. 10 or -5"
                          value={newPreset.points}
                          onChange={(e) => setNewPreset({ ...newPreset, points: e.target.value })}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-full focus:outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50" />
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
                        <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5">
                          <span className="text-xs font-bold text-gray-700">{p.label} ({p.points > 0 ? "+" : ""}{p.points})</span>
                          <div className="flex gap-1">
                            <button onClick={() => { setEditPreset(p); setNewPreset({ label: p.label, points: String(p.points) }); }}
                              className="text-xs text-yellow-600 hover:text-yellow-700 font-bold px-2 py-0.5 rounded transition-colors">✏️</button>
                            <button onClick={() => setPresets(presets.filter((x) => x.id !== p.id))}
                              className="text-xs text-red-400 hover:text-red-600 font-bold px-2 py-0.5 rounded transition-colors">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Team Totals + Log */}
            <div className="flex flex-col gap-4">

              {/* Team Score Summary */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">
                  🏆 Team Totals — {DAYS[currentDay]}
                </h3>
                <div className="flex flex-col gap-1.5">
                  {TEAMS.map((team) => {
                    const total = teamTotal(team);
                    const max   = Math.max(...TEAMS.map((t) => teamTotal(t)), 1);
                    const pct   = Math.round((total / max) * 100);
                    return (
                      <div key={team}
                        onClick={() => setSelectedTeam(team)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                          selectedTeam === team ? "bg-green-50 border border-green-300" : "hover:bg-gray-50"
                        }`}>
                        <span className="text-xs font-bold text-gray-700 w-36 truncate">{team}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className={`h-2 rounded-full transition-all duration-500 ${total < 0 ? "bg-red-400" : "bg-green-400"}`}
                            style={{ width: `${Math.abs(pct)}%` }} />
                        </div>
                        <span className={`text-xs font-bold w-10 text-right ${total < 0 ? "text-red-500" : "text-gray-700"}`}>
                          {total > 0 ? "+" : ""}{total}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Log */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-700">📋 Recent Log</h3>
                  {log.length > 0 && (
                    <button onClick={() => setLog([])}
                      className="text-xs text-red-400 hover:text-red-600 font-bold transition-colors">
                      Clear All
                    </button>
                  )}
                </div>
                {log.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-400 text-xs">
                    No points logged yet. Use the form or presets to add entries.
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {log.map((entry) => (
                      <div key={entry.id}
                        className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-800">{entry.team}</span>
                          <span className="text-xs text-gray-400">{entry.activity} · {entry.day} · {entry.time}</span>
                        </div>
                        <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${
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