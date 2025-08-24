import { BrowserRouter, Routes, Route} from "react-router-dom";
import ProtectedRoute from './ProtectedRoute'
import Home from "./pages/Home";
import FormSubmission from "./pages/FormSubmission"
import Feedback from "./pages/Feedback";
import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><FormSubmission /></ProtectedRoute>} />
          <Route path="/feedback/:id" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App