import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'

const Navbar = ({upload}) => {
  const navigate = useNavigate()

  const [profile, setProfile] = useState({})
  const [show, setShow] = useState(false)

  const token = Cookies.get("token")

  const handleLogOut = () => {
    Cookies.remove('token')
    navigate("/")
  }

  useEffect(() => {
    const getUserProfile = async () => {
      try{
        const response = await fetch("https://resumind-backend-adfz.onrender.com/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if(response.ok) setProfile(data)
      } catch (err) {
        console.log(err)
      }
    }
    getUserProfile()
  }, [token])

  return (
    <nav className='navbar'>
        {/* logo */}
        <Link to="/">
          <p className='text-2xl max-sm:text-lg font-bold text-gradient'>RESUMIND</p>
        </Link>
        {/* Profile */}
        <div className="relative">
          <div
            className={`bg-gray-100 py-1 px-1 cursor-pointer flex flex-row items-center ${show ? 'rounded-t-2xl' : 'rounded-full'}`}
            onClick={() => setShow(!show)}
          >
            <span className="bg-neutral-500 p-1 rounded-full">
              <img src="/images/profile.svg" alt="profile" className="w-8" />
            </span>
            <div
              className={`flex flex-col transition-all duration-500 ease-in-out overflow-hidden ${
                show ? "max-h-20 opacity-100 px-3" : "max-h-0 opacity-0 px-0 w-0"
              }`}
            >
              <h4>{profile.name}</h4>
              <p className="text-[10px]">{profile.email}</p>
            </div>
          </div>

          {/* Dropdown */}
          {show && (
            <div className="absolute right-0 bg-gray-100 shadow-lg rounded-b-2xl flex flex-col w-full gap-2 p-2">
              {upload && (
                <Link to="/upload">
                <button className="primary-button text-sm">Upload Resume</button>
              </Link>
              )}
              <button className="text-sm cursor-pointer bg-white rounded-full p-2" onClick={handleLogOut}>
                Logout
              </button>
            </div>
          )}
        </div>
    </nav>
  )
}

export default Navbar