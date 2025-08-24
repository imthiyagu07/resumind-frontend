import { Link, useNavigate, Navigate } from "react-router-dom"
import { useState } from "react";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import Cookies from 'js-cookie'

const SignUp = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})

    const onSubmitSuccess = (token) => {
        Cookies.set('token', token, {expires: 30})
        navigate('/home')
    }

    const handleSignUp = async (e) => {
        e.preventDefault()

        let newErrors = {};

        if(!fullName.trim()) newErrors.fullName = "* required"

        if(!email.trim()) newErrors.email = "* required"

        if(!password.trim()) newErrors.password = "* required"
        
        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            return; // Stop submission if errors exist
        }

        try {
            const url = 'https://resumind-backend-adfz.onrender.com/api/auth/signup'
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: fullName, email: email, password: password})
            }
            const response = await fetch(url, options)
            const data = await response.json()

            if(response.ok === true){
                onSubmitSuccess(data.token)
                setFullName("")
                setEmail("")
                setPassword("")
            } else {
                console.error(data.message)
            }
        } catch(err){
            console.error(err)
        }
    }

    const token = Cookies.get('token')
    if (token) return <Navigate to='/home' replace />

    return (
        <main className="bg-[url(/images/bg-auth.svg)] bg-cover min-h-screen flex items-center justify-center">
        <div className="gradient-border shadow-lg">
            <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                <div>
                    {/* Logo */}
                    <h1 className="!text-3xl font-bold text-center text-gradient mb-3">
                        RESUMIND
                    </h1>

                    {/* Title */}
                    <h2 className="!text-2xl max-sm:!text-xl font-semibold !text-neutral-800 text-center">
                    Create Your Account
                    </h2>
                    <p className="text-gray-500 text-center mt-2 text-sm">
                    Join RESUMIND and make your resume ∞ times better
                    </p>

                    {/* Signup Form */}
                    <form className="mt-7" onSubmit={handleSignUp}>
                    <div className="form-div">
                        <label>
                        Full Name
                        </label>
                        <input
                        type="text"
                        placeholder="John Doe"
                        onChange={(e) => setFullName(e.target.value)}
                        value={fullName}
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-sm">{errors.fullName}</p>
                        )}
                    </div>

                    <div className="form-div">
                        <label>
                        Email
                        </label>
                        <input
                        type="email"
                        placeholder="you@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>

                    <div className="form-div">
                        <label>
                        Password
                        </label>
                        <div className="relative w-full">
                            <input
                            type={showPassword ? "text" : "password"}
                            placeholder="•••••••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute cursor-pointer inset-y-0 right-5 flex items-center text-gray-500"
                            >
                                {showPassword ? (
                                <VscEye className="w-5 h-5" />
                                ) : (
                                <VscEyeClosed className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="primary-button"
                    >
                        Sign Up
                    </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    <span className="px-3 text-gray-400 text-sm">or</span>
                    <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    {/* Google Signup */}
                    <button className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition">
                    <img
                        src="https://www.svgrepo.com/show/355037/google.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">Sign up with Google</span>
                    </button>

                    {/* Already have account */}
                    <p className="text-center text-gray-600 text-sm mt-6">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-neutral-700 font-semibold hover:underline"
                    >
                        Login
                    </Link>
                    </p>
                </div>
            </section>
        </div>
        </main>
    )
}

export default SignUp
