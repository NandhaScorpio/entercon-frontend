import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  var [data, setData] = useState();
  var [user, setUser] = useState();

  axios.get("https://entercon-backend.onrender.com/")
    .then((d) => {
      setData(d.data);
      setUser(d.data.users);
    })
    .catch((e) => console.log(e));

  const handleEnter = () => {

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    const currentUser = user.find(
      (u) => u.name === username && u.password === password
    );

    if (currentUser) {

      navigate("/dashboard", {
        state: {
          username: username,
          users: user,
          data: data,
          school: data.schools,
          darkMode: darkMode
        }
      });

    } else {
      alert("Invalid username or password.");
    }
  };

  // ── Dark Mode Classes ──

  const dm = {
    bg: darkMode
      ? "bg-gray-950"
      : "bg-blue-50",

    card: darkMode
      ? "bg-gray-900 border-gray-700"
      : "bg-white border-blue-200",

    title: darkMode
      ? "text-white"
      : "text-gray-900",

    label: darkMode
      ? "text-gray-200"
      : "text-gray-900",

    input: darkMode
      ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-500"
      : "bg-gray-50 border-gray-400 text-gray-500 focus:border-blue-400",

    toggle: darkMode
      ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
      : "bg-gray-800 text-white hover:bg-gray-700",
  };

  return (

    <div className={`min-h-screen flex items-center justify-center px-4 py-6 transition-colors duration-300 ${dm.bg}`}>

      {/* Dark Mode Toggle */}

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-5 right-5 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95 ${dm.toggle}`}
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      {/* Login Card */}

      <div className={`border-2 border-dashed rounded-2xl w-full max-w-[500px] px-6 sm:px-10 md:px-16 py-10 md:py-14 flex flex-col items-center shadow-sm transition-colors duration-300 ${dm.card}`}>

        {/* Title */}

        <h1 className={`text-lg sm:text-xl md:text-2xl font-bold mb-10 text-center font-mono leading-relaxed ${dm.title}`}>
          Welcome to Entercon Scoreboard Page!
        </h1>

        {/* Username */}

        <div className="flex flex-col sm:flex-row sm:items-center w-full mb-6 gap-2 sm:gap-0">

          <label className={`font-bold w-full sm:w-28 sm:text-right sm:mr-4 font-mono text-sm ${dm.label}`}>
            Username:
          </label>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`border rounded-lg px-4 py-2.5 text-sm font-mono w-full focus:outline-none transition-all ${dm.input}`}
          />

        </div>

        {/* Password */}

        <div className="flex flex-col sm:flex-row sm:items-center w-full mb-8 gap-2 sm:gap-0">

          <label className={`font-bold w-full sm:w-28 sm:text-right sm:mr-4 font-mono text-sm ${dm.label}`}>
            Password:
          </label>

          <div className="relative w-full">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border rounded-lg px-4 py-2.5 pr-14 text-sm font-mono w-full focus:outline-none transition-all ${dm.input}`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold ${
                darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

        </div>

        {/* Enter Button */}

        <button
          onClick={handleEnter}
          className="bg-sky-400 hover:bg-sky-500 active:scale-95 text-white font-bold font-mono text-sm md:text-base px-10 md:px-12 py-2.5 rounded-full transition-all duration-150 w-full sm:w-auto"
        >
          Enter
        </button>

      </div>

    </div>
  );
}