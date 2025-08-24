import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import ResumeCard from "../components/ResumeCard";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie'
import {Toaster, toast} from 'react-hot-toast'

const Home = () => {
  const [userData, setUserData] = useState([])
  const token = Cookies.get("token")

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch("https://resumind-backend-adfz.onrender.com/api/resume", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const data = await response.json()
        if (response.ok) {
          setUserData(data);
        } else {
          toast.error(data.message || "Failed to fetch resumes.");
        }
      } catch (err) {
        toast.error(err.message || "Something went wrong.");
      }
    }
    if (token) getUserData()
  }, [token]);

  return (
    <main className='bg-[url(/images/bg-small.svg)] bg-cover'>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar upload={true} />
      <section className='main-section'>
        <div className="page-heading">
          <h1>Track Your Applications & Resume Ratings</h1>
          {userData.length === 0 ? (<div className="space-y-8">
              <h2 className="max-sm:!px-4">No resumes found. Upload your first resume to get feedback.</h2>
              <Link to="/upload">
              <button type="button" className="primary-button w-fit max-sm:text-sm">
                Upload Resume
              </button>
            </Link>
            </div>) :
          <h2 className="max-sm:!px-4">Review your submissions and check AI-powered feedback.</h2>}
        </div>
      </section>
      <div className="resumes-section">
        {userData && userData.map((each) => <ResumeCard key={each._id} resume={each} onDelete={(id) => setUserData(userData.filter(item => item._id !== id))} />)}
      </div>
    </main>
  )
}

export default Home