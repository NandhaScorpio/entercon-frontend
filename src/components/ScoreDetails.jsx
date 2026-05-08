import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"

const INITIAL_LOGS = [
  { id: 1, time: "12:55:01 PM", team: "Resilient Rhinos", activity: "Answering in mic", points: 5 },
  { id: 2, time: "12:58:55", team: "Disciplined Dragons", activity: "Rocket Launch", points: 30 },
  { id: 3, time: "01:05:10 PM", team: "Humble Hyenas", activity: "Quiz Round", points: 15 },
  { id: 4, time: "01:12:33 PM", team: "Brave Bisons", activity: "Debate Round", points: 20 },
];

const TEAMS = ["Resilient Rhinos", "Disciplined Dragons", "Humble Hyenas", "Brave Bisons", "Positive Peacocks", "Loyal Lions"];
const ACTIVITIES = ["Answering in mic", "Rocket Launch", "Quiz Round", "Debate Round", "Science Demo", "Coding Cup"];

export default function ScoreDetails() {
  const location = useLocation();
  const { schoolName, programName } = location.state;
  console.log("Received schoolName:", schoolName);
  console.log("Received programName:", programName);

  const [activePage, setActivePage] = useState("Search Scoreboard");
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [undoStack, setUndoStack] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const totalDays = 5;
  const showScoreboard = false;
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLog, setNewLog] = useState({ team: "", activity: "", points: "" });

  const navItems = ["Dashboard", "Add Schools", "Search Scoreboard", "Add Users"];
  const url = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"];
  const navigate = useNavigate();

  const handleUndo = (id) => {
    const log = logs.find((l) => l.id === id);
    setUndoStack([...undoStack, log]);
    setLogs(logs.filter((l) => l.id !== id));
  };

  const handleRestore = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setLogs([...logs, last].sort((a, b) => a.id - b.id));
    setUndoStack(undoStack.slice(0, -1));
  };

  const handleAddLog = () => {
    if (!newLog.team || !newLog.activity || !newLog.points) { alert("Fill all fields."); return; }
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const entry = { id: Date.now(), time, team: newLog.team, activity: newLog.activity, points: parseInt(newLog.points) };
    setLogs([...logs, entry]);
    setNewLog({ team: "", activity: "", points: "" });
    setShowAddForm(false);
  };

  // Scoreboard: aggregate points per team
  const scoreboard = TEAMS.map((team) => ({
    team,
    points: logs.filter((l) => l.team === team).reduce((sum, l) => sum + l.points, 0),
  })).sort((a, b) => b.points - a.points);

  const topScore = scoreboard[0]?.points || 0;

  const inputClass = "border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 font-mono w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white transition";
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block";

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
              className={`text-left text-sm font-mono transition-all duration-150 hover:text-blue-500 ${activePage === item ? "text-blue-600 font-bold" : "text-gray-800"
                }`}>
              {item}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 px-10 py-8 bg-gray-50 flex flex-col gap-6">

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Score Details</h2>
              <p className="text-xs text-gray-400 mt-0.5">Live event log and scoreboard</p>
            </div>
            <div className="flex gap-2">
              {undoStack.length > 0 && (
                <button onClick={handleRestore}
                  className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-200 active:scale-95 transition-all">
                  ↩ Restore Last
                </button>
              )}
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                {logs.length} Events Logged
              </span>
            </div>
          </div>

          {/* School Info Banner */}
          <div className="bg-blue-600 rounded-xl px-6 py-5 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">School Details</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "School Name", value: schoolName },
                { label: "Program Name", value: programName },
                { label: "Participants", value: 50 },
              ].map((item) => (
                <div key={item.label} className="bg-blue-500 bg-opacity-50 rounded-lg px-4 py-3">
                  <p className="text-xs text-blue-200 mb-1">{item.label}</p>
                  <p className="font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center gap-4 flex-wrap">

            {/* See Scoreboard */}
            <button
              onClick={() => navigate("/scoreboard-mode1")}
              className={`font-bold text-sm px-6 py-2.5 rounded-full active:scale-95 transition-all bg-green-500 hover:bg-green-600 text-white`}>
              See Scoreboard
            </button>

            {/* Date Picker */}
            <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              <span>Date:</span>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="bg-transparent text-white text-sm font-bold focus:outline-none cursor-pointer"
              />
            </div>

            {/* Day Navigator */}
            <div className="flex items-center gap-2 bg-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold">
              <button onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
                className="hover:text-orange-200 transition-colors">‹</button>
              <span>Day {currentDay}/{totalDays}</span>
              <button onClick={() => setCurrentDay(Math.min(totalDays, currentDay + 1))}
                className="hover:text-orange-200 transition-colors">›</button>
            </div>

            <div className="ml-auto">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold px-5 py-2 rounded-lg active:scale-95 transition-all">
                + Log Event
              </button>
            </div>
          </div>

          {/* Scoreboard Panel */}
          {showScoreboard && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-700">🏆 Scoreboard</h3>
              </div>
              <div className="p-4 grid grid-cols-3 gap-3">
                {scoreboard.map((entry, i) => (
                  <div key={entry.team}
                    className={`rounded-lg px-4 py-3 border flex items-center justify-between ${i === 0 ? "bg-yellow-50 border-yellow-200" :
                        i === 1 ? "bg-gray-50 border-gray-200" :
                          i === 2 ? "bg-orange-50 border-orange-200" :
                            "bg-white border-gray-100"
                      }`}>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold">#{i + 1}</p>
                      <p className="text-sm font-bold text-gray-800">{entry.team}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-500" : i === 2 ? "text-orange-400" : "text-blue-500"
                        }`}>{entry.points}</p>
                      <p className="text-xs text-gray-400">pts</p>
                    </div>
                    {entry.points === topScore && entry.points > 0 && (
                      <span className="absolute ml-1 text-xs">🏆</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Log Form */}
          {showAddForm && (
            <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">➕ Log New Event</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Team</label>
                  <select value={newLog.team} onChange={(e) => setNewLog({ ...newLog, team: e.target.value })}
                    className={inputClass}>
                    <option value="">Select Team</option>
                    {TEAMS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Activity</label>
                  <select value={newLog.activity} onChange={(e) => setNewLog({ ...newLog, activity: e.target.value })}
                    className={inputClass}>
                    <option value="">Select Activity</option>
                    {ACTIVITIES.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Points</label>
                  <input type="number" placeholder="e.g. 10" value={newLog.points}
                    onChange={(e) => setNewLog({ ...newLog, points: e.target.value })}
                    className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowAddForm(false)}
                  className="px-4 py-1.5 text-sm font-bold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 active:scale-95 transition-all">
                  Cancel
                </button>
                <button onClick={handleAddLog}
                  className="px-5 py-1.5 text-sm font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all">
                  Add to Log
                </button>
              </div>
            </div>
          )}

          {/* Event Log Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700">
                📋 Event Log — Day {currentDay} &nbsp;
                <span className="text-gray-400 font-normal text-xs">{currentDate}</span>
              </h3>
              <span className="text-xs text-gray-400">{logs.length} entries</span>
            </div>

            {logs.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-3xl mb-3">📋</p>
                <p className="text-gray-500 text-sm font-bold">No events logged yet.</p>
                <p className="text-gray-400 text-xs mt-1">Click "+ Log Event" to add the first entry.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide text-xs">
                  <tr>
                    <th className="px-5 py-2.5 text-left font-semibold">Time</th>
                    <th className="px-5 py-2.5 text-left font-semibold">Team</th>
                    <th className="px-5 py-2.5 text-left font-semibold">Activity</th>
                    <th className="px-5 py-2.5 text-left font-semibold">Points</th>
                    <th className="px-5 py-2.5 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={log.id} className="border-t border-gray-100 hover:bg-blue-50 transition-colors">
                      <td className="px-5 py-3 text-gray-500 text-xs">{log.time}</td>
                      <td className="px-5 py-3 font-medium text-gray-800">{log.team}</td>
                      <td className="px-5 py-3 text-gray-600">{log.activity}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${log.points >= 20 ? "bg-green-100 text-green-700" :
                            log.points >= 10 ? "bg-blue-100 text-blue-700" :
                              "bg-gray-100 text-gray-600"
                          }`}>
                          +{log.points}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => handleUndo(log.id)}
                          className="bg-gray-700 hover:bg-gray-900 active:scale-95 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-all">
                          Undo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan={3} className="px-5 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Total Points
                    </td>
                    <td colSpan={2} className="px-5 py-2.5">
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {logs.reduce((sum, l) => sum + l.points, 0)} pts
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}