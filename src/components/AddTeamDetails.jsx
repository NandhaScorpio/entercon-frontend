import { useState } from "react";
import { useNavigate } from "react-router-dom"

const DEFAULT_TEAMS = [
  "Humble Hyenas", "Brave Bisons", "Resilient Rhinos",
  "Truthful Tigers", "Disciplined Dragons", "Kind Kangaroos",
  "Compassionate Cobras", "Grateful Gorillas", "Positive Peacocks",
  "Loyal Lions", "Resilient Rhinos", "Fierce Falcons",
];

export default function AddTeamDetails() {
  const [activePage, setActivePage] = useState("Add Schools");
  const [selectedTeams, setSelectedTeams] = useState([
    "Humble Hyenas", "Brave Bisons", "Positive Peacocks",
  ]);
  const [customTeam, setCustomTeam] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [teams, setTeams] = useState(DEFAULT_TEAMS);

  const navigate = useNavigate();
  const navItems = ["Dashboard", "Add Schools", "Search Scoreboard", "Add Users"];
  const url = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"]

  const toggleTeam = (team) => {
    if (selectedTeams.includes(team)) { 
      setSelectedTeams(selectedTeams.filter((t) => t !== team));
    } else {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customTeam.trim();
    if (!trimmed) return;
    if (teams.includes(trimmed)) { alert("Team already exists!"); return; }
    setTeams([...teams, trimmed]);
    setSelectedTeams([...selectedTeams, trimmed]);
    setCustomTeam("");
    setShowCustomInput(false);
  };

  const handleRemoveSelected = (team) => {
    setSelectedTeams(selectedTeams.filter((t) => t !== team));
  };

  const teamGrid = [];
  for (let i = 0; i < teams.length; i += 3) {
    teamGrid.push(teams.slice(i, i + 3));
  }

  const selectedGrid = [];
  for (let i = 0; i < selectedTeams.length; i += 3) {
    selectedGrid.push(selectedTeams.slice(i, i + 3));
  }

  return (
    <div className="min-h-screen bg-white border-2 border-dashed border-gray-300 rounded-xl font-mono">

      {/* Title */}
      <h1 className="text-xl font-bold text-center py-6 border-b border-gray-200">
        Welcome to Entercon Score Page!
      </h1>

      <div className="flex min-h-[600px]">

        {/* Sidebar */}
        <div className="w-56 shrink-0 flex flex-col gap-6 px-6 py-8 border-r border-gray-400">
          {navItems.map((item, index) => (
            <button key={item} onClick={() => { setActivePage(item); navigate(url[index]) }}
              className={`text-left text-sm font-mono transition-all duration-150 hover:text-blue-500 ${
                activePage === item ? "text-blue-600 font-bold" : "text-gray-800"
              }`}>
              {item}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 px-10 py-8 bg-gray-50 flex flex-col gap-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Team Management</h2>
              <p className="text-xs text-gray-400 mt-0.5">Select or add teams to register for the event</p>
            </div>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                {teams.length} Teams Available
              </span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                {selectedTeams.length} Selected
              </span>
            </div>
          </div>

          {/* Team Names Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-700">🏷️ Team Names</h3>
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="bg-red-500 hover:bg-red-600 active:scale-95 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-all">
                + Custom Team
              </button>
            </div>

            {/* Custom Input */}
            {showCustomInput && (
              <div className="flex items-center gap-3 px-6 py-3 bg-red-50 border-b border-red-100">
                <input
                  type="text"
                  placeholder="Enter custom team name..."
                  value={customTeam}
                  onChange={(e) => setCustomTeam(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
                  className="flex-1 border border-red-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                />
                <button onClick={handleAddCustom}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg active:scale-95 transition-all">
                  Add
                </button>
                <button onClick={() => setShowCustomInput(false)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-bold px-2 py-1.5 rounded-lg transition-all">
                  Cancel
                </button>
              </div>
            )}

            {/* Team Grid */}
            <div className="p-4">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                <tbody>
                  {teamGrid.map((row, ri) => (
                    <tr key={ri} className="border-t border-gray-100 first:border-0">
                      {row.map((team, ci) => {
                        const idx = ri * 3 + ci;
                        const isSelected = selectedTeams.includes(team);
                        return (
                          <td key={ci}
                            onClick={() => toggleTeam(team)}
                            className={`border border-gray-200 px-4 py-3 text-center cursor-pointer transition-all duration-150 select-none
                              ${isSelected
                                ? "bg-blue-50 text-blue-600 font-bold"
                                : "hover:bg-gray-50 text-gray-700"
                              }`}>
                            <span className="text-xs text-gray-400 mr-1">{idx + 1}.</span>
                            {team}
                            {isSelected && (
                              <span className="ml-1 text-blue-400 text-xs">✓</span>
                            )}
                          </td>
                        );
                      })}
                      {row.length < 3 && Array(3 - row.length).fill(null).map((_, i) => (
                        <td key={`empty-${i}`} className="border border-gray-200 px-4 py-3" />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 mt-2 text-center">Click a team to select / deselect it</p>
            </div>
          </div>

          {/* Selected Teams Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-700">✅ Added Teams</h3>
              {selectedTeams.length > 0 && (
                <button onClick={() => setSelectedTeams([])}
                  className="text-xs text-red-400 hover:text-red-600 font-bold transition-colors">
                  Clear All
                </button>
              )}
            </div>

            {selectedTeams.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">
                No teams selected yet. Click teams above to add them.
              </div>
            ) : (
              <div className="p-4">
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                  <tbody>
                    {selectedGrid.map((row, ri) => (
                      <tr key={ri} className="border-t border-gray-100 first:border-0">
                        {row.map((team, ci) => {
                          const idx = ri * 3 + ci;
                          return (
                            <td key={ci}
                              className="border border-gray-200 px-4 py-3 text-center text-blue-500 font-bold bg-blue-50 group relative">
                              <span className="text-xs text-blue-300 mr-1">{idx + 1}.</span>
                              {team}
                              <button
                                onClick={() => handleRemoveSelected(team)}
                                className="ml-2 text-red-300 hover:text-red-500 text-xs transition-colors">
                                ✕
                              </button>
                            </td>
                          );
                        })}
                        {row.length < 3 && Array(3 - row.length).fill(null).map((_, i) => (
                          <td key={`empty-${i}`} className="border border-gray-200 px-4 py-3 bg-gray-50" />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSelectedTeams([])}
              className="px-5 py-2 text-sm font-bold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 active:scale-95 transition-all">
              Reset
            </button>
            <button
              onClick={() => alert(`${selectedTeams.length} teams saved successfully!`)}
              className="px-6 py-2 text-sm font-bold rounded-lg text-white bg-green-500 hover:bg-green-600 active:scale-95 transition-all">
              Save Teams
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}