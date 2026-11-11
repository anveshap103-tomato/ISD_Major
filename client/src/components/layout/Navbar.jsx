import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Creators', path: '/creators' },
    { name: 'Content', path: '/content' },
    { name: 'Connections', path: '#' },
  ];

  return (
    <header className="w-full bg-[#F7F5EF] border-b border-[#E5E3DC] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left: Brand Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -ml-2 text-[#5A6561] hover:text-[#192521] rounded-lg hover:bg-[#EFECE3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#28634F]/30"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#28634F] flex items-center justify-center text-white shadow-sm group-hover:bg-[#1E4D3D] transition-colors flex-shrink-0">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.54 0 3-.35 4.31-.97-1.32-.97-2.2-2.54-2.2-4.32 0-3.04 2.46-5.5 5.5-5.5 1.78 0 3.35.88 4.32 2.2C21.65 15 22 13.54 22 12c0-5.52-4.48-10-10-10zm-1 15.5c-2.48 0-4.5-2.02-4.5-4.5S8.52 8.5 11 8.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z" />
                </svg>
              </div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#192521]">
                Ryth Core
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/creators'
                  ? location.pathname === '/creators'
                  : location.pathname === link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-1 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#192521] font-semibold'
                      : 'text-[#5A6561] hover:text-[#192521]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-[-17px] left-0 right-0 h-[2.5px] bg-[#28634F] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="p-1.5 text-[#5A6561] hover:text-[#192521] transition-colors rounded-full hover:bg-[#EFECE3]"
              title="Search"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            <button
              type="button"
              className="relative p-1.5 text-[#5A6561] hover:text-[#192521] transition-colors rounded-full hover:bg-[#EFECE3]"
              title="Notifications"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#D9A66C] rounded-full ring-2 ring-[#F7F5EF]" />
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center pl-1">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="User Profile"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#E5E3DC]"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-[#E5E3DC] py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/creators'
                  ? location.pathname === '/creators'
                  : location.pathname === link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EBF3EE] text-[#28634F] font-semibold'
                      : 'text-[#192521] hover:bg-[#EFECE3]'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#28634F]" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
