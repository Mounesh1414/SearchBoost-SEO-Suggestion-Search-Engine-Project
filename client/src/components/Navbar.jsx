import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="text-white font-bold text-xl tracking-tight">SearchBoost</span>
            <span className="hidden sm:inline text-blue-200 text-sm">SEO Engine</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-blue-100 hover:text-white text-sm font-medium">Home</Link>
            <Link to="/analyzer" className="text-blue-100 hover:text-white text-sm font-medium">Analyzer</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-blue-100 hover:text-white text-sm font-medium">Dashboard</Link>
                {isAdmin && (
                  <Link to="/admin" className="text-yellow-300 hover:text-yellow-100 text-sm font-medium">Admin</Link>
                )}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:block text-blue-200 text-sm">{user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-100 hover:text-white text-sm font-medium">Login</Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-400 text-white text-sm px-4 py-1.5 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
