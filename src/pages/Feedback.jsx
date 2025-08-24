import { Link, useParams } from "react-router-dom"
import Summary from "../components/Summary";
import ATS from "../components/ATS";
import Details from "../components/Details";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie'

const Feedback = () => {
  const {id} = useParams()

  const [data, setData] = useState([])

  const token = Cookies.get("token")

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`https://resumind-backend-adfz.onrender.com/api/resume/${id}`, {
          method: "GET",
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if(response.ok) setData(data)
      } catch (err) {
        console.error("Error fetching resume:", err);
      }
    }
    getData()
  }, [id, token]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/home" className="back-button">
          <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url(/images/bg-small.svg)] bg-cover h-fit sticky top-0 items-center justify-center">
          {data && data.resumeImg && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 max-wxl:h-fit w-fit">
              <div>
                {data.resumeImg.map((src, i) => (
                  <img key={i} src={src} alt={`Page ${i + 1}`} className="rounded-2xl mb-3" />
                ))}
              </div>
            </div>
          )}
        </section>
        <section className="feedback-section">
            <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
            {data && data.feedback ? (
              <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                  <Summary feedback={data.feedback} />
                  <ATS score={data.feedback.ATS.score || 0} suggestions={data.feedback.ATS.tips || []} />
                  <Details feedback={data.feedback} />
              </div>
            ): (
              <img src="/images/resume-scan-2.gif" className="w-full" />
            )}
        </section>
      </div>
    </main>
  )
}

export default Feedback