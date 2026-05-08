import { useState } from "react";
import { useNavigate } from "react-router-dom"


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
  { id: 1, name: "Rocket Launch",      color: "bg-pink-400    text-white" },
  { id: 2, name: "Hunt the Wolf",      color: "bg-yellow-400  text-gray-800" },
  { id: 3, name: "Talking first",      color: "bg-cyan-400    text-white" },
  { id: 4, name: "Encouragement Points", color: "bg-green-400 text-white" },
];

const INITIAL_SCORES = {
  1:  { 1: 50,  2: 10, 3: 5,  4: 20  },
  2:  { 1: 100, 2: null, 3: 5, 4: null },
  3:  { 1: null,2: 10, 3: 5,  4: null },
  4:  { 1: 25,  2: null,3: 5, 4: 10  },
  5:  { 1: null,2: null,3: 5, 4: null },
  6:  { 1: 30,  2: 20, 3: 5,  4: null },
  7:  { 1: null,2: 40, 3: 5,  4: null },
  8:  { 1: 10,  2: null,3: 5, 4: null },
  9:  { 1: 15,  2: 30, 3: 5,  4: null },
  10: { 1: null,2: 25, 3: 5,  4: 30  },
  11: { 1: 45,  2: null,3: 5, 4: 10  },
  12: { 1: 80,  2: 5,  3: 5,  4: 5   },
};

const DAYS  = ["Day 1","Day 2","Day 3","Day 4","Day 5"];
const MODES = ["Mode 1","Mode 2","Mode 3"];


export default function ScoreboardMode2() {
  const [scores,       setScores]       = useState(INITIAL_SCORES);
  const [editingCell,  setEditingCell]  = useState(null);
  const [cellValue,    setCellValue]    = useState("");
  const [currentDay,   setCurrentDay]   = useState(0);
  const [currentMode,  setCurrentMode]  = useState(1);
  const [session,      setSession]      = useState("Entercon Session");
  const [school,       setSchool]       = useState("School Name");
  const [program,      setProgram]      = useState("Program Name");
  const [editingHeader,setEditingHeader]= useState(null);

  const navItems   = ["Dashboard","Add Schools","Search Scoreboard","Add Users"];
  const [activePage,setActivePage] = useState("Search Scoreboard");
  const url = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"];
  const navigate = useNavigate();

  const getScore   = (teamId, taskId) => scores[teamId]?.[taskId] ?? null;
  const getTotal   = (teamId) => TASKS.reduce((s, t) => s + (getScore(teamId, t.id) ?? 0), 0);
  const taskTotal  = (taskId) => TEAMS.reduce((s, t) => s + (getScore(t.id, taskId) ?? 0), 0);
  const grandTotal = () => TEAMS.reduce((s, t) => s + getTotal(t.id), 0);

  const startEdit  = (teamId, taskId, val) => {
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

  const HeaderField = ({ field, value, center }) => (
    <div
      onClick={() => setEditingHeader(field)}
      className={`bg-white rounded-lg px-3 py-2 flex items-center border border-gray-300 cursor-pointer gap-1 ${center ? "justify-center" : "justify-between"}`}>
      {editingHeader === field ? (
        <input autoFocus type="text" value={value}
          onChange={(e) => {
            if (field === "session") setSession(e.target.value);
            if (field === "school")  setSchool(e.target.value);
            if (field === "program") setProgram(e.target.value);
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
                  <span className="text-xs font-bold text-gray-700">{DAYS[currentDay]}</span>
                  <button onClick={() => setCurrentDay(Math.min(DAYS.length - 1, currentDay + 1))}
                    className="text-gray-500 hover:text-blue-500 font-bold">›</button>
                </div>
                <button onClick={() => {navigate("/scoreboard-mode3")}}
                  className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all whitespace-nowrap">
                  {MODES[currentMode]} ↺
                </button>
              </div>
            </div>
            <div className="mx-20">
              <HeaderField field="program" value={program} center />
            </div>
          </div>

          {/* Scoreboard Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full border-collapse text-xs">

              {/* Team Header Row */}
              <thead>
                <tr>
                  {TEAMS.map((team) => (
                    <th key={team.id}
                      className="bg-gray-300 border border-gray-400 px-1 py-1 text-center font-bold text-gray-700 text-xs min-w-[64px]">
                      {team.shortName}
                    </th>
                  ))}
                  <th className="bg-pink-500 border border-pink-600 px-2 py-1 text-white font-bold text-xs min-w-[80px]">
                    Tasks
                  </th>
                </tr>

                {/* Logo Row */}
                <tr>
                  {TEAMS.map((team) => (
                    <td key={team.id}
                      className="bg-gray-300 border border-gray-400 px-1 py-2 text-center">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center mx-auto shadow-sm">
                        <span className="text-lg">🏫</span>
                      </div>
                    </td>
                  ))}
                  <td className="bg-pink-500 border border-pink-600" />
                </tr>
              </thead>

              {/* Score Rows per Task */}
              <tbody>
                {TASKS.map((task) => (
                  <tr key={task.id}>
                    {TEAMS.map((team) => {
                      const val     = getScore(team.id, task.id);
                      const cellKey = `${team.id}-${task.id}`;
                      const isEditing = editingCell === cellKey;
                      return (
                        <td key={team.id}
                          onClick={() => !isEditing && startEdit(team.id, task.id, val)}
                          className="bg-white border border-gray-300 px-1 py-2 text-center cursor-pointer hover:bg-blue-50 transition-colors">
                          {isEditing ? (
                            <input
                              autoFocus
                              type="number"
                              value={cellValue}
                              onChange={(e) => setCellValue(e.target.value)}
                              onBlur={() => commitEdit(team.id, task.id)}
                              onKeyDown={(e) => e.key === "Enter" && commitEdit(team.id, task.id)}
                              className="w-full text-center text-xs font-bold focus:outline-none bg-blue-50 rounded"
                            />
                          ) : (
                            <span className={`font-bold ${val === null ? "text-gray-300" : "text-gray-800"}`}>
                              {val === null ? "—" : val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    {/* Task Label */}
                    <td className={`border border-gray-200 px-2 py-2 font-bold text-xs ${task.color}`}>
                      {task.name}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr>
                  {TEAMS.map((team) => (
                    <td key={team.id}
                      className="bg-gray-800 border border-gray-600 px-1 py-2 text-center">
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

          {/* Footer Summary */}
          <div className="grid grid-cols-4 gap-3">
            {TASKS.map((task) => (
              <div key={task.id} className={`rounded-xl px-4 py-3 flex items-center justify-between ${task.color}`}>
                <span className="text-xs font-bold">{task.name}</span>
                <span className="text-sm font-bold">{taskTotal(task.id)}</span>
              </div>
            ))}
          </div>

          <div className="bg-gray-800 rounded-xl px-5 py-3 flex items-center justify-between text-white">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Grand Total</span>
            <span className="text-xl font-bold">{grandTotal()} pts</span>
          </div>

        </div>
      </div>
    </div>
  );
}