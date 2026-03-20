import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaComments, FaArrowLeft } from "react-icons/fa";
import api from "../api/client";
import useAuth from "../context/useAuth";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fontStyle = { fontFamily: "'Space Mono', monospace" };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get(`/api/users/${id}`);
        setProfile(data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleMessage = () => {
    navigate(
      `/messages?user=${profile._id}&name=${encodeURIComponent(profile.name)}&email=${encodeURIComponent(profile.email)}`
    );
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString([], {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center mt-16">
        <div className="border-4 border-black p-8 bg-yellow-300 shadow-[6px_6px_0px_#000]">
          <p className="text-xl font-black uppercase animate-pulse" style={fontStyle}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center mt-16">
        <div className="border-4 border-black p-8 bg-red-500 text-white shadow-[6px_6px_0px_#000]">
          <p className="text-xl font-black uppercase" style={fontStyle}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profile?._id;

  return (
    <div className="min-h-[70vh] py-12 px-4 mt-16">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-2 text-sm font-black uppercase mb-4 border-2 border-black px-4 py-2 bg-white hover:bg-black hover:text-yellow-300 transition-colors shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] cursor-pointer"
          style={fontStyle}
        >
          <FaArrowLeft size={12} /> Back to Users
        </button>

        {/* Profile Header */}
        <div className="border-4 border-black p-6 mb-6 bg-yellow-300 shadow-[6px_6px_0px_#000]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1
                className="text-3xl font-black uppercase tracking-tighter"
                style={fontStyle}
              >
                {profile.name}
              </h1>
              <p className="text-sm font-bold mt-1 opacity-70" style={fontStyle}>
                {profile.email}
              </p>
              {profile.createdAt && (
                <p className="text-xs font-bold mt-2 opacity-50" style={fontStyle}>
                  Member since {formatDate(profile.createdAt)}
                </p>
              )}
            </div>
            <span
              className="inline-flex items-center gap-1 border-2 border-black px-3 py-1 bg-black text-yellow-300 text-xs font-black uppercase"
              style={fontStyle}
            >
              <FaShieldAlt size={12} />
              {profile.role}
            </span>
          </div>
        </div>

        {/* Details Card */}
        <div className="border-4 border-black p-6 mb-6 bg-white shadow-[6px_6px_0px_#000]">
          <h2
            className="text-lg font-black uppercase flex items-center gap-2 mb-4"
            style={fontStyle}
          >
            <FaUser /> Details
          </h2>

          <div className="space-y-4">
            <div>
              <label
                className="text-xs font-black uppercase mb-1 block opacity-60"
                style={fontStyle}
              >
                <FaEnvelope className="inline mr-1" size={12} />
                Email
              </label>
              <div
                className="w-full border-2 border-black p-3 font-bold bg-gray-50"
                style={fontStyle}
              >
                {profile.email}
              </div>
            </div>

            <div>
              <label
                className="text-xs font-black uppercase mb-1 block opacity-60"
                style={fontStyle}
              >
                <FaPhone className="inline mr-1" size={12} />
                Contact Number
              </label>
              <div
                className="w-full border-2 border-black p-3 font-bold bg-gray-50"
                style={fontStyle}
              >
                {profile.contactNumber || "Not provided"}
              </div>
            </div>
          </div>
        </div>

        {/* Message Button (only show for other users) */}
        {!isOwnProfile && (
          <div className="space-y-2">
            <button
              onClick={handleMessage}
              className="w-full border-4 border-black p-4 bg-green-400 font-black uppercase text-lg flex items-center justify-center gap-3 hover:bg-black hover:text-green-400 transition-all shadow-[6px_6px_0px_#000] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] cursor-pointer"
              style={fontStyle}
            >
              <FaComments size={22} />
              Send Message
            </button>
            <p className="text-[10px] font-bold text-center opacity-40" style={fontStyle}>
              New conversations require a linked lost/found item
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
