import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state.username;
  const users = location.state.users;
  const school = location.state.school;
  const darkModeStatus = location.state.darkMode;
  const navItems = ["Dashboard", "Add Schools", "Search Scoreboard", "Add Users"];
  const url = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"];

  useEffect(() => {
    setDarkMode(darkModeStatus);
  }, [darkModeStatus]);

  // ── Your original data ──
  const stats = [
    { label: "Total Schools",  value: "24",   color: darkMode ? "bg-blue-900   text-blue-200"   : "bg-blue-100   text-blue-700"   },
    { label: "Total Programs", value: "58",   color: darkMode ? "bg-green-900  text-green-200"  : "bg-green-100  text-green-700"  },
    { label: "Participants",   value: "1,240",color: darkMode ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-700" },
    { label: "Active Events",  value: "7",    color: darkMode ? "bg-pink-900   text-pink-200"   : "bg-pink-100   text-pink-700"   },
  ];

  const recentActivity = [
    { school: "St. Mary's School", program: "Science Olympiad", date: "2025-04-28", participants: 45 },
    { school: "Green Valley High", program: "Math Bowl",        date: "2025-04-25", participants: 30 },
    { school: "Sunrise Academy",   program: "Coding Cup",       date: "2025-04-20", participants: 60 },
    { school: "Blue Ridge School", program: "Debate League",    date: "2025-04-18", participants: 25 },
  ];

  const quickActions = [
    { label: "Add School",        page: "Add Schools",       color: "bg-blue-500   hover:bg-blue-600"   },
    { label: "Search Scoreboard", page: "Search Scoreboard", color: "bg-green-500  hover:bg-green-600"  },
    { label: "Add Users",         page: "Add Users",         color: "bg-purple-500 hover:bg-purple-600" },
  ];
  // ───────────────────────

  const dm = {
    page:       darkMode ? "bg-gray-900 border-gray-700 text-white"          : "bg-white border-gray-300 text-gray-900",
    title:      darkMode ? "border-gray-700"                                  : "border-gray-200",
    sidebar:    darkMode ? "bg-gray-900 border-gray-700"                      : "bg-white border-gray-400",
    main:       darkMode ? "bg-gray-800"                                      : "bg-gray-50",
    card:       darkMode ? "bg-gray-800 border-gray-700"                      : "bg-white border-gray-200",
    text:       darkMode ? "text-gray-100"                                    : "text-gray-700",
    subtext:    darkMode ? "text-gray-400"                                    : "text-gray-500",
    thead:      darkMode ? "bg-gray-700 text-gray-300"                        : "bg-gray-50 text-gray-500",
    trow:       darkMode ? "border-gray-700 hover:bg-gray-700"                : "border-gray-100 hover:bg-blue-50",
    tcell:      darkMode ? "text-gray-200"                                    : "text-gray-800",
    mobileMenu: darkMode ? "bg-gray-800 border-gray-700"                      : "bg-white border-gray-200",
    overlay:    "bg-black bg-opacity-50",
  };

  return (
    <div className={`min-h-screen border-2 border-dashed rounded-xl font-mono transition-colors duration-300 ${dm.page}`}>

      {/* ── Top Bar ── */}
      <div className={`flex items-center justify-between px-4 py-4 border-b ${dm.title}`}>

        {/* Hamburger (mobile) */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className={`text-base md:text-xl font-bold text-center flex-1 ${dm.text}`}>
          Welcome to Entercon Score Page!
        </h1>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
            darkMode
              ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-73px)] relative">

        {/* ── Mobile Overlay ── */}
        {sidebarOpen && (
          <div
            className={`fixed inset-0 z-40 md:hidden ${dm.overlay}`}
            onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Sidebar ── */}
        <div className={`
          fixed md:static z-50 top-0 left-0 h-full
          w-64 md:w-56
          flex flex-col gap-6 px-6 py-8
          border-r transition-transform duration-300
          ${dm.sidebar}
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
        `}>
          {/* Close button (mobile) */}
          <div className="flex items-center justify-between md:hidden mb-2">
            <span className={`text-sm font-bold ${dm.text}`}>Menu</span>
            <button onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
          </div>

          {navItems.map((item, index) => (
            <button
              key={item}
              onClick={() => {
                setActivePage(item);
                setSidebarOpen(false);
                navigate(url[index], { state: { username, users, school, darkMode } });
              }}
              className={`text-left text-sm font-mono transition-all duration-150 hover:text-blue-500 ${
                activePage === item
                  ? "text-blue-500 font-bold"
                  : dm.text
              }`}>
              {item}
            </button>
          ))}
        </div>

        {/* ── Main Content ── */}
        <div className={`flex-1 px-4 md:px-10 py-6 md:py-8 flex flex-col gap-6 md:gap-8 ${dm.main}`}>

          {/* Welcome Banner */}
          <div className="bg-blue-600 rounded-xl px-5 md:px-8 py-5 md:py-6 text-white flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold mb-1">Hello, {username} 👋</h2>
              <p className="text-xs md:text-sm text-blue-100">Here's what's happening with Entercon today.</p>
            </div>
            <div className="text-3xl md:text-4xl">🏆</div>
          </div>

          {/* Stat Cards — 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat) => (
              <div key={stat.label}
                className={`rounded-xl px-4 md:px-5 py-3 md:py-4 flex flex-col gap-1 ${stat.color}`}>
                <span className="text-xl md:text-2xl font-bold">{stat.value}</span>
                <span className="text-xs font-semibold uppercase tracking-wide opacity-80">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Recent Activity + Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

            {/* Recent Activity Table */}
            <div className={`md:col-span-2 border rounded-xl overflow-hidden ${dm.card}`}>
              <div className={`px-5 py-3 border-b ${dm.title}`}>
                <h3 className={`text-sm font-bold ${dm.text}`}>Recent Activity</h3>
              </div>
              {/* Scrollable on mobile */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[400px]">
                  <thead className={`uppercase tracking-wide ${dm.thead}`}>
                    <tr>
                      <th className="px-5 py-2 text-left font-semibold">School</th>
                      <th className="px-5 py-2 text-left font-semibold">Program</th>
                      <th className="px-5 py-2 text-left font-semibold">Date</th>
                      <th className="px-5 py-2 text-left font-semibold">Participants</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((row, i) => (
                      <tr key={i} className={`border-t transition-colors ${dm.trow}`}>
                        <td className={`px-5 py-2.5 font-medium ${dm.tcell}`}>{row.school}</td>
                        <td className={`px-5 py-2.5 ${dm.subtext}`}>{row.program}</td>
                        <td className={`px-5 py-2.5 ${dm.subtext}`}>{row.date}</td>
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
            </div>

            {/* Quick Actions */}
            <div className={`border rounded-xl p-5 flex flex-col gap-4 ${dm.card}`}>
              <h3 className={`text-sm font-bold border-b pb-3 ${dm.text} ${dm.title}`}>Quick Actions</h3>
              {quickActions.map((action, index) => (
                <button
                  key={action.label}
                  onClick={() => {
                    setActivePage(action.page);
                    navigate(url[index + 1], { state: { username, users, school, darkMode } });
                  }}
                  className={`w-full text-white text-sm font-bold py-2.5 rounded-lg transition-all duration-150 active:scale-95 ${action.color}`}>
                  {action.label}
                </button>
              ))}

              {/* Mini Summary */}
              <div className={`mt-2 rounded-lg p-3 border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-100"}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${dm.subtext}`}>Next Event</p>
                <p className={`text-sm font-bold ${dm.text}`}>Science Olympiad</p>
                <p className={`text-xs ${dm.subtext}`}>St. Mary's School</p>
                <p className="text-xs text-blue-500 mt-1 font-semibold">📅 2025-05-10</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}