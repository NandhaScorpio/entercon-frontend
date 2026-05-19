import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TEAMS = [
  { id: 1,  shortName: "Team 1 - LL" },
  { id: 2,  shortName: "Team 2 - KK" },
  { id: 3,  shortName: "Team 3"      },
  { id: 4,  shortName: "Team 4"      },
  { id: 5,  shortName: "Team 5"      },
  { id: 6,  shortName: "Team 6"      },
  { id: 7,  shortName: "Team 7"      },
  { id: 8,  shortName: "Team 8"      },
  { id: 9,  shortName: "Team 9"      },
  { id: 10, shortName: "Team 10"     },
  { id: 11, shortName: "Team 11"     },
  { id: 12, shortName: "Team 12"     },
];

const TASKS = [
  { id: 1, name: "Rocket Launch",       color: "bg-pink-400   text-white"      },
  { id: 2, name: "Hunt the Wolf",       color: "bg-yellow-400 text-gray-800"   },
  { id: 3, name: "Talking first",       color: "bg-cyan-400   text-white"      },
  { id: 4, name: "Encouragement Points",color: "bg-green-400  text-white"      },
];

const INITIAL_SCORES = {
  1:  { 1: 50,   2: 10,   3: 5,  4: 20   },
  2:  { 1: 100,  2: null, 3: 5,  4: null },
  3:  { 1: null, 2: 10,   3: 5,  4: null },
  4:  { 1: 25,   2: null, 3: 5,  4: 10   },
  5:  { 1: null, 2: null, 3: 5,  4: null },
  6:  { 1: 30,   2: 20,   3: 5,  4: null },
  7:  { 1: null, 2: 40,   3: 5,  4: null },
  8:  { 1: 10,   2: null, 3: 5,  4: null },
  9:  { 1: 15,   2: 30,   3: 5,  4: null },
  10: { 1: null, 2: 25,   3: 5,  4: 30   },
  11: { 1: 45,   2: null, 3: 5,  4: 10   },
  12: { 1: 80,   2: 5,    3: 5,  4: 5    },
};

const DAYS  = ["Day 1","Day 2","Day 3","Day 4","Day 5"];
const MODES = ["Mode 1","Mode 2","Mode 3"];

