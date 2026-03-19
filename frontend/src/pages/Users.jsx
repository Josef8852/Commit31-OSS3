import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUsers, FaShieldAlt } from "react-icons/fa";
import api from "../api/client";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fontStyle = { fontFamily: "'Space Mono', monospace" };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const query = debouncedSearch
          ? `?search=${encodeURIComponent(debouncedSearch)}`
          : "";
        const data = await api.get(`/api/users${query}`);
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [debouncedSearch]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString([], {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-[70vh] py-12 px-4 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-4 border-black p-6 mb-6 bg-yellow-300 shadow-[6px_6px_0px_#000]">
          <h1
            className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3"
            style={fontStyle}
          >
            <FaUsers /> Users
          </h1>
          <p className="text-sm font-bold mt-1 opacity-70" style={fontStyle}>
            Browse registered users
          </p>
        </div>

        {/* Search */}
        <div className="border-4 border-black p-4 mb-6 bg-white shadow-[4px_4px_0px_#000]">
          <div className="flex items-center gap-3">
            <FaSearch size={18} className="shrink-0 opacity-50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="flex-1 border-2 border-black p-3 text-sm font-bold outline-none focus:bg-yellow-50 transition-colors"
              style={fontStyle}
            />
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="border-4 border-black p-8 bg-white shadow-[4px_4px_0px_#000] text-center">
            <p
              className="text-sm font-black uppercase animate-pulse"
              style={fontStyle}
            >
              Loading users...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="border-4 border-black p-8 bg-white shadow-[4px_4px_0px_#000] text-center">
            <FaUsers size={32} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-black uppercase" style={fontStyle}>
              {debouncedSearch ? "No users found" : "No other users registered yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {users.map((u) => (
              <Link
                key={u._id}
                to={`/users/${u._id}`}
                className="border-4 border-black p-5 bg-white shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-base font-black uppercase truncate group-hover:text-yellow-600 transition-colors"
                      style={fontStyle}
                    >
                      {u.name}
                    </h3>
                    <p
                      className="text-xs font-bold opacity-60 truncate mt-1"
                      style={fontStyle}
                    >
                      {u.email}
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 border-2 border-black px-2 py-0.5 bg-black text-yellow-300 text-[10px] font-black uppercase shrink-0"
                    style={fontStyle}
                  >
                    <FaShieldAlt size={9} />
                    {u.role}
                  </span>
                </div>
                {u.createdAt && (
                  <p
                    className="text-[10px] font-bold opacity-40 mt-3"
                    style={fontStyle}
                  >
                    Joined {formatDate(u.createdAt)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
