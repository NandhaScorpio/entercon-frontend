import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_DATA = [
  { id: 1, schoolName: "St. Mary's School", program: "Program Batch 1", teams: 6, participants: 45, startDate: "2025-04-10", endDate: "2025-04-12", status: "Completed" },
  { id: 2, schoolName: "Green Valley High", program: "Program Batch 2", teams: 4, participants: 30, startDate: "2025-04-20", endDate: "2025-04-22", status: "Ongoing" },
  { id: 3, schoolName: "Sunrise Academy", program: "Program Batch 1", teams: 8, participants: 60, startDate: "2025-05-01", endDate: "2025-05-03", status: "Upcoming" },
  { id: 4, schoolName: "Blue Ridge School", program: "Program Batch 3", teams: 5, participants: 25, startDate: "2025-05-10", endDate: "2025-05-12", status: "Upcoming" },
  { id: 5, schoolName: "St. Mary's School", program: "Program Batch 2", teams: 3, participants: 20, startDate: "2025-03-15", endDate: "2025-03-17", status: "Completed" },
];

const STATUS_STYLES = {
  Completed: "bg-green-100 text-green-700",
  Ongoing: "bg-blue-100 text-blue-700",
  Upcoming: "bg-yellow-100 text-yellow-700",
};

export default function SearchScoreboard() {
  const [activePage, setActivePage] = useState("Search Scoreboard");
  const [schoolInput, setSchoolInput] = useState("");
  const [programInput, setProgramInput] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const navItems = ["Dashboard", "Add Schools", "Search Scoreboard", "Add Users"];
  const url = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"]
  const navigate = useNavigate();

  const handleSearch = () => {
    const filtered = MOCK_DATA.filter((d) => {
      const schoolMatch = schoolInput.trim() === "" || d.schoolName.toLowerCase().includes(schoolInput.toLowerCase());
      const programMatch = programInput.trim() === "" || d.program.toLowerCase().includes(programInput.toLowerCase());
      return schoolMatch && programMatch;
    });
    setResults(filtered);
    setSearched(true);
    setSelectedRow(null);
    setEditingId(null);
  };

  const handleEditStart = (row) => {
    setEditingId(row.id);
    setEditValues({ schoolName: row.schoolName, program: row.program, teams: row.teams, participants: row.participants, startDate: row.startDate, endDate: row.endDate });
  };

  const handleEditSave = (id) => {
    setResults(results.map((r) => r.id === id ? { ...r, ...editValues } : r));
    setEditingId(null);
  };

  const inputClass = "border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 font-mono w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white transition";
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block";

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
              <h2 className="text-lg font-bold text-gray-800">Search Scoreboard</h2>
              <p className="text-xs text-gray-400 mt-0.5">Find schools and programs by name</p>
            </div>
            {searched && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${results.length > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"
                }`}>
                {results.length > 0 ? `${results.length} Result${results.length > 1 ? "s" : ""} Found` : "No Results"}
              </span>
            )}
          </div>

          {/* Search Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-5 pb-3 border-b border-gray-100">
              🔍 Search Filters
            </h3>
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>School Name</label>
                <input
                  type="text"
                  placeholder="e.g. St. Mary's School"
                  value={schoolInput}
                  onChange={(e) => setSchoolInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Program Name</label>
                <input
                  type="text"
                  placeholder="e.g. Program Batch 1"
                  value={programInput}
                  onChange={(e) => setProgramInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setSchoolInput(""); setProgramInput(""); setResults([]); setSearched(false); setSelectedRow(null); }}
                className="px-5 py-2 text-sm font-bold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 active:scale-95 transition-all">
                Clear
              </button>
              <button
                onClick={handleSearch}
                className="px-8 py-2 text-sm font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all">
                Search
              </button>
            </div>
          </div>

          {/* Results */}
          {searched && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700">📋 See Results</h3>
                <span className="text-xs text-gray-400">{results.length} record{results.length !== 1 ? "s" : ""}</span>
              </div>

              {results.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-3xl mb-3">🔍</p>
                  <p className="text-gray-500 text-sm font-bold">No matching schools or programs found.</p>
                  <p className="text-gray-400 text-xs mt-1">Try adjusting your search filters.</p>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide">
                    <tr>
                      <th className="px-5 py-2.5 text-left font-semibold">School Name</th>
                      <th className="px-5 py-2.5 text-left font-semibold">Program</th>
                      <th className="px-5 py-2.5 text-left font-semibold">Teams</th>
                      <th className="px-5 py-2.5 text-left font-semibold">Status</th>
                      <th className="px-5 py-2.5 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row) => (
                      <>
                        <tr key={row.id}
                          className="border-t border-gray-100 hover:bg-blue-50 transition-colors">
                          <td className="px-5 py-3 font-medium text-gray-800">{row.schoolName}</td>
                          <td className="px-5 py-3 text-gray-600">{row.program}</td>
                          <td className="px-5 py-3">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                              {row.teams} teams
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold ${STATUS_STYLES[row.status]}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => navigate("/score-details", { state: { schoolName: row.schoolName, programName: row.program } })}
                                className={`text-xs font-bold px-4 py-1.5 rounded-lg active:scale-95 transition-all bg-green-100 text-green-700 hover:bg-green-200`}>
                                See
                              </button>
                              <button
                                onClick={() => handleEditStart(row)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-1.5 rounded-lg active:scale-95 transition-all">
                                Edit Details
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Detail Row */}
                        {selectedRow?.id === row.id && (
                          <tr key={`detail-${row.id}`} className="bg-blue-50 border-t border-blue-100">
                            <td colSpan={5} className="px-6 py-4">
                              <div className="grid grid-cols-4 gap-4">
                                {[
                                  { label: "Participants", value: row.participants },
                                  { label: "Start Date", value: row.startDate },
                                  { label: "End Date", value: row.endDate },
                                  { label: "Teams", value: row.teams },
                                ].map((item) => (
                                  <div key={item.label} className="bg-white rounded-lg px-4 py-3 border border-blue-100">
                                    <p className="text-xs text-blue-400 font-semibold mb-1">{item.label}</p>
                                    <p className="text-sm font-bold text-gray-800">{item.value}</p>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Inline Edit Row */}
                        {editingId === row.id && (
                          <tr key={`edit-${row.id}`} className="bg-yellow-50 border-t border-yellow-100">
                            <td colSpan={5} className="px-6 py-4">
                              <p className="text-xs font-bold text-yellow-700 mb-3">✏️ Editing: {row.schoolName}</p>
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                {[
                                  { label: "School Name", field: "schoolName", type: "text" },
                                  { label: "Program Name", field: "program", type: "text" },
                                  { label: "Teams", field: "teams", type: "number" },
                                  { label: "Participants", field: "participants", type: "number" },
                                  { label: "Start Date", field: "startDate", type: "date" },
                                  { label: "End Date", field: "endDate", type: "date" },
                                ].map(({ label, field, type }) => (
                                  <div key={field}>
                                    <label className={labelClass}>{label}</label>
                                    <input
                                      type={type}
                                      value={editValues[field] || ""}
                                      onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
                                      className={inputClass}
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-3 justify-end">
                                <button onClick={() => setEditingId(null)}
                                  className="px-4 py-1.5 text-xs font-bold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 active:scale-95 transition-all">
                                  Cancel
                                </button>
                                <button onClick={() => handleEditSave(row.id)}
                                  className="px-5 py-1.5 text-xs font-bold rounded-lg text-white bg-green-500 hover:bg-green-600 active:scale-95 transition-all">
                                  Save Changes
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Prompt before search */}
          {!searched && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <p className="text-5xl mb-4">🏫</p>
              <p className="text-gray-500 text-sm font-bold">Enter a school or program name to search</p>
              <p className="text-gray-400 text-xs mt-1">Results will appear here after you hit Search</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}