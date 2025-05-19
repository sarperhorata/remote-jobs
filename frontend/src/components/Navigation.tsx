import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="Buzz2Remote Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-gray-900">Buzz2Remote</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/jobs" className="text-gray-600 hover:text-gray-900">
              Jobs
            </Link>
            <Link to="/companies" className="text-gray-600 hover:text-gray-900">
              Companies
            </Link>
            <Link to="/resources" className="text-gray-600 hover:text-gray-900">
              Resources
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  {FaUser({ className: "text-lg" })}
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  {FaSignOutAlt({ className: "text-lg" })}
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  {FaSignInAlt({ className: "text-lg" })}
                  <span>Login</span>
                </Link>
                <Link to="/register" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  {FaUserPlus({ className: "text-lg" })}
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? FaTimes({ className: "h-6 w-6" }) : FaBars({ className: "h-6 w-6" })}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Jobs
            </Link>
            <Link
              to="/companies"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Companies
            </Link>
            <Link
              to="/resources"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Resources
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  {FaUser({ className: "text-lg mr-2" })}
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  {FaSignOutAlt({ className: "text-lg mr-2" })}
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  {FaSignInAlt({ className: "text-lg mr-2" })}
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  {FaUserPlus({ className: "text-lg mr-2" })}
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 