export default function ScoreboardMode2() {
  const [scores,        setScores]        = useState(INITIAL_SCORES);
  const [editingCell,   setEditingCell]   = useState(null);
  const [cellValue,     setCellValue]     = useState("");
  const [currentDay,    setCurrentDay]    = useState(0);
  const [currentMode,   setCurrentMode]   = useState(1);
  const [session,       setSession]       = useState("Entercon Session");
  const [school,        setSchool]        = useState("School Name");
  const [program,       setProgram]       = useState("Program Name");
  const [editingHeader, setEditingHeader] = useState(null);
  const [darkMode,      setDarkMode]      = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);

  // ── Your original backend state ──
  const navItems = ["Dashboard","Add Schools","Search Scoreboard","Add Users"];
  const [activePage, setActivePage] = useState("Search Scoreboard");
  const url      = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"];
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username;
  const users    = location.state?.users;
  const schools  = location.state?.school;
  const darkModeStatus = location.state.darkMode;
  
    useEffect(() => {
      setDarkMode(darkModeStatus);
    }, [darkModeStatus]);
  // ─────────────────────────────────

  // Dark mode classes
  const dm = {
    page:      darkMode ? "bg-gray-900 border-gray-700"        : "bg-white border-gray-300",
    title:     darkMode ? "border-gray-700 text-white"         : "border-gray-200 text-gray-900",
    sidebar:   darkMode ? "bg-gray-900 border-gray-700"        : "bg-white border-gray-400",
    text:      darkMode ? "text-gray-100"                      : "text-gray-800",
    subtext:   darkMode ? "text-gray-400"                      : "text-gray-500",
    mainBg:    darkMode ? "bg-gray-800"                        : "bg-gray-200",
    headerBg:  darkMode ? "bg-gray-700"                        : "bg-gray-300",
    headerField: darkMode ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-700",
    teamHead:  darkMode ? "bg-gray-600 border-gray-500 text-gray-100" : "bg-gray-300 border-gray-400 text-gray-700",
    logoCell:  darkMode ? "bg-gray-600 border-gray-500"        : "bg-gray-300 border-gray-400",
    logoCircle:darkMode ? "bg-gray-800 border-gray-500"        : "bg-white border-gray-400",
    scoreCell: darkMode ? "bg-gray-800 border-gray-600 hover:bg-gray-700" : "bg-white border-gray-300 hover:bg-blue-50",
    scoreNull: darkMode ? "text-gray-600"                      : "text-gray-300",
    scoreVal:  darkMode ? "text-gray-100"                      : "text-gray-800",
    editCell:  darkMode ? "bg-blue-900 text-blue-100"          : "bg-blue-50 text-gray-800",
    totalRow:  darkMode ? "bg-gray-900 border-gray-700"        : "bg-gray-800 border-gray-600",
    footerBar: darkMode ? "bg-gray-900"                        : "bg-gray-800",
    grandLabel:darkMode ? "text-gray-500"                      : "text-gray-400",
  };

  // ── Your original handlers (untouched) ──
  const getScore   = (teamId, taskId) => scores[teamId]?.[taskId] ?? null;
  const getTotal   = (teamId) => TASKS.reduce((s, t) => s + (getScore(teamId, t.id) ?? 0), 0);
  const taskTotal  = (taskId) => TEAMS.reduce((s, t) => s + (getScore(t.id, taskId) ?? 0), 0);
  const grandTotal = () => TEAMS.reduce((s, t) => s + getTotal(t.id), 0);

  const startEdit = (teamId, taskId, val) => {
    setEditingCell(`${teamId}-${taskId}`);
    setCellValue(val === null ? "" : String(val));
  };

  const commitEdit = (teamId, taskId) => {
    const parsed = cellValue === "" ? null : parseInt(cellValue);
    setScores((prev) => ({
      ...prev,
      [teamId]: { ...prev[teamId], [taskId]: isNaN(parsed) ? null : parsed },
    }));
    setEditingCell(null);
  };
  // ────────────────────────────────────────

  const HeaderField = ({ field, value, center }) => (
    <div onClick={() => setEditingHeader(field)}
      className={`rounded-lg px-3 py-2 flex items-center border cursor-pointer gap-1 ${dm.headerField} ${center ? "justify-center" : "justify-between"}`}>
      {editingHeader === field ? (
        <input autoFocus type="text" value={value}
          onChange={(e) => {
            if (field === "session") setSession(e.target.value);
            if (field === "school")  setSchool(e.target.value);
            if (field === "program") setProgram(e.target.value);
          }}
          onBlur={() => setEditingHeader(null)}
          onKeyDown={(e) => e.key === "Enter" && setEditingHeader(null)}
          className={`text-xs font-bold w-full focus:outline-none bg-transparent text-center ${dm.text}`} />
      ) : (
        <span className={`text-xs font-bold truncate ${dm.text} ${center ? "text-center w-full" : ""}`}>{value}</span>
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
                navigate(url[index], { state: { username, users, school: schools } });
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
          <div className={`rounded-xl p-3 flex flex-col gap-2 ${dm.headerBg}`}>

            {/* Row 1: Session | School | Day+Mode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
              <HeaderField field="session" value={session} />
              <HeaderField field="school"  value={school}  center />
              <div className="flex items-center gap-2">
                <div className={`flex-1 rounded-lg px-3 py-2 border flex items-center justify-between ${dm.headerField}`}>
                  <button onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
                    className={`font-bold hover:text-blue-500 transition-colors ${dm.subtext}`}>‹</button>
                  <span className={`text-xs font-bold ${dm.text}`}>{DAYS[currentDay]}</span>
                  <button onClick={() => setCurrentDay(Math.min(DAYS.length - 1, currentDay + 1))}
                    className={`font-bold hover:text-blue-500 transition-colors ${dm.subtext}`}>›</button>
                </div>
                {/* Your original navigate call preserved */}
                <button onClick={() => { navigate("/scoreboard-mode3", { state: { username: username, users: users, school: school, schoolName: location.state.schoolName, programName: location.state.programName, darkMode: darkMode } }); }}
                  className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all whitespace-nowrap">
                  {MODES[currentMode]} ↺
                </button>
              </div>
            </div>

            {/* Row 2: Program */}
            <div className="mx-0 md:mx-20">
              <HeaderField field="program" value={program} center />
            </div>
          </div>

          {/* Scoreboard Table — always scrollable horizontally */}
          <div className="flex-1 overflow-x-auto rounded-xl">
            <table className="border-collapse text-xs" style={{ minWidth: `${TEAMS.length * 68 + 90}px` }}>

              {/* Team Header */}
              <thead>
                <tr>
                  {TEAMS.map((team) => (
                    <th key={team.id}
                      className={`border px-1 py-1.5 text-center font-bold text-xs w-16 ${dm.teamHead}`}>
                      <span className="block truncate w-14 mx-auto">{team.shortName}</span>
                    </th>
                  ))}
                  <th className="bg-pink-500 border border-pink-600 px-2 py-1.5 text-white font-bold text-xs w-20">
                    Tasks
                  </th>
                </tr>

                {/* Logo Row */}
                <tr>
                  {TEAMS.map((team) => (
                    <td key={team.id} className={`border px-1 py-2 text-center ${dm.logoCell}`}>
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center mx-auto shadow-sm ${dm.logoCircle}`}>
                        <span className="text-sm md:text-lg">🏫</span>
                      </div>
                    </td>
                  ))}
                  <td className="bg-pink-500 border border-pink-600" />
                </tr>
              </thead>

              {/* Score Rows */}
              <tbody>
                {TASKS.map((task) => (
                  <tr key={task.id}>
                    {TEAMS.map((team) => {
                      const val       = getScore(team.id, task.id);
                      const cellKey   = `${team.id}-${task.id}`;
                      const isEditing = editingCell === cellKey;
                      return (
                        <td key={team.id}
                          onClick={() => !isEditing && startEdit(team.id, task.id, val)}
                          className={`border px-1 py-2 text-center cursor-pointer transition-colors ${dm.scoreCell}`}>
                          {isEditing ? (
                            <input autoFocus type="number" value={cellValue}
                              onChange={(e) => setCellValue(e.target.value)}
                              onBlur={() => commitEdit(team.id, task.id)}
                              onKeyDown={(e) => e.key === "Enter" && commitEdit(team.id, task.id)}
                              className={`w-12 text-center text-xs font-bold focus:outline-none rounded border border-blue-300 ${dm.editCell}`}
                            />
                          ) : (
                            <span className={`font-bold ${val === null ? dm.scoreNull : dm.scoreVal}`}>
                              {val === null ? "—" : val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className={`border border-gray-200 px-2 py-2 font-bold text-xs ${task.color}`}>
                      {task.name}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr>
                  {TEAMS.map((team) => (
                    <td key={team.id} className={`border px-1 py-2 text-center ${dm.totalRow}`}>
                      <span className="font-bold text-white text-sm">{getTotal(team.id)}</span>
                    </td>
                  ))}
                  <td className="bg-orange-500 border border-orange-600 px-2 py-2 text-center">
                    <span className="font-bold text-white text-sm">Total</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Summary — 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {TASKS.map((task) => (
              <div key={task.id} className={`rounded-xl px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-between ${task.color}`}>
                <span className="text-xs font-bold leading-tight">{task.name}</span>
                <span className="text-sm font-bold ml-2 shrink-0">{taskTotal(task.id)}</span>
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div className={`rounded-xl px-4 md:px-5 py-3 flex items-center justify-between text-white ${dm.footerBar}`}>
            <span className={`text-xs font-bold uppercase tracking-widest ${dm.grandLabel}`}>Grand Total</span>
            <span className="text-lg md:text-xl font-bold">{grandTotal()} pts</span>
          </div>

        </div>
      </div>
    </div>
  );
}