import { useState } from "react";
import { useNavigate } from "react-router-dom"

const INITIAL_TEAMS = [
  { id: 1,  name: "Resilient Rhinos",     level: "up",   scores: { 1: 80, 2: 90, 3: 60, 4: 50, 5: 70 }, hwScore: 700 },
  { id: 2,  name: "Truthful Tigers",      level: "same", scores: { 1: 70, 2: 65, 3: 60, 4: 55, 5: 85 }, hwScore: 690 },
  { id: 3,  name: "Humble Hyenas",        level: "same", scores: { 1: 75, 2: 80, 3: 80, 4: 55, 5: 85 }, hwScore: 600 },
  { id: 4,  name: "Brave Bisons",         level: "up",   scores: { 1: 75, 2: 75, 3: 75, 4: 50, 5: 50 }, hwScore: 625 },
  { id: 5,  name: "Disciplined Dragons",  level: "down", scores: { 1: 70, 2: 70, 3: 80, 4: 45, 5: 50 }, hwScore: 600 },
  { id: 6,  name: "Kind Kangaroos",       level: "down", scores: { 1: 60, 2: 70, 3: 75, 4: 50, 5: 50 }, hwScore: 580 },
  { id: 7,  name: "Compassionate Cobras", level: "same", scores: { 1: 65, 2: 60, 3: 70, 4: 45, 5: 45 }, hwScore: 580 },
  { id: 8,  name: "Grateful Gorillas",    level: "down", scores: { 1: 60, 2: 65, 3: 70, 4: 45, 5: 45 }, hwScore: 570 },
  { id: 9,  name: "Positive Peacocks",    level: "same", scores: { 1: 55, 2: 60, 3: 65, 4: 45, 5: 50 }, hwScore: 550 },
  { id: 10, name: "Loyal Lions",          level: "up",   scores: { 1: 50, 2: 50, 3: 60, 4: 45, 5: 60 }, hwScore: 550 },
  { id: 11, name: "Resilient Rhinos B",   level: "same", scores: { 1: 50, 2: 45, 3: 55, 4: 60, 5: 50 }, hwScore: 550 },
  { id: 12, name: "Fierce Falcons",       level: "down", scores: { 1: 45, 2: 40, 3: 50, 4: 40, 5: 40 }, hwScore: 500 },
];

const DAYS  = ["Day 1","Day 2","Day 3","Day 4","Day 5"];
const MODES = ["Mode 1","Mode 2","Mode 3"];

const totalAllDays = (team) =>
  Object.values(team.scores).reduce((s, v) => s + v, 0) + team.hwScore;

const LevelIcon = ({ level }) => {
  if (level === "up")   return <span className="text-green-500 text-base">▲</span>;
  if (level === "down") return <span className="text-red-500   text-base">▼</span>;
  return <span className="text-gray-400 font-bold text-base">—</span>;
};

const TotalCell = ({ value, rank }) => {
  let cls = "px-3 py-2 text-center font-bold text-sm ";
  if (rank === 1)                   cls += "bg-green-500  text-white";
  else if (rank === 4)              cls += "bg-green-400  text-white";
  else if (rank === 6 || rank === 8)cls += "bg-red-500    text-white";
  else if (rank === 10)             cls += "bg-green-400  text-white";
  else if (rank === 12)             cls += "bg-red-500    text-white";
  else                              cls += "text-gray-700 bg-transparent";
  return <td className={cls}>{value}</td>;
};

