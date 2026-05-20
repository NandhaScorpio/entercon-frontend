import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

export default function ScoreboardMode3() {
  const [teams,         setTeams]         = useState(INITIAL_TEAMS);
  const [editingCell,   setEditingCell]   = useState(null);
  const [cellValue,     setCellValue]     = useState("");
  const [session,       setSession]       = useState("Entercon Session");
  const [school,        setSchool]        = useState("School Name");
  const [currentDay,    setCurrentDay]    = useState(4);
  const [currentMode,   setCurrentMode]   = useState(2);
  const [editingHeader, setEditingHeader] = useState(null);
  const [activePage,    setActivePage]    = useState("Search Scoreboard");
  const [darkMode,      setDarkMode]      = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);

  // ── Your original backend state ──
  const navigate = useNavigate();
  const navItems = ["Dashboard","Add Schools","Search Scoreboard","Add Users"];
  const url      = ["/dashboard","/add-school","/search-scoreboard","/add-users"];
  const location = useLocation();
  const username = location.state?.username;
  const users    = location.state?.users;
  const darkModeStatus = location.state.darkMode;
  
    useEffect(() => {
      setDarkMode(darkModeStatus);
      setCurrentMode(2);
    }, [darkModeStatus]);
  // ─────────────────────────────────

  // Dark mode classes
  const dm = {
    page:       darkMode ? "bg-gray-900 border-gray-700"          : "bg-white border-gray-300",
    title:      darkMode ? "border-gray-700 text-white"           : "border-gray-200 text-gray-900",
    sidebar:    darkMode ? "bg-gray-900 border-gray-700"          : "bg-white border-gray-400",
    text:       darkMode ? "text-gray-100"                        : "text-gray-800",
    subtext:    darkMode ? "text-gray-400"                        : "text-gray-500",
    mainBg:     darkMode ? "bg-gray-800"                          : "bg-gray-200",
    headerBar:  darkMode ? "bg-gray-700"                          : "bg-gray-300",
    headerField:darkMode ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-400 text-gray-700",
    dayBtn:     darkMode ? "bg-gray-800 border-gray-600"          : "bg-white border-gray-300",
    tableWrap:  darkMode ? "bg-gray-900 border-gray-700"          : "bg-white border-gray-300",
    thead:      darkMode ? "bg-gray-700 border-gray-600"          : "bg-gray-100 border-gray-300",
    theadText:  darkMode ? "text-gray-300 border-gray-600"        : "text-gray-600 border-gray-200",
    trowEven:   darkMode ? "bg-gray-900"                          : "bg-white",
    trowOdd:    darkMode ? "bg-gray-800"                          : "bg-gray-50",
    trowHover:  darkMode ? "hover:bg-gray-700"                    : "hover:bg-gray-50",
    tcell:      darkMode ? "border-gray-700 text-gray-200"        : "border-gray-200 text-gray-700",
    tcellBold:  darkMode ? "border-gray-700 text-gray-100"        : "border-gray-200 text-gray-800",
    editInput:  darkMode ? "bg-blue-900 border-blue-500 text-blue-100" : "bg-blue-50 border-blue-300 text-gray-800",
    hoverCell:  darkMode ? "hover:bg-gray-700"                    : "hover:bg-blue-50",
    tfoot:      darkMode ? "bg-gray-700 border-gray-600"          : "bg-gray-100 border-gray-300",
    tfootText:  darkMode ? "text-gray-300"                        : "text-gray-600",
    tfootVal:   darkMode ? "text-gray-200"                        : "text-gray-700",
    grandTotal: darkMode ? "bg-blue-900 text-blue-300"            : "bg-blue-50 text-blue-700",
    teamName:   darkMode ? "text-gray-200"                        : "text-gray-800",
    logoCircle: darkMode ? "bg-gray-700 border-gray-600"          : "bg-gray-200 border-gray-300",
  };

  // ── Your original handlers (untouched) ──
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
  // ────────────────────────────────────────

  const TotalCell = ({ value, rank }) => {
    let cls = `px-2 md:px-3 py-2 text-center font-bold text-xs md:text-sm border ${dm.tcell} `;
    if (rank === 1)                    cls += "bg-green-500 text-white";
    else if (rank === 4)               cls += "bg-green-400 text-white";
    else if (rank === 6 || rank === 8) cls += "bg-red-500   text-white";
    else if (rank === 10)              cls += "bg-green-400 text-white";
    else if (rank === 12)              cls += "bg-red-500   text-white";
    else                               cls += darkMode ? "text-gray-200 bg-transparent" : "text-gray-700 bg-transparent";
    return <td className={cls}>{value}</td>;
  };

  const EditableCell = ({ teamId, field, value }) => {
    const key       = `${teamId}-${field}`;
    const isEditing = editingCell === key;
    return (
      <td onClick={() => !isEditing && startEdit(teamId, field, value)}
        className={`border px-1 md:px-2 py-2 text-center text-xs cursor-pointer transition-colors ${dm.tcell} ${dm.hoverCell}`}>
        {isEditing ? (
          <input autoFocus type="number" value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => commitEdit(teamId, field)}
            onKeyDown={(e) => e.key === "Enter" && commitEdit(teamId, field)}
            className={`w-10 md:w-12 text-center text-xs font-bold focus:outline-none rounded border ${dm.editInput}`} />
        ) : (
          <span className="font-medium">{value}</span>
        )}
      </td>
    );
  };

  const HeaderField = ({ field, value, center }) => (
    <div onClick={() => setEditingHeader(field)}
      className={`rounded-lg px-3 py-2 flex items-center border cursor-pointer gap-1 ${dm.headerField} ${center ? "justify-center" : "justify-between"}`}>
      {editingHeader === field ? (
        <input autoFocus type="text" value={value}
          onChange={(e) => {
            if (field === "session") setSession(e.target.value);
            if (field === "school")  setSchool(e.target.value);
          }}
          onBlur={() => setEditingHeader(null)}
          onKeyDown={(e) => e.key === "Enter" && setEditingHeader(null)}
          className={`text-xs font-bold w-full focus:outline-none bg-transparent text-center ${darkMode ? "text-gray-100" : "text-gray-700"}`} />
      ) : (
        <span className={`text-xs font-bold truncate ${darkMode ? "text-gray-100" : "text-gray-700"} ${center ? "text-center w-full" : ""}`}>{value}</span>
      )}
      {editingHeader !== field && <span className="text-gray-400 text-xs shrink-0">✏️</span>}
    </div>
  );

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
                navigate(url[index], { state: { username: username, users: users, school: school, schoolName: location.state.schoolName, programName: location.state.programName, darkMode: darkMode } });
              }}
              className={`text-left text-sm font-mono transition-all duration-150 hover:text-blue-500 ${
                activePage === item ? "text-blue-500 font-bold" : dm.text
              }`}>
              {item}
            </button>
          ))}
        </div>

        {/* ── Main Content ── */}
        <div className={`flex-1 px-3 md:px-4 py-3 md:py-4 flex flex-col gap-3 ${dm.mainBg}`}>

          {/* Header Bar */}
          <div className={`rounded-xl p-3 flex flex-col gap-2 ${dm.headerBar}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
              <HeaderField field="session" value={session} />
              <HeaderField field="school"  value={school}  center />
              <div className="flex items-center gap-2">
                <div className={`flex-1 rounded-lg px-3 py-2 border flex items-center justify-between ${dm.dayBtn}`}>
                  <button onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
                    className={`font-bold hover:text-blue-500 transition-colors ${dm.subtext}`}>‹</button>
                  <span className={`text-xs font-bold ${darkMode ? "text-gray-100" : "text-gray-700"}`}>
                    Day Selector Bar
                  </span>
                  <button onClick={() => setCurrentDay(Math.min(DAYS.length - 1, currentDay + 1))}
                    className={`font-bold hover:text-blue-500 transition-colors ${dm.subtext}`}>›</button>
                </div>
                {/* Your original navigate call preserved */}
                <button onClick={() => { navigate("/scoreboard-mode1", {state: { username: username, users: users, school: school, schoolName: location.state.schoolName, programName: location.state.programName, darkMode: darkMode, }}); }}
                  className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all whitespace-nowrap">
                  {MODES[currentMode]} ↺
                </button>
              </div>
            </div>
          </div>

          {/* Main Table — always scrollable horizontally */}
          <div className={`flex-1 overflow-x-auto rounded-xl border shadow-sm ${dm.tableWrap}`}>
            <table className="border-collapse text-xs" style={{ minWidth: "700px" }}>
              <thead>
                <tr className={`border-b-2 ${dm.thead}`}>
                  <th className={`border px-2 py-2 text-left font-bold w-10 ${dm.theadText}`}>Rank</th>
                  <th className={`border px-2 py-2 text-left font-bold w-8  ${dm.theadText}`}>Lev</th>
                  <th className={`border px-3 py-2 text-left font-bold w-32 ${dm.theadText}`}>Team Name</th>
                  {DAYS.map((d) => (
                    <th key={d} className={`border px-2 md:px-3 py-2 text-center font-bold ${dm.theadText}`}>{d}</th>
                  ))}
                  <th className={`border px-2 md:px-3 py-2 text-center font-bold ${dm.theadText}`}>HW Score</th>
                  <th className={`border px-2 md:px-3 py-2 text-center font-bold ${dm.theadText}`}>Total All Days</th>
                </tr>
              </thead>

              <tbody>
                {sorted.map((team, idx) => {
                  const rank  = idx + 1;
                  const total = totalAllDays(team);
                  return (
                    <tr key={team.id}
                      className={`border-b transition-colors ${dm.trowHover} ${idx % 2 === 0 ? dm.trowEven : dm.trowOdd}`}>

                      {/* Rank */}
                      <td className={`border px-2 py-2 text-center font-bold ${dm.tcellBold}`}>{rank}</td>

                      {/* Level — click to cycle */}
                      <td className={`border px-2 py-2 text-center cursor-pointer ${dm.tcell}`}
                        onClick={() => cycleLevel(team.id)}>
                        <LevelIcon level={team.level} />
                      </td>

                      {/* Logo + Team Name */}
                      <td className={`border px-2 py-2 ${dm.tcell}`}>
                        <div className="flex items-center gap-1.5 md:gap-2">
                          <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center shrink-0 shadow-sm ${dm.logoCircle}`}>
                            <span className="text-xs">🏫</span>
                          </div>
                          <span className={`font-medium text-xs leading-tight ${dm.teamName}`}>{team.name}</span>
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

              {/* Footer Totals */}
              <tfoot>
                <tr className={`border-t-2 ${dm.tfoot}`}>
                  <td colSpan={3} className={`border px-3 py-2 font-bold text-xs uppercase tracking-wide ${dm.tfootText}`}>
                    Column Total
                  </td>
                  {DAYS.map((_, di) => (
                    <td key={di} className={`border px-2 md:px-3 py-2 text-center font-bold ${dm.tfootVal}`}>
                      {sorted.reduce((s, t) => s + (t.scores[di + 1] || 0), 0)}
                    </td>
                  ))}
                  <td className={`border px-2 md:px-3 py-2 text-center font-bold ${dm.tfootVal}`}>
                    {sorted.reduce((s, t) => s + t.hwScore, 0)}
                  </td>
                  <td className={`border px-2 md:px-3 py-2 text-center font-bold ${dm.grandTotal}`}>
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