import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CARD_THEMES = {
  gold:  { outer: "bg-yellow-400 border-yellow-500", inner: "bg-white", badge: "bg-yellow-300 text-yellow-900" },
  green: { outer: "bg-green-500  border-green-600",  inner: "bg-white", badge: "bg-green-300  text-green-900" },
};

const DAYS  = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];
const MODES = ["Mode 1", "Mode 2", "Mode 3"];

function MemberIcons({ count }) {
  return (
    <div className="flex flex-wrap justify-center gap-0.5 my-1">
      {Array(count).fill(null).map((_, i) => (
        <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      ))}
    </div>
  );
}

function TeamCard({
  team, maxScore, navigate, darkMode,
  username, users, school, schoolName, programName, index,
}) {
  const theme    = CARD_THEMES[index % 2 === 0 ? "gold" : "green"];
  const pct      = maxScore > 0 ? Math.round((team.score / maxScore) * 100) : 0;

  return (
    <div
      className={`rounded-2xl border-2 p-2.5 md:p-3 flex flex-col gap-1.5 md:gap-2 shadow-md transition-transform hover:scale-105 hover:shadow-xl cursor-pointer ${theme.outer}`}
      onClick={() => navigate("/add-points", {
        state: { teamName: team.name, username, users, school, schoolName, programName, darkMode },
      })}>

      {/* Logo + Rank */}
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white bg-opacity-80 flex items-center justify-center shadow-sm">
          <span className="text-sm md:text-lg">🏫</span>
        </div>
        <div className={`text-xs font-bold px-1.5 md:px-2 py-0.5 rounded-full shadow-sm 
          bg-white text-gray-700`}>
          #{team.rank}
        </div>
      </div>

      {/* Members */}
      <div className={`rounded-xl p-1.5 md:p-2 ${theme.inner} shadow-inner`}>
        <p className="text-center text-xs text-gray-400 font-semibold mb-0.5">Team</p>
        <MemberIcons count={4} />
      </div>

      {/* Team Name */}
      <div className="bg-white bg-opacity-90 rounded-lg px-2 py-1 text-center">
        <p className="text-xs font-bold text-gray-800 leading-tight">{team.name}</p>
      </div>

      {/* Score + Progress */}
      <div className="bg-white bg-opacity-90 rounded-lg px-2 py-1.5 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-semibold">Score</span>
          <span className="text-sm font-bold text-blue-600">{team.score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-blue-500 transition-all duration-700"
            style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function ScoreboardMode1() {
  const [currentDay,    setCurrentDay]    = useState(0);
  const [currentMode,   setCurrentMode]   = useState(0);
  const [session,       setSession]       = useState("Entercon Session");
  const [editingHeader, setEditingHeader] = useState(null);
  const [darkMode,      setDarkMode]      = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [TEAMS,         setTEAMS]         = useState([]);
  const [topTeam,       setTopTeam]       = useState({ name: "—", score: 0 });

  // ── Your original backend state ──
  const navigate  = useNavigate();
  const navItems  = ["Dashboard", "Add Schools", "Search Scoreboard", "Add Users"];
  const [activePage, setActivePage] = useState("Search Scoreboard");
  const url       = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"];
  const location  = useLocation();
  const username  = location.state?.username;
  const users     = location.state?.users;
  const schools   = location.state?.school;
  const darkModeStatus = location.state.darkMode;
  const schoolName     = location.state.schoolName;
  const programName    = location.state.programName;

  useEffect(() => {
  setDarkMode(darkModeStatus);
  setCurrentMode(0);

  // Find matching school + program
  const matchingSchool = schools.find(
    (s) =>
      s.schoolName === schoolName &&
      s.programName === programName
  );

  if (!matchingSchool || !matchingSchool.teamNames) return;

  // Clone teams with initial score 0
  let updatedTeams = matchingSchool.teamNames.map((team) => ({
    ...team,
    score: 0,
  }));

  // Take logs only till selected day
  const selectedLogs = matchingSchool.eventLog.slice(0, currentDay + 1);

  // Add points from logs
  selectedLogs.forEach((dayLogs) => {
    dayLogs.forEach((log) => {

      const teamIndex = updatedTeams.findIndex(
        (team) =>
          team.name.trim().toLowerCase() ===
          log.team.trim().toLowerCase()
      );

      if (teamIndex !== -1) {
        updatedTeams[teamIndex].score += log.points;
      }
    });
  });

  // Sort by score descending
  const sortedTeams = [...updatedTeams].sort(
    (a, b) => b.score - a.score
  );

  // Dense ranking
  const uniqueScores = [
    ...new Set(sortedTeams.map((team) => team.score)),
  ];

  const rankedTeams = sortedTeams.map((team) => ({
    ...team,
    rank: uniqueScores.indexOf(team.score) + 1,
  }));

  setTEAMS(rankedTeams);
  setTopTeam(rankedTeams[0] || { name: "—", score: 0 });

}, [
  darkModeStatus,
  schools,
  schoolName,
  programName,
  currentDay,
]);

  // Safe maxScore
  const maxScore = TEAMS.length > 0 ? Math.max(...TEAMS.map((t) => t.score)) : 1;

  const dm = {
    page:        darkMode ? "bg-gray-900 border-gray-700"  : "bg-white border-gray-300",
    title:       darkMode ? "border-gray-700 text-white"   : "border-gray-200 text-gray-900",
    sidebar:     darkMode ? "bg-gray-900 border-gray-700"  : "bg-white border-gray-400",
    text:        darkMode ? "text-gray-100"                : "text-gray-800",
    subtext:     darkMode ? "text-gray-400"                : "text-gray-500",
    mainBg:      darkMode ? "bg-gray-800"                  : "bg-gray-100",
    headerBar:   darkMode ? "bg-gray-700"                  : "bg-gray-300",
    headerField: darkMode ? "bg-gray-800 border-gray-600"  : "bg-white border-gray-200",
    headerText:  darkMode ? "text-gray-100"                : "text-gray-700",
    dayBtn:      darkMode ? "bg-gray-800 border-gray-600"  : "bg-white border-gray-200",
    legend:      darkMode ? "text-gray-400"                : "text-gray-500",
  };

  const HeaderFieldInline = ({ field, value, center }) => (
    <div onClick={() => setEditingHeader(field)}
      className={`rounded-lg px-3 py-2 flex items-center justify-between border cursor-pointer gap-1 ${dm.headerField}`}>
      {editingHeader === field ? (
        <p autoFocus type="text"
          onChange={(e) => { if (field === "session") setSession(e.target.value); }}
          onBlur={() => setEditingHeader(null)}
          onKeyDown={(e) => e.key === "Enter" && setEditingHeader(null)}
          className={`text-xs font-bold w-full focus:outline-none bg-transparent ${center ? "text-center" : ""} ${dm.headerText}`} />
      ) : (
        <span className={`text-xs font-bold truncate ${dm.headerText} ${center ? "text-center w-full" : ""}`}>
          {field === "school" ? schoolName : field === "program" ? programName : value}
        </span>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen border-2 border-dashed rounded-xl font-mono transition-colors duration-300 ${dm.page}`}>

      {/* Top Bar */}
      <div className={`flex items-center justify-between px-4 py-4 border-b ${dm.title}`}>
        <button onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className={`text-base md:text-xl font-bold text-center flex-1 ${dm.title}`}>
          Welcome to Entercon Score Page!
        </h1>
        <button onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
            darkMode ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" : "bg-gray-800 text-white hover:bg-gray-700"
          }`}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-73px)] relative">

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div className={`
          fixed md:static z-50 top-0 left-0 h-full
          w-64 md:w-56 shrink-0 flex flex-col gap-6 px-6 py-8
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
                navigate(url[index], {
                  state: { username, users, school: schools, schoolName, programName, darkMode },
                });
              }}
              className={`text-left text-sm font-mono transition-all duration-150 hover:text-blue-500 ${
                activePage === item ? "text-blue-500 font-bold" : dm.text
              }`}>
              {item}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className={`flex-1 px-3 md:px-6 py-4 md:py-6 flex flex-col gap-3 md:gap-4 ${dm.mainBg}`}>

          {/* Header Bar */}
          <div className={`rounded-xl p-3 flex flex-col gap-2 shadow-sm ${dm.headerBar}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
              <HeaderFieldInline field="session" value={session} />
              <HeaderFieldInline field="school"  value={schoolName} center />
              <div className="flex items-center gap-2">
                <div className={`flex-1 rounded-lg px-3 py-2 border flex items-center justify-between ${dm.dayBtn}`}>
                  <button onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
                    className={`font-bold hover:text-blue-500 transition-colors ${dm.subtext}`}>‹</button>
                  <span className={`text-xs font-bold ${dm.headerText}`}>{DAYS[currentDay]}</span>
                  <button onClick={() => setCurrentDay(Math.min(DAYS.length - 1, currentDay + 1))}
                    className={`font-bold hover:text-blue-500 transition-colors ${dm.subtext}`}>›</button>
                </div>
                <button
                  onClick={() => navigate("/scoreboard-mode2", {
                    state: { username, users, school: schools, schoolName, programName, darkMode: darkModeStatus },
                  })}
                  className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all whitespace-nowrap">
                  {MODES[currentMode]} ↺
                </button>
              </div>
            </div>
            <div className="mx-0 md:mx-16">
              <HeaderFieldInline field="program" value={programName} center />
            </div>
          </div>

          {/* Leader Banner */}
          <div className="bg-blue-600 rounded-xl px-4 md:px-5 py-3 flex items-center justify-between text-white shadow">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">🏆</span>
              <div>
                <p className="text-xs text-blue-200 font-semibold uppercase tracking-wide">Current Leader</p>
                <p className="font-bold text-sm md:text-base">{topTeam.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-200 font-semibold">{DAYS[currentDay]}</p>
              <p className="text-xl md:text-2xl font-bold">{topTeam.score} pts</p>
            </div>
          </div>

          {/* Team Cards Grid */}
          {TEAMS.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-12 text-center">
              <div>
                <p className="text-4xl mb-3">🏆</p>
                <p className={`text-sm font-bold ${dm.subtext}`}>No teams found for this school.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {TEAMS.map((team, index) => (
                <TeamCard
                  key={team.name}
                  team={team}
                  navigate={navigate}
                  maxScore={maxScore}
                  darkMode={darkMode}
                  username={username}
                  users={users}
                  school={schools}
                  schoolName={schoolName}
                  programName={programName}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Legend */}
          <div className={`flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs mt-1 ${dm.legend}`}>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-yellow-400 border border-yellow-500" />
              <span>Team Group A</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-green-500 border border-green-600" />
              <span>Team Group B</span>
            </div>
            <span>🥇 1st</span>
            <span>🥈 2nd</span>
            <span>🥉 3rd</span>
          </div>

        </div>
      </div>
    </div>
  );
}