import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");

  const location = useLocation();
  const username = location.state?.username;
  const navigate = useNavigate();
  const navItems = ["Dashboard", "Add Schools", "Search Scoreboard", "Add Users"];
  const url = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"]

  const stats = [
    { label: "Total Schools", value: "24", color: "bg-blue-100 text-blue-700" },
    { label: "Total Programs", value: "58", color: "bg-green-100 text-green-700" },
    { label: "Participants", value: "1,240", color: "bg-yellow-100 text-yellow-700" },
    { label: "Active Events", value: "7", color: "bg-pink-100 text-pink-700" },
  ];

  const recentActivity = [
    { school: "St. Mary's School", program: "Science Olympiad", date: "2025-04-28", participants: 45 },
    { school: "Green Valley High", program: "Math Bowl", date: "2025-04-25", participants: 30 },
    { school: "Sunrise Academy", program: "Coding Cup", date: "2025-04-20", participants: 60 },
    { school: "Blue Ridge School", program: "Debate League", date: "2025-04-18", participants: 25 },
  ];

  const quickActions = [
    { label: "Add School", page: "Add Schools", color: "bg-blue-500 hover:bg-blue-600" },
    { label: "Search Scoreboard", page: "Search Scoreboard", color: "bg-green-500 hover:bg-green-600" },
    { label: "Add Users", page: "Add Users", color: "bg-purple-500 hover:bg-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-white border-2 border-dashed border-gray-300 rounded-xl font-mono">

      {/* Title */}
      <h1 className="text-xl font-bold text-center py-6 border-b border-gray-200">
        Welcome to Entercon Score Page!
      </h1>

      {/* Body */}
      <div className="flex min-h-[600px]">

        {/* Sidebar */}
        <div className="w-56 flex flex-col gap-6 px-6 py-8 border-r border-gray-400">
          {
            navItems.map((item, index) => {

              return (
                <button
                  key={item}
                  onClick={() => { setActivePage(item); navigate(url[index]); }}
                  className={`text-left text-sm font-mono transition-all duration-150 hover:text-blue-500 ${activePage === item ? "text-blue-600 font-bold" : "text-gray-800"
                    }`}
                >
                  {item}
                </button>)
            }
            )
          }
        </div>

        {/* Main Content */}
        <div className="flex-1 px-10 py-8 flex flex-col gap-8 bg-gray-50">

          {/* Welcome Banner */}
          <div className="bg-blue-600 rounded-xl px-8 py-6 text-white flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">Hello 👋</h2>
              <p className="text-sm text-blue-100">Here's what's happening with Entercon today.</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl px-5 py-4 flex flex-col gap-1 ${stat.color} border border-opacity-20`}
              >
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-xs font-semibold uppercase tracking-wide opacity-80">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Recent Activity + Quick Actions */}
          <div className="grid grid-cols-3 gap-6">

            {/* Recent Activity Table */}
            <div className="col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-700">Recent Activity</h3>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-5 py-2 text-left font-semibold">School</th>
                    <th className="px-5 py-2 text-left font-semibold">Program</th>
                    <th className="px-5 py-2 text-left font-semibold">Date</th>
                    <th className="px-5 py-2 text-left font-semibold">Participants</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-blue-50 transition-colors">
                      <td className="px-5 py-2.5 text-gray-800 font-medium">{row.school}</td>
                      <td className="px-5 py-2.5 text-gray-600">{row.program}</td>
                      <td className="px-5 py-2.5 text-gray-500">{row.date}</td>
                      <td className="px-5 py-2.5">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                          {row.participants}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-3">Quick Actions</h3>
              {quickActions.map((action, index) => (
                <button
                  key={action.label}
                  onClick={() => {setActivePage(action.page); navigate(url[index+1])}}
                  className={`w-full text-white text-sm font-bold py-2.5 rounded-lg transition-all duration-150 active:scale-95 ${action.color}`}
                >
                  {action.label}
                </button>
              ))}

              {/* Mini Summary */}
              <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Next Event</p>
                <p className="text-sm font-bold text-gray-800">Science Olympiad</p>
                <p className="text-xs text-gray-500">St. Mary's School</p>
                <p className="text-xs text-blue-500 mt-1 font-semibold">📅 2025-05-10</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}