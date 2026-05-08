import { useState } from "react";
import { useNavigate } from "react-router-dom"

const TEAMS = [
  { id: 1, name: "Resilient Rhinos",     score: 85,  rank: 1, color: "gold",   members: 5 },
  { id: 2, name: "Disciplined Dragons",  score: 72,  rank: 2, color: "green",  members: 4 },
  { id: 3, name: "Humble Hyenas",        score: 68,  rank: 3, color: "gold",   members: 5 },
  { id: 4, name: "Brave Bisons",         score: 61,  rank: 4, color: "green",  members: 4 },
  { id: 5, name: "Positive Peacocks",    score: 55,  rank: 5, color: "gold",   members: 5 },
  { id: 6, name: "Loyal Lions",          score: 50,  rank: 6, color: "green",  members: 4 },
  { id: 7, name: "Compassionate Cobras", score: 44,  rank: 7, color: "gold",   members: 5 },
  { id: 8, name: "Grateful Gorillas",    score: 38,  rank: 8, color: "green",  members: 4 },
];

const RANK_BADGE = {
  1: { bg: "bg-yellow-400",  text: "text-yellow-900", label: "🥇" },
  2: { bg: "bg-gray-300",    text: "text-gray-800",   label: "🥈" },
  3: { bg: "bg-orange-300",  text: "text-orange-900", label: "🥉" },
};

const CARD_THEMES = {
  gold:  { outer: "bg-yellow-400 border-yellow-500", inner: "bg-white",       badge: "bg-yellow-300 text-yellow-900" },
  green: { outer: "bg-green-500  border-green-600",  inner: "bg-white",       badge: "bg-green-300  text-green-900"  },
};

const DAYS = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];
const MODES = ["Mode 1", "Mode 2", "Mode 3"];


function MemberIcons({ count }) {
  return (
    <div className="flex flex-wrap justify-center gap-0.5 my-1">
      {Array(count).fill(null).map((_, i) => (
        <svg key={i} className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      ))}
    </div>
  );
}

