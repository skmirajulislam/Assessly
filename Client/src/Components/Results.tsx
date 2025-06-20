import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { StateContext } from "../Context API/StateContext"
import { useNavigate } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import { ArrowLeft, Download, Share2, Printer, AlertTriangle, RefreshCw, CheckCircle, Clock, Home } from "lucide-react"

const Results = () => {
  const { ocrOutput, sub_id, studentName } = useContext(StateContext)
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [progress, setProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState<boolean>(false)
  const [animateSuccess, setAnimateSuccess] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleDownloadPDF = () => {
    window.print()
  }

  const fetchResults = async (retry = false) => {
    if (retry) {
      setRetrying(true)
    }

    const abortController = new AbortController()

    try {
      setLoading(true)
      setProgress(0)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 15
          const newProgress = Math.min(prev + increment, 95) // Cap at 95% until complete
          return newProgress
        })
      }, 800)

      const response = await axios.post(
        "https://assessly-h4b-server.vercel.app/api/v1/submissions/result",
        { ocrText: ocrOutput, sub_id },
        { signal: abortController.signal },
      )

      clearInterval(progressInterval)

      if (response.data.result) {
        setMarkdownContent(response.data.result)
        setProgress(100)

       
        setTimeout(() => {
          setLoading(false)
          setAnimateSuccess(true)
        }, 500)
      } else {
        setLoading(false)
      }

      setRetrying(false)
    } catch (err) {
      if (!abortController.signal.aborted) {
        console.error("Error fetching results:", err)
        setError("Failed to load results. Please try again.")
        setLoading(false)
        setRetrying(false)
      }
    }

    return () => {
      abortController.abort()
    }
  }

  useEffect(() => {
    if (!ocrOutput || !sub_id) {
      navigate("/")
      return
    }

    const abortController = new AbortController()

    fetchResults()

    return () => {
      abortController.abort()
    }
  }, [ocrOutput, sub_id, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-blue-300 text-center">Analyzing Your Submission</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-slate-600 opacity-25"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-t-blue-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"
                  style={{ animationDuration: "1.5s" }}
                ></div>
                <div
                  className="absolute inset-2 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"
                  style={{ animationDuration: "1.2s", animationDirection: "reverse" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-blue-300">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <p className="text-slate-400 text-sm text-center">
              We're carefully evaluating your work. This may take a moment depending on the complexity of your
              submission.
            </p>
          </div>
          <div className="px-6 py-4 flex justify-center bg-slate-900/50 border-t border-slate-700">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-sm px-4 py-2 rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-blue-300 transition-all duration-300"
            >
              <Home className="h-4 w-4 mr-2" />
              Cancel and return home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-slate-700 p-3">
                <AlertTriangle className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-blue-300 text-center">Error Occurred</h2>
          </div>
          <div className="p-6">
            <p className="text-slate-300 text-center mb-6">{error}</p>
          </div>
          <div className="px-6 py-4 flex justify-center gap-3 bg-slate-900/50 border-t border-slate-700">
            <button
              onClick={() => fetchResults(true)}
              disabled={retrying}
              className={`flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 ${
                retrying ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {retrying ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </>
              )}
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center px-4 py-2 rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-blue-300 transition-all duration-300"
            >
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- Success State (Results Display) ---
  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div
          className={`bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden transition-all duration-500 ${
            animateSuccess ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4"
          }`}
        >
          {/* Header */}
          <div className="bg-slate-800 px-6 py-5 border-b border-slate-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
            <AssesslyLogo size="medium"/>
              <div className=" flex justify-center flex-col items-center">
                
                <h1 className="text-2xl font-bold text-blue-300">Evaluation Results</h1>
                <p className="text-blue-400 font-medium">Of - {studentName || "Student"}</p>
              </div>

              <div className="flex gap-2">
                {/* Back Button */}
                <div className="relative group">
                  <button
                    onClick={() => navigate("/")}
                    className="flex items-center px-3 py-1.5 text-sm rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-blue-300 transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </button>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-700 text-blue-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Return to home
                  </div>
                </div>

                {/* Share Button */}
                <div className="relative group">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-blue-300 transition-all duration-300"
                    aria-label="Share results"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-700 text-blue-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Share results
                  </div>
                </div>

                {/* Download Button (uses print-to-PDF logic) */}
                <div className="relative group">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-blue-300 transition-all duration-300"
                    aria-label="Download as PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-700 text-blue-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Download as PDF
                  </div>
                </div>

                {/* Print Button */}
                <div className="relative group">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </button>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-700 text-blue-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Print results
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="bg-slate-900/80 rounded-lg p-6 border border-slate-700 shadow-lg">
              <div className="flex items-center gap-2 mb-4 text-blue-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Evaluation Complete</span>
              </div>
              <div className="h-px bg-slate-700 my-4"></div>

              {/* Custom styling for markdown content */}
              <div
                className="prose prose-invert max-w-none 
                  prose-headings:text-blue-300 
                  prose-h1:text-2xl prose-h1:font-bold
                  prose-h2:text-xl prose-h2:font-semibold
                  prose-h3:text-lg prose-h3:font-medium
                  prose-p:text-slate-300
                  prose-a:text-blue-400 hover:prose-a:text-blue-300
                  prose-strong:text-blue-200
                  prose-em:text-blue-200/90
                  prose-code:text-blue-300 prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
                  prose-blockquote:border-blue-500 prose-blockquote:bg-slate-800/50 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:text-slate-300
                  prose-ul:text-slate-300
                  prose-ol:text-slate-300
                  prose-li:text-slate-300 prose-li:marker:text-blue-400
                  prose-table:border-collapse
                  prose-th:bg-slate-800 prose-th:text-blue-300 prose-th:p-2
                  prose-td:border prose-td:border-slate-700 prose-td:p-2 prose-td:text-slate-300
                  prose-img:rounded-md prose-img:shadow-md
                  [&>*]:text-slate-300"
              >
                <ReactMarkdown>{markdownContent}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-900/30 px-6 py-4 border-t border-slate-700 text-sm text-slate-400">
            <div className="w-full space-y-2">
              <p>
                Results generated by Assessly based on your submission. For any questions regarding this evaluation,
                please contact your instructor.
              </p>
              <p className="text-xs text-slate-500">
                Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AssesslyLogo: React.FC<{ size?: "small" | "medium" | "large" }> = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "h-8",
    medium: "h-12",
    large: "h-16",
  }

  return (
    <div className={`flex items-center ${sizeClasses[size]}`}>
      <div className="relative mr-3">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClasses[size]}>
          <rect width="40" height="40" rx="8" fill="#1A2942" />
          <path d="M10 30L20 10L30 30" stroke="#7A9AD0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 22H26" stroke="#7A9AD0" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      <div className="font-bold text-[#E2E8F0] text-3xl tracking-tight">
        <span className="text-[#7A9AD0]">Assess</span>ly
      </div>
    </div>
  )
}


export default Results
