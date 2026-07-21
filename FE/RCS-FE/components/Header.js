'use client';
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const userRole = user?.data?.role || "Guest";
  const userName = user?.data?.username || 'Guest';

  // Admin Header
  if (userRole === 'admin') {
    return (
      <div className="h-14 bg-emerald-800 flex justify-between items-center px-6 text-white">
        <Link href="/admin/profile">
          <div className="text-2xl font-bold cursor-pointer">Admin Panel</div>
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-sm">{userName}</span>
          <button 
            onClick={logout}
            className="bg-emerald-900 px-4 py-2 rounded hover:bg-emerald-950 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // User Header
  if (userRole === 'user') {
    return (
      <div className="h-14 bg-emerald-800 flex justify-between items-center px-6 text-white">
        <Link href="/homepage">
          <div className="text-2xl font-bold cursor-pointer">KNN Recommendation System</div>
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-sm">{userName}</span>
          <button 
            onClick={logout}
            className="bg-emerald-900 px-4 py-2 rounded hover:bg-emerald-950 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
  return null;
}