function TeamCard({ team, maxScore, navigate }) {
  const theme    = CARD_THEMES[team.color];
  const rankMeta = RANK_BADGE[team.rank];
  const pct      = Math.round((team.score / maxScore) * 100);

  return (
    <div className={`rounded-2xl border-2 p-3 flex flex-col gap-2 shadow-md transition-transform hover:scale-105 hover:shadow-xl ${theme.outer}`}>

      {/* Top Row: Logo + Rank */}
      <div className="flex items-center justify-between" onClick={() => navigate("/add-points",{state: {teamName: team.name}})}>
        <div className="w-10 h-10 rounded-xl bg-white bg-opacity-80 flex items-center justify-center shadow-sm">
          <span className="text-lg">🏫</span>
        </div>
        <div className={`text-xs font-bold px-2 py-0.5 rounded-full shadow-sm ${
          rankMeta ? `${rankMeta.bg} ${rankMeta.text}` : "bg-white text-gray-700"
        }`}>
          {rankMeta ? rankMeta.label : `#${team.rank}`}
        </div>
      </div>

      {/* Team Photo / Members */}
      <div className={`rounded-xl p-2 ${theme.inner} shadow-inner`}>
        <p className="text-center text-xs text-gray-400 font-semibold mb-1">Team</p>
        <MemberIcons count={team.members} />
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
          <div
            className="h-1.5 rounded-full bg-blue-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ScoreboardMode1() {
  const navigate = useNavigate();
  const [currentDay,  setCurrentDay]  = useState(0);
  const [currentMode, setCurrentMode] = useState(0);
  const [session,     setSession]     = useState("Entercon Session (L...)");
  const [school,      setSchool]      = useState("School Name");
  const [program,     setProgram]     = useState("Program Name");
  const [editingHeader, setEditingHeader] = useState(null);

  const navItems = ["Dashboard", "Add Schools", "Search Scoreboard", "Add Users"];
  const [activePage, setActivePage]   = useState("Search Scoreboard");
  const url = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"];

  const maxScore = Math.max(...TEAMS.map((t) => t.score));
  const topTeam  = TEAMS.find((t) => t.rank === 1);
  setCurrentMode(0)

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
        <div className="flex-1 px-6 py-6 bg-gray-100 flex flex-col gap-4">

          {/* Scoreboard Header Bar */}
          <div className="bg-gray-300 rounded-xl p-3 flex flex-col gap-2 shadow-sm">

            {/* Top Row */}
            <div className="grid grid-cols-3 gap-3">

              {/* Session */}
              <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-between border border-gray-200 cursor-pointer"
                onClick={() => setEditingHeader("session")}>
                {editingHeader === "session" ? (
                  <input autoFocus type="text" value={session}
                    onChange={(e) => setSession(e.target.value)}
                    onBlur={() => setEditingHeader(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingHeader(null)}
                    className="text-xs font-bold text-gray-700 w-full focus:outline-none bg-transparent" />
                ) : (
                  <span className="text-xs font-bold text-gray-700 truncate">{session}</span>
                )}
                <span className="text-gray-400 text-xs ml-1">✏️</span>
              </div>

              {/* School Name */}
              <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-between border border-gray-200 cursor-pointer"
                onClick={() => setEditingHeader("school")}>
                {editingHeader === "school" ? (
                  <input autoFocus type="text" value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    onBlur={() => setEditingHeader(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingHeader(null)}
                    className="text-xs font-bold text-gray-700 w-full focus:outline-none bg-transparent" />
                ) : (
                  <span className="text-xs font-bold text-gray-700 truncate">{school}</span>
                )}
                <span className="text-gray-400 text-xs ml-1">✏️</span>
              </div>

              {/* Day Selector */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white rounded-lg px-3 py-2 border border-gray-200 flex items-center justify-between">
                  <button onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
                    className="text-gray-500 hover:text-blue-500 font-bold transition-colors">‹</button>
                  <span className="text-xs font-bold text-gray-700">{DAYS[currentDay]}</span>
                  <button onClick={() => setCurrentDay(Math.min(DAYS.length - 1, currentDay + 1))}
                    className="text-gray-500 hover:text-blue-500 font-bold transition-colors">›</button>
                </div>
                {/* Mode Changer */}
                <button
                  onClick={() => {navigate("/scoreboard-mode2")}}
                  className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all whitespace-nowrap">
                  {MODES[currentMode]} ↺
                </button>
              </div>
            </div>

            {/* Program Name */}
            <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-between border border-gray-200 cursor-pointer mx-16"
              onClick={() => setEditingHeader("program")}>
              {editingHeader === "program" ? (
                <input autoFocus type="text" value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  onBlur={() => setEditingHeader(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingHeader(null)}
                  className="text-xs font-bold text-gray-700 w-full text-center focus:outline-none bg-transparent" />
              ) : (
                <span className="text-xs font-bold text-gray-700 text-center w-full">{program}</span>
              )}
              <span className="text-gray-400 text-xs ml-1">✏️</span>
            </div>
          </div>

          {/* Leader Banner */}
          <div className="bg-blue-600 rounded-xl px-5 py-3 flex items-center justify-between text-white shadow">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-xs text-blue-200 font-semibold uppercase tracking-wide">Current Leader</p>
                <p className="font-bold text-base">{topTeam.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-200 font-semibold">{DAYS[currentDay]}</p>
              <p className="text-2xl font-bold">{topTeam.score} pts</p>
            </div>
          </div>

          {/* Team Cards Grid */}
          <div className="grid grid-cols-4 gap-4">
            {TEAMS.map((team) => (
              <TeamCard key={team.id} team={team} navigate={navigate} maxScore={maxScore} />
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500 mt-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-400 border border-yellow-500" />
              <span>Team Group A</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500 border border-green-600" />
              <span>Team Group B</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🥇 1st</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🥈 2nd</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🥉 3rd</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}