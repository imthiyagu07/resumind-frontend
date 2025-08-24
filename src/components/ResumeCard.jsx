import { Link } from "react-router-dom"
import ScoreCircle from './ScoreCircle'
import Cookies from 'js-cookie'

const ResumeCard = ({resume, onDelete}) => {

    const token = Cookies.get("token")

    const handleDeleteAppication = async (id) => {
        try {
            const response = await fetch(`https://resumind-backend-adfz.onrender.com/api/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.ok){
                onDelete(id);
            } else {
                console.log("Failed to delete resume");
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    return (
        <div className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-1">
                    {resume.companyName && <h2 className="!text-black text-lg font-bold break-words">{resume.companyName}</h2>}
                    {resume.jobTitle && <h3 className="!text-lg break-words max-sm:!text-sm max-lg:!text-lg text-gray-500">{resume.jobTitle}</h3>}
                    {!resume.companyName && !resume.jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={resume.feedback.overallScore} />
                </div>
            </div>
            <Link to={`/feedback/${resume._id}`}>
                {resume.resumeImg && (
                    <div className="gradient-border animate-in fade-in duration-1000">
                        <div className="w-full h-full">
                            <img
                                src={resume.resumeImg[0]}
                                alt="resume"
                                className="w-full h-fit"
                            />
                        </div>
                    </div>
                )}
            </Link>
            <div className="flex flex-row justify-end mt-3">
                <button className="bg-gray-300 w-fit gap-2 p-2 rounded-full cursor-pointer" onClick={() => handleDeleteAppication(resume._id)}>
                    <img src="/icons/delete.svg" alt="Delete" className="w-4" />
                </button>
            </div>
        </div>
    )
}

export default ResumeCard