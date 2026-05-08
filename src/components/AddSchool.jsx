import { useState } from "react";
import { useNavigate } from "react-router-dom"

const DEFAULT_TEAMS = [
  "Humble Hyenas", "Brave Bisons", "Resilient Rhinos",
  "Truthful Tigers", "Disciplined Dragons", "Kind Kangaroos",
  "Compassionate Cobras", "Grateful Gorillas", "Positive Peacocks",
  "Loyal Lions", "Fierce Falcons", "Grateful Gorillas",
];

export default function AddSchools() {
  const [activePage, setActivePage] = useState("Add Schools");
  const [schoolName, setSchoolName] = useState("");
  const [programName, setProgramName] = useState("");
  const [dayCount, setDayCount] = useState("");
  const [participants, setParticipants] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [schools, setSchools] = useState([
    { schoolName: "St. Mary's School", programName: "Science Olympiad", dayCount: 3, participants: 45, startDate: "2025-04-28", endDate: "2025-04-30" },
    { schoolName: "Green Valley High", programName: "Math Bowl", dayCount: 2, participants: 30, startDate: "2025-04-25", endDate: "2025-04-26" },
  ]);

  // Team state
  const [selectedTeams, setSelectedTeams] = useState(["Humble Hyenas", "Brave Bisons", "Positive Peacocks"]);
  const [teams, setTeams] = useState(DEFAULT_TEAMS);
  const [customTeam, setCustomTeam] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // 1 = School Details, 2 = Team Selection

  const navigate = useNavigate();
  const navItems = ["Dashboard", "Add Schools", "Search Scoreboard", "Add Users"];
  const url = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"]

  const inputClass = "border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 font-mono w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white transition";
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block";

  // School handlers
  const resetForm = () => {
    setSchoolName(""); setProgramName(""); setDayCount("");
    setParticipants(""); setStartDate(""); setEndDate("");
    setEditingIndex(null);
  };

  const handleAddSchool = () => {
    if (!schoolName || !programName || !dayCount || !participants || !startDate || !endDate) {
      alert("Please fill in all school fields."); return;
    }
    const entry = { schoolName, programName, dayCount, participants, startDate, endDate };
    if (editingIndex !== null) {
      const updated = [...schools]; updated[editingIndex] = entry; setSchools(updated);
    } else {
      setSchools([...schools, entry]);
    }
    resetForm();
  };

  const handleEditSchool = (index) => {
    const s = schools[index];
    setSchoolName(s.schoolName); setProgramName(s.programName);
    setDayCount(s.dayCount); setParticipants(s.participants);
    setStartDate(s.startDate); setEndDate(s.endDate);
    setEditingIndex(index);
    setActiveStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteSchool = (index) => setSchools(schools.filter((_, i) => i !== index));

  // Team handlers
  const toggleTeam = (team) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== team));
    } else {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const handleAddCustomTeam = () => {
    const trimmed = customTeam.trim();
    if (!trimmed) return;
    if (teams.includes(trimmed)) { alert("Team already exists!"); return; }
    setTeams([...teams, trimmed]);
    setSelectedTeams([...selectedTeams, trimmed]);
    setCustomTeam(""); setShowCustomInput(false);
  };

  const handleRemoveSelected = (team) => setSelectedTeams(selectedTeams.filter((t) => t !== team));

  const teamGrid = [];
  for (let i = 0; i < teams.length; i += 3) teamGrid.push(teams.slice(i, i + 3));

  const selectedGrid = [];
  for (let i = 0; i < selectedTeams.length; i += 3) selectedGrid.push(selectedTeams.slice(i, i + 3));

  const handleFinalSave = () => {
    if (selectedTeams.length === 0) { alert("Please select at least one team."); return; }
    alert(`✅ Saved!\nSchools: ${schools.length}\nTeams: ${selectedTeams.join(", ")}`);
  };

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
            <button key={item} onClick={() => {setActivePage(item); navigate(url[index])}}
              className={`text-left text-sm font-mono transition-all duration-150 hover:text-blue-500 ${activePage === item ? "text-blue-600 font-bold" : "text-gray-800"
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
              <h2 className="text-lg font-bold text-gray-800">Add Schools & Teams</h2>
              <p className="text-xs text-gray-400 mt-0.5">Register school details and assign teams in one place</p>
            </div>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                {schools.length} Schools
              </span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                {selectedTeams.length} Teams Selected
              </span>
            </div>
          </div>

          {/* Step Tabs */}
          <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm w-fit">
            {[
              { step: 1, label: "🏫 School Details" },
              { step: 2, label: "🏷️ Team Selection" },
            ].map(({ step, label }) => (
              <button key={step} onClick={() => setActiveStep(step)}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeStep === step
                    ? "bg-blue-500 text-white shadow"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}>
                {label}
              </button>
            ))}
          </div>

          {/* ── STEP 1: School Details ── */}
          {activeStep === 1 && (
            <div className="flex flex-col gap-5">

              {/* School Form Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-5 pb-3 border-b border-gray-100">
                  {editingIndex !== null ? "✏️ Edit School Details" : "🏫 New School Entry"}
                </h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>School Name</label>
                    <input type="text" placeholder="e.g. St. Mary's School" value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Program Name</label>
                    <input type="text" placeholder="e.g. Science Olympiad" value={programName}
                      onChange={(e) => setProgramName(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Number of Days</label>
                    <input type="number" placeholder="e.g. 3" value={dayCount}
                      onChange={(e) => setDayCount(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Participants</label>
                    <input type="number" placeholder="e.g. 50" value={participants}
                      onChange={(e) => setParticipants(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input type="date" value={startDate}
                      onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input type="date" value={endDate}
                      onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="flex gap-3 mt-6 justify-end">
                  {editingIndex !== null && (
                    <button onClick={resetForm}
                      className="px-5 py-2 text-sm font-bold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 active:scale-95 transition-all">
                      Cancel
                    </button>
                  )}
                  <button onClick={() => { handleAddSchool(); setActiveStep(2); }}
                    className={`px-6 py-2 text-sm font-bold rounded-lg text-white active:scale-95 transition-all ${editingIndex !== null ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                      }`}>
                    {editingIndex !== null ? "Save Changes" : "Save & Add Teams →"}
                  </button>
                </div>
              </div>

              {/* Schools Table */}
              {schools.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-6 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700">Registered Schools</h3>
                  </div>
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide">
                      <tr>
                        <th className="px-5 py-2.5 text-left font-semibold">School</th>
                        <th className="px-5 py-2.5 text-left font-semibold">Program</th>
                        <th className="px-5 py-2.5 text-left font-semibold">Days</th>
                        <th className="px-5 py-2.5 text-left font-semibold">Participants</th>
                        <th className="px-5 py-2.5 text-left font-semibold">Duration</th>
                        <th className="px-5 py-2.5 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schools.map((s, i) => (
                        <tr key={i} className="border-t border-gray-100 hover:bg-blue-50 transition-colors">
                          <td className="px-5 py-2.5 font-medium text-gray-800">{s.schoolName}</td>
                          <td className="px-5 py-2.5 text-gray-600">{s.programName}</td>
                          <td className="px-5 py-2.5 text-gray-600">{s.dayCount}</td>
                          <td className="px-5 py-2.5">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{s.participants}</span>
                          </td>
                          <td className="px-5 py-2.5 text-gray-500">{s.startDate} → {s.endDate}</td>
                          <td className="px-5 py-2.5 flex gap-2">
                            <button onClick={() => handleEditSchool(i)}
                              className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg font-bold hover:bg-yellow-200 active:scale-95 transition-all">
                              Edit
                            </button>
                            <button onClick={() => handleDeleteSchool(i)}
                              className="bg-red-100 text-red-600 px-3 py-1 rounded-lg font-bold hover:bg-red-200 active:scale-95 transition-all">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Team Selection ── */}
          {activeStep === 2 && (
            <div className="flex flex-col gap-5">

              {/* Team Names Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700">🏷️ Team Names</h3>
                  <button onClick={() => setShowCustomInput(!showCustomInput)}
                    className="bg-red-500 hover:bg-red-600 active:scale-95 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-all">
                    + Custom Team
                  </button>
                </div>

                {/* Custom Input */}
                {showCustomInput && (
                  <div className="flex items-center gap-3 px-6 py-3 bg-red-50 border-b border-red-100">
                    <input type="text" placeholder="Enter custom team name..."
                      value={customTeam} onChange={(e) => setCustomTeam(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddCustomTeam()}
                      className="flex-1 border border-red-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                      autoFocus />
                    <button onClick={handleAddCustomTeam}
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
                              <td key={ci} onClick={() => toggleTeam(team)}
                                className={`border border-gray-200 px-4 py-3 text-center cursor-pointer transition-all duration-150 select-none ${isSelected ? "bg-blue-50 text-blue-600 font-bold" : "hover:bg-gray-50 text-gray-700"
                                  }`}>
                                <span className="text-xs text-gray-400 mr-1">{idx + 1}.</span>
                                {team}
                                {isSelected && <span className="ml-1 text-blue-400 text-xs">✓</span>}
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

              {/* Added Teams Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700">✅ Added Teams
                    <span className="ml-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {selectedTeams.length}
                    </span>
                  </h3>
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
                                  className="border border-gray-200 px-4 py-3 text-center text-blue-600 font-bold bg-blue-50">
                                  <span className="text-xs text-blue-300 mr-1">{idx + 1}.</span>
                                  {team}
                                  <button onClick={() => handleRemoveSelected(team)}
                                    className="ml-2 text-red-300 hover:text-red-500 text-xs transition-colors">✕</button>
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

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button onClick={() => setActiveStep(1)}
                  className="px-5 py-2 text-sm font-bold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 active:scale-95 transition-all">
                  ← Back to School Details
                </button>
                <div className="flex gap-3">
                  <button onClick={() => setSelectedTeams([])}
                    className="px-5 py-2 text-sm font-bold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 active:scale-95 transition-all">
                    Reset Teams
                  </button>
                  <button onClick={handleFinalSave}
                    className="px-6 py-2 text-sm font-bold rounded-lg text-white bg-green-500 hover:bg-green-600 active:scale-95 transition-all">
                    ✓ Save All
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}