import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["Admin", "Trainer"];

const INITIAL_USERS = [
    { id: 1, username: "admin01", password: "pass123", category: "Admin" },
    { id: 2, username: "trainer01", password: "pass123", category: "Trainer" }
];

const CATEGORY_STYLES = {
    Admin: "bg-purple-100 text-purple-700",
    Trainer: "bg-yellow-100 text-yellow-700",
};

export default function AddUsers() {
    const [activePage, setActivePage] = useState("Add Users");
    const [users, setUsers] = useState(INITIAL_USERS);
    const [form, setForm] = useState({ username: "", password: "", category: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [editShowPassword, setEditShowPassword] = useState(false);
    const [showEditPanel, setShowEditPanel] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [saved, setSaved] = useState(false);

    const navItems = ["Dashboard", "Add Schools", "Search Scoreboard", "Add Users"];
    const url = ["/dashboard","/add-school","/search-scoreboard","/add-users"]
    const navigate = useNavigate();

    const inputClass = "border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 font-mono w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white transition";
    const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block";

    const handleAdd = () => {
        if (!form.username.trim() || !form.password.trim() || !form.category) {
            alert("Please fill in all fields."); return;
        }
        if (users.find((u) => u.username === form.username.trim())) {
            alert("Username already exists."); return;
        }
        setUsers([...users, { id: Date.now(), ...form }]);
        setForm({ username: "", password: "", category: "" });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleEditStart = (user) => {
        setEditingId(user.id);
        setEditValues({ username: user.username, password: user.password, category: user.category });
    };

    const handleEditSave = () => {
        if (!editValues.username.trim() || !editValues.password.trim() || !editValues.category) {
            alert("Fill all fields."); return;
        }
        setUsers(users.map((u) => u.id === editingId ? { ...u, ...editValues } : u));
        setEditingId(null);
    };

    const handleDelete = (id) => {
        setUsers(users.filter((u) => u.id !== id));
        if (editingId === id) setEditingId(null);
    };

    const filteredUsers = users.filter((u) =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            <h2 className="text-lg font-bold text-gray-800">Add Users</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Manage user accounts and permissions</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            {saved && (
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                                    ✓ User Added
                                </span>
                            )}
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                {users.length} Users
                            </span>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-5 gap-3">
                        {CATEGORIES.map((cat) => {
                            const count = users.filter((u) => u.category === cat).length;
                            return (
                                <div key={cat} className={`rounded-xl px-4 py-3 border flex flex-col gap-1 ${CATEGORY_STYLES[cat]} border-opacity-30`}>
                                    <span className="text-xl font-bold">{count}</span>
                                    <span className="text-xs font-semibold uppercase tracking-wide opacity-80">{cat}s</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Add User Form Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-700 mb-5 pb-3 border-b border-gray-100">
                            👤 New User Entry
                        </h3>
                        <div className="grid grid-cols-3 gap-5">
                            <div>
                                <label className={labelClass}>Username</label>
                                <input type="text" placeholder="e.g. judge_raj"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className={inputClass + " pr-12"}
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold transition-colors">
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Category</label>
                                <select value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className={inputClass}>
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5 justify-end">
                            <button onClick={() => setForm({ username: "", password: "", category: "" })}
                                className="px-5 py-2 text-sm font-bold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 active:scale-95 transition-all">
                                Clear
                            </button>
                            <button
                                onClick={() => { setShowEditPanel(true); setEditingId(null); }}
                                className="px-5 py-2 text-sm font-bold rounded-lg text-white bg-green-500 hover:bg-green-600 active:scale-95 transition-all">
                                Edit Users
                            </button>
                            <button onClick={handleAdd}
                                className="px-6 py-2 text-sm font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all">
                                Add User
                            </button>
                        </div>
                    </div>

                    {/* Edit Users Panel */}
                    {showEditPanel && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-gray-700">✏️ Edit Users</h3>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="border border-gray-200 rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 w-40"
                                    />
                                    <button onClick={() => { setShowEditPanel(false); setEditingId(null); setSearchQuery(""); }}
                                        className="text-xs text-gray-400 hover:text-gray-600 font-bold transition-colors">
                                        Close ✕
                                    </button>
                                </div>
                            </div>

                            {filteredUsers.length === 0 ? (
                                <div className="px-6 py-10 text-center text-gray-400 text-sm">
                                    No users found matching "{searchQuery}".
                                </div>
                            ) : (
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide">
                                        <tr>
                                            <th className="px-5 py-2.5 text-left font-semibold">#</th>
                                            <th className="px-5 py-2.5 text-left font-semibold">Username</th>
                                            <th className="px-5 py-2.5 text-left font-semibold">Password</th>
                                            <th className="px-5 py-2.5 text-left font-semibold">Category</th>
                                            <th className="px-5 py-2.5 text-right font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user, i) => (
                                            <tr key={user.id} className="border-t border-gray-100 hover:bg-blue-50 transition-colors">
                                                <td className="px-5 py-3">
                                                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{i + 1}</span>
                                                </td>

                                                {/* Username */}
                                                <td className="px-5 py-3 font-medium text-gray-800">
                                                    {editingId === user.id ? (
                                                        <input type="text" value={editValues.username}
                                                            onChange={(e) => setEditValues({ ...editValues, username: e.target.value })}
                                                            className="border border-blue-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300 w-28 bg-white" />
                                                    ) : user.username}
                                                </td>

                                                {/* Password */}
                                                <td className="px-5 py-3 text-gray-500">
                                                    {editingId === user.id ? (
                                                        <div className="relative flex items-center gap-1">
                                                            <input
                                                                type={editShowPassword ? "text" : "password"}
                                                                value={editValues.password}
                                                                onChange={(e) => setEditValues({ ...editValues, password: e.target.value })}
                                                                className="border border-blue-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300 w-24 bg-white"
                                                            />
                                                            <button onClick={() => setEditShowPassword(!editShowPassword)}
                                                                className="text-gray-400 hover:text-gray-600 text-xs font-bold">
                                                                {editShowPassword ? "🙈" : "👁"}
                                                            </button>
                                                        </div>
                                                    ) : "••••••••"}
                                                </td>

                                                {/* Category */}
                                                <td className="px-5 py-3">
                                                    {editingId === user.id ? (
                                                        <select value={editValues.category}
                                                            onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                                                            className="border border-blue-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white">
                                                            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                                        </select>
                                                    ) : (
                                                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${CATEGORY_STYLES[user.category]}`}>
                                                            {user.category}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-3">
                                                    <div className="flex gap-2 justify-end">
                                                        {editingId === user.id ? (
                                                            <>
                                                                <button onClick={handleEditSave}
                                                                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all">
                                                                    Save
                                                                </button>
                                                                <button onClick={() => setEditingId(null)}
                                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all">
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => handleEditStart(user)}
                                                                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all">
                                                                    ✏️ Edit
                                                                </button>
                                                                <button onClick={() => handleDelete(user.id)}
                                                                    className="bg-red-100 hover:bg-red-500 hover:text-white text-red-500 text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all">
                                                                    🗑️ Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}