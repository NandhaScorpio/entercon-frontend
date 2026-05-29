import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const date = new Date().toISOString().split("T")[0];

  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state.username;
  const users = location.state.users;
  const school = location.state.school;
  const darkModeStatus = location.state.darkMode;
  const navItems = [
    "Dashboard",
    "Add Schools",
    "Search Scoreboard",
    "Add Users",
  ];
  const url = ["/dashboard", "/add-school", "/search-scoreboard", "/add-users"];

  const activeEvents = () => {
    return school.filter((row) => {
      return date >= row.startDate && date <= row.endDate;
    }).length;
  };

  var totalActiveEvents = activeEvents();

  useEffect(() => {
    setDarkMode(darkModeStatus);
  }, [darkModeStatus]);

  const data = school;

  const totalPrograms = data.length;

  const totalSchools = new Set(
    data.map((item) => item.schoolName.trim().toLowerCase()),
  ).size;

  const participants = data.reduce((sum, item) => sum + item.participants, 0);

  const stats = [
    {
      label: "Total Schools",
      value: totalSchools,
      color: darkMode
        ? "bg-blue-900 text-blue-200"
        : "bg-blue-100 text-blue-700",
    },
    {
      label: "Total Programs",
      value: totalPrograms,
      color: darkMode
        ? "bg-green-900 text-green-200"
        : "bg-green-100 text-green-700",
    },
    {
      label: "Participants",
      value: participants,
      color: darkMode
        ? "bg-yellow-900 text-yellow-200"
        : "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Active Events",
      value: totalActiveEvents,
      color: darkMode
        ? "bg-pink-900 text-pink-200"
        : "bg-pink-100 text-pink-700",
    },
  ];

  const recentActivity = school;

  const quickActions = [
    {
      label: "Add School",
      page: "Add Schools",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      label: "Search Scoreboard",
      page: "Search Scoreboard",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      label: "Add Users",
      page: "Add Users",
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  const dm = {
    page: darkMode
      ? "bg-gray-900 border-gray-700 text-white"
      : "bg-white border-gray-300 text-gray-900",
    title: darkMode ? "border-gray-700" : "border-gray-200",
    sidebar: darkMode
      ? "bg-gray-900 border-gray-700"
      : "bg-white border-gray-400",
    main: darkMode ? "bg-gray-800" : "bg-gray-50",
    card: darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    text: darkMode ? "text-gray-100" : "text-gray-700",
    subtext: darkMode ? "text-gray-400" : "text-gray-500",
    thead: darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-500",
    trow: darkMode
      ? "border-gray-700 hover:bg-gray-700"
      : "border-gray-100 hover:bg-blue-50",
    tcell: darkMode ? "text-gray-200" : "text-gray-800",
    mobileMenu: darkMode
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200",
    overlay: "bg-black bg-opacity-50",
  };

  return (
    <div
      className={`min-h-screen border-2 border-dashed rounded-xl font-mono transition-colors duration-300 ${dm.page}`}
    >
      {/* Top Bar */}
      <div
        className={`flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b gap-2 ${dm.title}`}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-highlight"
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
          className={`text-sm sm:text-base md:text-xl font-bold text-center flex-1 min-w-0 ${dm.text}`}
        >
          Welcome to Entercon Score Page!
        </h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0 touch-highlight ${
            darkMode
              ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          {darkMode ? "☀️" : "🌙"}
          <span className="hidden sm:inline">{darkMode ? "Light" : "Dark"}</span>
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-73px)] relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className={`fixed inset-0 z-40 md:hidden ${dm.overlay}`}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          fixed md:static z-50 top-0 left-0 h-full
          w-64 md:w-56
          flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 py-6 sm:py-8
          border-r transition-transform duration-300
          ${dm.sidebar}
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
        `}
        >
          <div className="flex items-center justify-between md:hidden mb-2">
            <span className={`text-xs sm:text-sm font-bold ${dm.text}`}>Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600 font-bold text-lg touch-highlight"
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
                  state: { username, users, school, darkMode },
                });
              }}
              className={`text-left text-xs sm:text-sm font-mono transition-all duration-150 hover:text-blue-500 py-2 px-2 rounded-lg touch-highlight ${
                activePage === item ? "text-blue-500 font-bold bg-opacity-10 bg-blue-500" : dm.text
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 px-3 sm:px-4 md:px-6 lg:px-10 py-4 sm:py-5 md:py-6 lg:py-8 flex flex-col gap-3 sm:gap-4 md:gap-6 overflow-x-hidden ${dm.main}`}
        >
          {/* Welcome Banner */}
          <div className="bg-blue-600 rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-white flex items-center justify-between gap-2 sm:gap-3">
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base md:text-lg font-bold mb-0.5 sm:mb-1">
                Hello, {username} 👋
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 truncate">
                Here's what's happening with Entercon today.
              </p>
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl shrink-0">🏆</div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 flex flex-col gap-0.5 sm:gap-1 ${stat.color}`}
              >
                <span className="text-lg sm:text-xl md:text-2xl font-bold">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide opacity-80 line-clamp-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Recent Activity + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {/* Recent Activity Table */}
            <div
              className={`lg:col-span-2 border rounded-lg sm:rounded-xl overflow-hidden ${dm.card}`}
            >
              <div className={`px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 border-b ${dm.title}`}>
                <h3 className={`text-xs sm:text-sm font-bold ${dm.text}`}>
                  Recent Activity
                </h3>
              </div>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead className={`uppercase tracking-wide ${dm.thead}`}>
                    <tr>
                      <th className="px-3 sm:px-4 md:px-5 py-2.5 text-left font-semibold">
                        School
                      </th>
                      <th className="px-3 sm:px-4 md:px-5 py-2.5 text-left font-semibold">
                        Program
                      </th>
                      <th className="px-3 sm:px-4 md:px-5 py-2.5 text-left font-semibold">
                        Date
                      </th>
                      <th className="px-3 sm:px-4 md:px-5 py-2.5 text-left font-semibold">
                        Participants
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-t transition-colors ${dm.trow}`}
                      >
                        <td className={`px-3 sm:px-4 md:px-5 py-2.5 font-medium ${dm.tcell}`}>
                          {row.schoolName}
                        </td>
                        <td className={`px-3 sm:px-4 md:px-5 py-2.5 ${dm.subtext}`}>
                          {row.programName}
                        </td>
                        <td className={`px-3 sm:px-4 md:px-5 py-2.5 ${dm.subtext}`}>
                          {row.startDate}
                        </td>
                        <td className="px-3 sm:px-4 md:px-5 py-2.5">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold inline-block">
                            {row.participants}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-2 p-2 sm:p-3">
                {recentActivity.slice(0, 5).map((row, i) => (
                  <div key={i} className={`border rounded-lg p-2.5 sm:p-3 ${darkMode ? "border-gray-700 bg-gray-700 bg-opacity-50" : "border-gray-200 bg-gray-50"}`}>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className={`text-xs font-semibold ${dm.subtext}`}>School</p>
                        <p className={`text-xs font-bold ${dm.text} truncate`}>{row.schoolName}</p>
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${dm.subtext}`}>Program</p>
                        <p className={`text-xs font-bold ${dm.text} truncate`}>{row.programName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className={`text-xs font-semibold ${dm.subtext}`}>Date</p>
                        <p className={`text-xs ${dm.text}`}>{row.startDate}</p>
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${dm.subtext}`}>Participants</p>
                        <p className={`text-xs font-bold ${dm.text}`}>{row.participants}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className={`border rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 flex flex-col gap-2 sm:gap-3 ${dm.card}`}
            >
              <h3
                className={`text-xs sm:text-sm font-bold border-b pb-2 sm:pb-3 ${dm.text} ${dm.title}`}
              >
                Quick Actions
              </h3>
              {quickActions.map((action, index) => (
                <button
                  key={action.label}
                  onClick={() => {
                    setActivePage(action.page);
                    navigate(url[index + 1], {
                      state: { username, users, school, darkMode },
                    });
                  }}
                  className={`w-full text-white text-xs sm:text-sm font-bold py-2 sm:py-2.5 md:py-3 rounded-lg transition-all duration-150 active:scale-95 touch-highlight ${action.color}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
