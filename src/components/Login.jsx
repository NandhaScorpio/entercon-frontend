import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  var user = [{username: "admin", password: "admin"}, {username: "Nandha", password: "12345"}]

  const handleEnter = () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    const currentUser = user.find(
      (u) => u.username === username && u.password === password
    );
    if (currentUser) {
      navigate("/dashboard", { state: { username: username } });
    } else {
      alert("Invalid username or password.");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white border-2 border-dashed border-blue-200 rounded-xl px-16 py-14 w-[480px] flex flex-col items-center shadow-sm">

        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-10 text-center font-mono">
          Welcome to Entercon Scoreboard Page!
        </h1>

        {/* Username Field */}
        <div className="flex items-center w-full mb-6">
          <label className="font-bold text-gray-900 w-28 text-right mr-4 font-mono text-sm">
            Username:
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-400 rounded px-4 py-2 text-sm text-gray-500 font-mono w-48 focus:outline-none focus:border-blue-400 bg-gray-50"
          />
        </div>

        {/* Password Field */}
        <div className="flex items-center w-full mb-8">
          <label className="font-bold text-gray-900 w-28 text-right mr-4 font-mono text-sm">
            Password:
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 rounded px-4 py-2 text-sm text-gray-500 font-mono w-48 focus:outline-none focus:border-blue-400 bg-gray-50"
          />
        </div>

        {/* Enter Button */}
        <button
          onClick={handleEnter}
          className="bg-sky-400 hover:bg-sky-500 active:scale-95 text-white font-bold font-mono text-base px-12 py-2.5 rounded-full transition-all duration-150"
        >
          Enter
        </button>

      </div>
    </div>
  );
}