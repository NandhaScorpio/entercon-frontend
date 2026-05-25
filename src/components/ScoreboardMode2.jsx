import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DAYS = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];
const MODES = ["Mode 1", "Mode 2", "Mode 3"];

export default function ScoreboardMode2() {
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [scores, setScores] = useState({});
  const [currentDay, setCurrentDay] = useState(0);
  const [currentMode, setCurrentMode] = useState(1);
  const [session, setSession] = useState("Entercon Session");
  const [school, setSchool] = useState("School Name");
  const [program, setProgram] = useState("Program Name");
  const [editingHeader, setEditingHeader] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Your original backend state ──
  const navItems = [
    "Dashboard",
    "Add Schools",
    "Search Scoreboard",
    "Add Users",
  ];
  const [activePage, setActivePage] = useState("Search Scoreboard");
  const url = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"];
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username;
  const users = location.state?.users;
  const schools = location.state?.school;
  const darkModeStatus = location.state.darkMode || window.getItem("darkMode");
  const schoolName = location.state.schoolName;
  const programName = location.state.programName;

  useEffect(() => {
    setDarkMode(darkModeStatus);
    setCurrentMode(1);

    const matchingSchool = schools.find(
      (s) => s.schoolName === schoolName && s.programName === programName,
    );

    if (!matchingSchool) return;

    // Teams
    setTeams(
      matchingSchool.teamNames.map((team, index) => ({
        id: index + 1,
        shortName: team.name,
      })),
    );

    // Logs till current day
    const selectedLogs = matchingSchool.eventLog.slice(0, currentDay + 1);

    // Unique tasks
    const uniqueTasks = [
      ...new Set(selectedLogs.flatMap((day) => day.map((log) => log.events))),
    ];

    const formattedTasks = uniqueTasks.map((task, index) => ({
      id: index + 1,
      name: task,
      color: [
        "bg-pink-400 text-white",
        "bg-yellow-400 text-gray-800",
        "bg-cyan-400 text-white",
        "bg-green-400 text-white",
        "bg-orange-400 text-white",
      ][index % 5],
    }));

    setTasks(formattedTasks);

    // Build scores object
    const generatedScores = {};

    matchingSchool.teamNames.forEach((team, teamIndex) => {
      generatedScores[teamIndex + 1] = {};

      formattedTasks.forEach((task) => {
        generatedScores[teamIndex + 1][task.id] = 0;
      });
    });

    // Add points
    selectedLogs.forEach((dayLogs) => {
      dayLogs.forEach((log) => {
        const teamIndex = matchingSchool.teamNames.findIndex(
          (team) =>
            team.name.trim().toLowerCase() === log.team.trim().toLowerCase(),
        );

        const taskIndex = formattedTasks.findIndex(
          (task) => task.name === log.events,
        );

        if (teamIndex !== -1 && taskIndex !== -1) {
          generatedScores[teamIndex + 1][taskIndex + 1] += log.points;
        }
      });
    });

    setScores(generatedScores);
  }, [darkModeStatus, schools, schoolName, programName, currentDay]);
  // ─────────────────────────────────

  // Dark mode classes
  const dm = {
    page: darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300",
    title: darkMode
      ? "border-gray-700 text-white"
      : "border-gray-200 text-gray-900",
    sidebar: darkMode
      ? "bg-gray-900 border-gray-700"
      : "bg-white border-gray-400",
    text: darkMode ? "text-gray-100" : "text-gray-800",
    subtext: darkMode ? "text-gray-400" : "text-gray-500",
    mainBg: darkMode ? "bg-gray-800" : "bg-gray-200",
    headerBg: darkMode ? "bg-gray-700" : "bg-gray-300",
    headerField: darkMode
      ? "bg-gray-800 border-gray-600 text-gray-100"
      : "bg-white border-gray-300 text-gray-700",
    teamHead: darkMode
      ? "bg-gray-600 border-gray-500 text-gray-100"
      : "bg-gray-300 border-gray-400 text-gray-700",
    logoCell: darkMode
      ? "bg-gray-600 border-gray-500"
      : "bg-gray-300 border-gray-400",
    logoCircle: darkMode
      ? "bg-gray-800 border-gray-500"
      : "bg-white border-gray-400",
    scoreCell: darkMode
      ? "bg-gray-800 border-gray-600 hover:bg-gray-700"
      : "bg-white border-gray-300 hover:bg-blue-50",
    scoreNull: darkMode ? "text-gray-600" : "text-gray-300",
    scoreVal: darkMode ? "text-gray-100" : "text-gray-800",
    editCell: darkMode
      ? "bg-blue-900 text-blue-100"
      : "bg-blue-50 text-gray-800",
    totalRow: darkMode
      ? "bg-gray-900 border-gray-700"
      : "bg-gray-800 border-gray-600",
    footerBar: darkMode ? "bg-gray-900" : "bg-gray-800",
    grandLabel: darkMode ? "text-gray-500" : "text-gray-400",
  };

  // ── Your original handlers (untouched) ──
  const getScore = (teamId, taskId) => scores[teamId]?.[taskId] ?? null;
  const getTotal = (teamId) =>
    tasks.reduce((s, t) => s + (getScore(teamId, t.id) ?? 0), 0);
  const taskTotal = (taskId) =>
    teams.reduce((s, t) => s + (getScore(t.id, taskId) ?? 0), 0);
  const grandTotal = () => teams.reduce((s, t) => s + getTotal(t.id), 0);

  // ────────────────────────────────────────

  const HeaderField = ({ field, value, center }) => (
    <div
      onClick={() => setEditingHeader(field)}
      className={`rounded-lg px-3 py-2 flex items-center border cursor-pointer gap-1 ${dm.headerField} ${center ? "justify-center" : "justify-between"}`}
    >
      {editingHeader === field ? (
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => {
            if (field === "session") setSession(e.target.value);
            if (field === "school") setSchool(e.target.value);
            if (field === "program") setProgram(e.target.value);
          }}
          onBlur={() => setEditingHeader(null)}
          onKeyDown={(e) => e.key === "Enter" && setEditingHeader(null)}
          className={`text-xs font-bold w-full focus:outline-none bg-transparent text-center ${dm.text}`}
        />
      ) : (
        <span
          className={`text-xs font-bold truncate ${dm.text} ${center ? "text-center w-full" : ""}`}
        >
          {value}
        </span>
      )}
      {editingHeader !== field && (
        <span className="text-gray-400 text-xs shrink-0">✏️</span>
      )}
    </div>
  );

  return (
    <div
      className={`min-h-screen border-2 border-dashed rounded-xl font-mono transition-colors duration-300 ${dm.page}`}
    >
      {/* ── Top Bar ── */}
      <div
        className={`flex items-center justify-between px-4 py-4 border-b ${dm.title}`}
      >
        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1
          className={`text-base md:text-xl font-bold text-center flex-1 ${dm.title}`}
        >
          Welcome to Entercon Score Page!
        </h1>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
            darkMode
              ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-73px)] relative">
        {/* ── Mobile Overlay ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <div
          className={`
          fixed md:static z-50 top-0 left-0 h-full
          w-64 md:w-56 shrink-0
          flex flex-col gap-6 px-6 py-8
          border-r transition-transform duration-300
          ${dm.sidebar}
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
        `}
        >
          <div className="flex items-center justify-between md:hidden mb-2">
            <span className={`text-sm font-bold ${dm.text}`}>Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>
          </div>

          {navItems.map((item, index) => (
            <button
              key={item}
              onClick={() => {
                setActivePage(item);
                setSidebarOpen(false);
                navigate(url[index], {
                  state: {
                    username,
                    users,
                    school: schools,
                    schoolName,
                    programName,
                    darkMode,
                  },
                });
              }}
              className={`text-left text-sm font-mono transition-all duration-150 hover:text-blue-500 ${
                activePage === item ? "text-blue-500 font-bold" : dm.text
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* ── Main Content ── */}
        <div
          className={`flex-1 px-3 md:px-4 py-3 md:py-4 flex flex-col gap-3 ${dm.mainBg}`}
        >
          {/* Header Bar */}
          <div className={`rounded-xl p-3 flex flex-col gap-2 ${dm.headerBg}`}>
            {/* Row 1: Session | School | Day+Mode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
              <HeaderField field="session" value={session} />
              <HeaderField field="school" value={school} center />
              <div className="flex items-center gap-2">
                <div
                  className={`flex-1 rounded-lg px-3 py-2 border flex items-center justify-between ${dm.headerField}`}
                >
                  <button
                    onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
                    className={`font-bold hover:text-blue-500 transition-colors ${dm.subtext}`}
                  >
                    ‹
                  </button>
                  <span className={`text-xs font-bold ${dm.text}`}>
                    {DAYS[currentDay]}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentDay(Math.min(DAYS.length - 1, currentDay + 1))
                    }
                    className={`font-bold hover:text-blue-500 transition-colors ${dm.subtext}`}
                  >
                    ›
                  </button>
                </div>
                {/* Your original navigate call preserved */}
                <button
                  onClick={() => {
                    navigate("/scoreboard-mode3", {
                      state: {
                        username: username,
                        users: users,
                        school: school,
                        schoolName: location.state.schoolName,
                        programName: location.state.programName,
                        darkMode: darkMode,
                      },
                    });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all whitespace-nowrap"
                >
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
            <table
              className="border-collapse text-xs"
              style={{ minWidth: `${teams.length * 68 + 90}px` }}
            >
              {/* Team Header */}
              <thead>
                <tr>
                  {teams.map((team) => (
                    <th
                      key={team.id}
                      className={`border px-1 py-1.5 text-center font-bold text-xs w-16 ${dm.teamHead}`}
                    >
                      <span className="block truncate w-14 mx-auto">
                        {team.shortName}
                      </span>
                    </th>
                  ))}
                  <th className="bg-pink-500 border border-pink-600 px-2 py-1.5 text-white font-bold text-xs w-20">
                    Tasks
                  </th>
                </tr>

                {/* Logo Row */}
                <tr>
                  {teams.map((team) => (
                    <td
                      key={team.id}
                      className={`border px-1 py-2 text-center ${dm.logoCell}`}
                    >
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center mx-auto shadow-sm ${dm.logoCircle}`}
                      >
                        <span className="text-sm md:text-lg">🏫</span>
                      </div>
                    </td>
                  ))}
                  <td className="bg-pink-500 border border-pink-600" />
                </tr>
              </thead>

              {/* Score Rows */}
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    {teams.map((team) => {
                      const val = getScore(team.id, task.id);
                      return (
                        <td
                          key={team.id}
                          className={`border px-1 py-2 text-center cursor-pointer transition-colors ${dm.scoreCell}`}
                        >
                          <span
                            className={`font-bold ${
                              val === 0 ? dm.scoreNull : dm.scoreVal
                            }`}
                          >
                            {val === 0 ? "—" : val}
                          </span>
                        </td>
                      );
                    })}
                    <td
                      className={`border border-gray-200 px-2 py-2 font-bold text-xs ${task.color}`}
                    >
                      {task.name}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr>
                  {teams.map((team) => (
                    <td
                      key={team.id}
                      className={`border px-1 py-2 text-center ${dm.totalRow}`}
                    >
                      <span className="font-bold text-white text-sm">
                        {getTotal(team.id)}
                      </span>
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
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-xl px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-between ${task.color}`}
              >
                <span className="text-xs font-bold leading-tight">
                  {task.name}
                </span>
                <span className="text-sm font-bold ml-2 shrink-0">
                  {taskTotal(task.id)}
                </span>
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div
            className={`rounded-xl px-4 md:px-5 py-3 flex items-center justify-between text-white ${dm.footerBar}`}
          >
            <span
              className={`text-xs font-bold uppercase tracking-widest ${dm.grandLabel}`}
            >
              Grand Total
            </span>
            <span className="text-lg md:text-xl font-bold">
              {grandTotal()} pts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
