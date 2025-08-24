import {useState} from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})

    const onSubmitSuccess = (token) => {
        Cookies.set('token', token, {expires: 30})
        navigate('/home')
    }

    const handleUserLogin = async (e) => {
        e.preventDefault()
        let newErrors = {}
        if (!email.trim()) newErrors.email = "* required"
        if (!password.trim()) newErrors.password = "* required"
        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            return; // Stop submission if errors exist
        }
        try {
            const url = 'https://resumind-backend-adfz.onrender.com/api/auth/login'
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: email, password: password})
            }
            const response = await fetch(url, options)
            const data = await response.json()
            if (response.ok === true){
                onSubmitSuccess(data.token)
                setEmail("")
                setPassword("")
            } else {
                console.error(data.message)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const token = Cookies.get('token')
    if (token) return <Navigate to='/home' replace />

    return (
        <main className="bg-[url(/images/bg-auth.svg)] bg-cover min-h-screen flex flex-col items-center justify-center">
            <div className="gradient-border shadow-lg mt-6">
                <section className="flex flex-col gap-5 bg-white rounded-2xl p-10 text-center">
                    <div>
                        <h1 className='max-sm:!text-3xl !mb-3'>Welcome Back</h1>
                    <h2 className='!text-2xl max-sm:!text-sm'>Log In to Continue Your Job Journey</h2>
                    </div>
                    <form className='mt-5 max-sm:mt-0' onSubmit={handleUserLogin}>
                        <div className="form-div">
                            <label>
                            Email
                            </label>
                            <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        <div className="form-div">
                            <label>
                            Password
                            </label>
                            <input
                            type="password"
                            placeholder="•••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>
                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Log In
                        </button>
                        <div className='text-center w-full'>
                            <p className="text-center text-gray-600 text-sm mt-6">
                                Don't have an account?{" "}
                                <Link
                                    to="/signup"
                                    className="text-neutral-700 font-semibold hover:underline"
                                >
                                    Create One
                                </Link>
                            </p>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    )
}

export default Login