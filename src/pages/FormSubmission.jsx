import {useState} from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader'
import Navbar from '../components/Navbar'
import { ConvertPdfToImage } from '../lib/pdf2img'
import { extractResumeText } from '../lib/ExtractText'
import { AIResponseFormat } from '../lib/AiResponseFormat'
import { prepareInstructions } from '../lib/prepareInstructions'
import { Toaster, toast } from 'react-hot-toast'

const FormSubmission = () => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [statusText, setStatusText] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [jobTitle, setJobTitle] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [file, setFile] = useState(null)
    const [errors, setErrors] = useState({})
    const navigate = useNavigate();

    const handleFileSelect = (file) => {
        setFile(file)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        let newErrors = {};

        if (!companyName.trim()) {
            newErrors.companyName = "Company Name is required.";
        }
        if (!jobTitle.trim()) {
            newErrors.jobTitle = "Job Title is required.";
        }
        if (!jobDescription.trim()) {
            newErrors.jobDescription = "Job Description is required.";
        }
        if (!file) {
            newErrors.file = "Resume file is required.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fix the errors before submitting.");
            return; // Stop submission if errors exist
        }

        try {
            setIsProcessing(true)
            setStatusText("Analyzing your resume...")

            const resumeImage = await ConvertPdfToImage(file)
            const resumeText = await extractResumeText(file)

            const prompt = prepareInstructions({
                jobTitle: jobTitle,
                jobDescription: jobDescription,
                AIResponseFormat: AIResponseFormat
            }) + `\n\nThe resume content is:\n${resumeText}`;

            const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${OPENROUTER_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b:free",
                    temperature: 0.4,
                    messages:[{role:"user", content: prompt}],
                })
            });

            const data = await response.json()

            if (data?.error) {
                toast.error(data?.error?.message || "AI analysis failed.");
                return;
            }
            
            const text = data.choices?.[0]?.message?.content?.trim();
            const cleanedText = text?.replace(/```json|```/g, '').trim();

            let jsonObj;
            try {
                jsonObj = JSON.parse(cleanedText);
            } catch (err) {
                console.error("Invalid JSON:", err);
                toast.error("Failed to parse AI response.");
                return;
            }

            if (jsonObj) {
                const newEntry = {
                    resumeImg: resumeImage,
                    jobTitle: jobTitle,
                    companyName: companyName,
                    feedback: jsonObj,
                };

                const token = Cookies.get("token")
                setStatusText("Saving your analysis...")

                const saveResponse = await fetch("https://resumind-backend-adfz.onrender.com/api/resume", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newEntry),
                });

                if (!saveResponse.ok) {
                    const errorText = await saveResponse.text();
                    console.error("Server responded with:", saveResponse.status, errorText);
                    toast.error("Failed to save resume analysis.");
                    return;
                }

                const savedData = await saveResponse.json();
                toast.success("Resume analysis complete!");
                setStatusText("Redirecting to feedback page...")

                navigate(`/feedback/${savedData._id}`);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            toast.error(err.message || "Something went wrong.");
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <main className='bg-[url(/images/bg-small.svg)] bg-cover'>
            <Navbar upload={false} />
            <Toaster position="top-center" reverseOrder={false} />
            <section className='main-section'>
                <div className='page-heading'>
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <div className='flex flex-col gap-0'>
                            <h2 className='mt-4'>{statusText}</h2>
                            <img src="/images/resume-scan.gif" alt="resume-scan-gif" className='mt-[-100px] max-sm:mt-[-50px]' />
                        </div>
                    ): (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className='flex flex-col gap-4 mt-5 mb-10'>
                            {/* Company Name */}
                            <div className='form-div'>
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder='Company Name' />
                                {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
                            </div>
                            {/* Job Title */}
                            <div className='form-div'>
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" id="job-title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder='Job Title' />
                                {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle}</p>}
                            </div>
                            {/* Job Description */}
                            <div className='form-div'>
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} id="job-description" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder='Job Description' />
                                {errors.jobDescription && <p className="text-red-500 text-sm">{errors.jobDescription}</p>}
                            </div>
                            {/* File Uploader */}
                            <div className='form-div'>
                                <label>Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                                {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                            </div>
                            <button className='primary-button' type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}

export default FormSubmission
