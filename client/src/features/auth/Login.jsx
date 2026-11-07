
import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-[#F7F5EF] flex items-center justify-center p-5">

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-sm border border-[#EAE7DF]">

        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-between bg-[#EAEFE8] p-12">

          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#246B52] flex items-center justify-center text-white font-bold">
                R
              </div>
              <span className="text-xl font-semibold text-[#244D3D]">
                Ryth Core
              </span>
            </div>

            <div className="mt-20">
              <p className="text-sm uppercase tracking-[3px] text-[#49735D]">
                Connection • Discovery • Growth
              </p>

              <h1 className="mt-5 text-5xl font-serif text-[#244D3D] leading-tight">
                Your next
                <br />
                opportunity
                <br />
                <span className="italic">starts here.</span>
              </h1>

              <p className="mt-6 text-[#66766B] leading-7 max-w-sm">
                Discover creators, connect with like-minded
                people, and build meaningful relationships
                that move you forward.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#C6D7C7] border-2 border-[#EAEFE8]" />
              <div className="w-10 h-10 rounded-full bg-[#D7C9B6] border-2 border-[#EAEFE8]" />
              <div className="w-10 h-10 rounded-full bg-[#A9C5B3] border-2 border-[#EAEFE8]" />
            </div>

            <p className="mt-4 text-sm text-[#66766B]">
              A community built around growth.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">

          <div className="md:hidden flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-full bg-[#246B52] flex items-center justify-center text-white font-bold">
              R
            </div>
            <span className="text-xl font-semibold text-[#244D3D]">
              Ryth Core
            </span>
          </div>

          <div>
            <p className="text-sm font-medium text-[#246B52]">
              WELCOME BACK
            </p>

            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-[#244D3D]">
              Sign in to your account
            </h2>

            <p className="mt-3 text-[#7A817B] text-sm leading-6">
              Pick up where you left off. Your network awaits.
            </p>
          </div>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#34483B] mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-[#E3E5DF] bg-[#FCFCFA] text-sm focus:outline-none focus:border-[#246B52] focus:ring-2 focus:ring-[#246B52]/10 transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#34483B]"
                >
                  Password
                </label>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-[#E3E5DF] bg-[#FCFCFA] text-sm focus:outline-none focus:border-[#246B52] focus:ring-2 focus:ring-[#246B52]/10 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#246B52] text-white text-sm font-semibold hover:bg-[#1C5943] transition shadow-sm"
            >
              Sign In →
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#7A817B]">
              New to Ryth Core?{' '}
              <Link
                to="/register"
                className="text-[#246B52] font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          <p className="mt-10 text-center text-xs text-[#A0A59F]">
            © 2026 Ryth Core. Built for meaningful connections.
          </p>
        </div>
      </div>
    </div>
  );
}