export default function ScoreboardMode3() {
  const [teams,        setTeams]        = useState(INITIAL_TEAMS);
  const [editingCell,  setEditingCell]  = useState(null);
  const [cellValue,    setCellValue]    = useState("");
  const [session,      setSession]      = useState("Entercon Session");
  const [school,       setSchool]       = useState("School Name");
  const [currentDay,   setCurrentDay]   = useState(4);
  const [currentMode,  setCurrentMode]  = useState(2);
  const [editingHeader,setEditingHeader]= useState(null);
  const [activePage,   setActivePage]   = useState("Search Scoreboard");

  const navigate = useNavigate();
  const navItems = ["Dashboard","Add Schools","Search Scoreboard","Add Users"];
  const url = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"];  

  const startEdit = (teamId, field, val) => {
    setEditingCell(`${teamId}-${field}`);
    setCellValue(val === null ? "" : String(val));
  };

  const commitEdit = (teamId, field) => {
    const parsed = parseInt(cellValue);
    setTeams((prev) => prev.map((t) => {
      if (t.id !== teamId) return t;
      if (field === "hw") return { ...t, hwScore: isNaN(parsed) ? t.hwScore : parsed };
      const dayNum = parseInt(field);
      return { ...t, scores: { ...t.scores, [dayNum]: isNaN(parsed) ? t.scores[dayNum] : parsed } };
    }));
    setEditingCell(null);
  };

  const cycleLevel = (teamId) => {
    const order = ["up","same","down"];
    setTeams((prev) => prev.map((t) => {
      if (t.id !== teamId) return t;
      const next = order[(order.indexOf(t.level) + 1) % order.length];
      return { ...t, level: next };
    }));
  };

  const sorted = [...teams].sort((a, b) => totalAllDays(b) - totalAllDays(a));

  const HeaderField = ({ field, value, center }) => (
    <div onClick={() => setEditingHeader(field)}
      className={`bg-white rounded-lg px-3 py-2 flex items-center border border-gray-400 cursor-pointer gap-1 ${center ? "justify-center" : "justify-between"}`}>
      {editingHeader === field ? (
        <input autoFocus type="text" value={value}
          onChange={(e) => {
            if (field === "session") setSession(e.target.value);
            if (field === "school")  setSchool(e.target.value);
          }}
          onBlur={() => setEditingHeader(null)}
          onKeyDown={(e) => e.key === "Enter" && setEditingHeader(null)}
          className="text-xs font-bold text-gray-700 w-full focus:outline-none bg-transparent text-center" />
      ) : (
        <span className={`text-xs font-bold text-gray-700 truncate ${center ? "text-center w-full" : ""}`}>{value}</span>
      )}
      {editingHeader !== field && <span className="text-gray-300 text-xs shrink-0">✏️</span>}
    </div>
  );

  const EditableCell = ({ teamId, field, value }) => {
    const key = `${teamId}-${field}`;
    const isEditing = editingCell === key;
    return (
      <td onClick={() => !isEditing && startEdit(teamId, field, value)}
        className="border border-gray-200 px-2 py-2 text-center text-xs text-gray-700 cursor-pointer hover:bg-blue-50 transition-colors">
        {isEditing ? (
          <input autoFocus type="number" value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => commitEdit(teamId, field)}
            onKeyDown={(e) => e.key === "Enter" && commitEdit(teamId, field)}
            className="w-12 text-center text-xs font-bold focus:outline-none bg-blue-50 rounded border border-blue-300" />
        ) : (
          <span className="font-medium">{value}</span>
        )}
      </td>
    );
  };

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
        <div className="flex-1 px-4 py-4 bg-gray-200 flex flex-col gap-3">

          {/* Header Bar */}
          <div className="bg-gray-300 rounded-xl p-3 flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-3">
              <HeaderField field="session" value={session} />
              <HeaderField field="school"  value={school}  center />
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white rounded-lg px-3 py-2 border border-gray-300 flex items-center justify-between">
                  <button onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
                    className="text-gray-500 hover:text-blue-500 font-bold">‹</button>
                  <span className="text-xs font-bold text-gray-700">Day Selector Bar</span>
                  <button onClick={() => setCurrentDay(Math.min(DAYS.length - 1, currentDay + 1))}
                    className="text-gray-500 hover:text-blue-500 font-bold">›</button>
                </div>
                <button onClick={() => {navigate("/scoreboard-mode1")}}
                  className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all whitespace-nowrap">
                  {MODES[currentMode]} ↺
                </button>
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="flex-1 overflow-x-auto bg-white rounded-xl border border-gray-300 shadow-sm">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="border border-gray-200 px-2 py-2 text-left font-bold text-gray-600 w-10">Rank</th>
                  <th className="border border-gray-200 px-2 py-2 text-left font-bold text-gray-600 w-8">Lev</th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-bold text-gray-600 w-32">Team Name</th>
                  {DAYS.map((d) => (
                    <th key={d} className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-600">{d}</th>
                  ))}
                  <th className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-600">HW Score</th>
                  <th className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-600">Total All Days</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((team, idx) => {
                  const rank  = idx + 1;
                  const total = totalAllDays(team);
                  return (
                    <tr key={team.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>

                      {/* Rank */}
                      <td className="border border-gray-200 px-2 py-2 text-center font-bold text-gray-700">{rank}</td>

                      {/* Level Icon — click to cycle */}
                      <td className="border border-gray-200 px-2 py-2 text-center cursor-pointer"
                        onClick={() => cycleLevel(team.id)}>
                        <LevelIcon level={team.level} />
                      </td>

                      {/* Logo + Team Name */}
                      <td className="border border-gray-200 px-2 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center shrink-0 shadow-sm">
                            <span className="text-xs">🏫</span>
                          </div>
                          <span className="font-medium text-gray-800 text-xs leading-tight">{team.name}</span>
                        </div>
                      </td>

                      {/* Day Scores */}
                      {DAYS.map((_, di) => (
                        <EditableCell key={di} teamId={team.id} field={String(di + 1)} value={team.scores[di + 1]} />
                      ))}

                      {/* HW Score */}
                      <EditableCell teamId={team.id} field="hw" value={team.hwScore} />

                      {/* Total */}
                      <TotalCell value={total} rank={rank} />
                    </tr>
                  );
                })}
              </tbody>

              {/* Footer Totals Row */}
              <tfoot>
                <tr className="bg-gray-100 border-t-2 border-gray-300">
                  <td colSpan={3} className="border border-gray-200 px-3 py-2 font-bold text-gray-600 text-xs uppercase tracking-wide">
                    Column Total
                  </td>
                  {DAYS.map((_, di) => (
                    <td key={di} className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-700">
                      {sorted.reduce((s, t) => s + (t.scores[di + 1] || 0), 0)}
                    </td>
                  ))}
                  <td className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-700">
                    {sorted.reduce((s, t) => s + t.hwScore, 0)}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-center font-bold text-blue-700 bg-blue-50">
                    {sorted.reduce((s, t) => s + totalAllDays(t), 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}