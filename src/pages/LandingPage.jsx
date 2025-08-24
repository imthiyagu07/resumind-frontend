import { Link, Navigate } from "react-router-dom"
import Cookies from 'js-cookie'

const LandingPage = () => {
  const token = Cookies.get('token')
  if (token) return <Navigate to='/home' replace />
  return (
    <main className="bg-[url(/images/bg-main.svg)] bg-cover min-h-svh">
      {/* Navbar */}
      <nav className="navbar flex justify-between items-center px-6 py-4">
        <Link to="/">
          <p className="text-2xl max-sm:text-lg font-bold text-gradient">RESUMIND</p>
        </Link>
        <Link to="/signup">
          <button
            type="button"
            className="bg-white cursor-pointer px-6 py-2 hover:bg-neutral-700 hover:text-white transition duration-400 text-neutral-600 font-semibold rounded-full border-2 border-neutral-500"
          >
            Try Now
          </button>
        </Link>
      </nav>

      {/* Bento Grid Layout */}
        <section className="grid grid-cols-1 gap-6 p-6 max-w-7xl mx-auto
                        md:grid-cols-6 md:grid-rows-6">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg flex flex-col justify-center items-center text-center p-10
                        md:col-span-4 md:row-span-3">
            <h1 className="!text-5xl max-sm:!text-4xl !font-bold text-neutral-800">
            AI That Supercharges Your Resume
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
            Upload your resume and let AI analyze it instantly. Get actionable
            feedback to improve your chances of landing your dream job.
            </p>
            <Link to="/signup">
              <button className="bg-neutral-600 cursor-pointer mt-6 px-6 py-3 text-white rounded-full font-semibold">
                Upload Resume
              </button>
            </Link>
        </div>

        {/* Problem Section */}
        <div className="bg-neutral-900 text-white rounded-2xl shadow-lg p-8 flex flex-col justify-center
                        md:col-span-2 md:row-span-3">
            <h2 className="!text-3xl max-sm:!text-2xl !text-white font-bold mb-4">Why Job Seekers Struggle 🚧</h2>
            <ul className="space-y-3 text-gray-300 text-sm">
            <li>❌ Weak Formatting</li>
            <li>❌ Missing Keywords</li>
            <li>❌ Lack of Impact</li>
            </ul>
            <p className="mt-4 text-gray-200 text-md font-semibold">
            RESUMIND turns rejections into opportunities 🚀
            </p>
        </div>

        {/* Feature: Instant Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center
                        md:col-span-2 md:row-span-2">
            <div className="flex flex-row items-center">
              <span className="text-2xl">⚡</span>
              <h3 className="!text-2xl font-semibold text-blue-600 min-lg:!text-3xl">Instant Analysis</h3>
            </div>
            <p className="mt-2 text-gray-600 text-md px-3">
            Get feedback on formatting, keywords, and overall strength in seconds.
            </p>
        </div>

        {/* Feature: AI Suggestions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center
                        md:col-span-2 md:row-span-2">
            <div className="flex flex-row gap-2 items-center">
              <span className="text-2xl">🤖</span>
              <h3 className="!text-2xl font-semibold text-blue-600 min-lg:!text-3xl">AI Suggestions</h3>
            </div>
            <p className="mt-2 text-gray-600 text-md">
            Our AI tells you what’s missing and how to improve your resume.
            </p>
        </div>

        {/* Feature: Boost Success */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center
                        md:col-span-2 md:row-span-2">
            <div className="flex flex-row gap-2 items-center">
              <span className="text-xl">🚀</span>
              <h3 className="!text-2xl font-semibold text-blue-600 min-lg:!text-3xl">Boost Success</h3>
            </div>
            <p className="mt-2 text-gray-600 text-md">
            Stand out to recruiters with a resume that highlights your strengths.
            </p>
        </div>
        </section>

        {/* Footer */}
      <footer className="text-center pb-10">
        <p className="text-gray-600">&copy; 2025 RESUMIND. All rights reserved.</p>
      </footer>
    </main>
  )
}

export default LandingPage
