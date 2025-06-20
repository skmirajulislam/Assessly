import type React from "react"
import { useEffect, useState } from "react"
import axios, { type AxiosError } from "axios"
import { useParams } from "react-router-dom"

const TestQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<string[]>([])
  const [title, setTitle] = useState<string>("")
  const [subject, setSubject] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<string[]>([])
  const [studentName, setStudentName] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const { testId } = useParams<{ testId: string }>()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showAllQuestions, setShowAllQuestions] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`https://assessly-h4b-server.vercel.app/api/v1/tests/questions/${testId}`, {
          signal: controller.signal,
        })
        setTitle(response.data.title)
        setSubject(response.data.subject)
        if (Array.isArray(response.data.questions)) {
          setQuestions(response.data.questions)
          setAnswers(Array(response.data.questions.length).fill(""))
        } else {
          console.error("API didn't return array for questions:", response.data.questions)
          throw new Error("Invalid question data format from server.")
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message)
        } else {
          const axiosError = err as AxiosError<{ message?: string }>
          console.error("Failed to fetch questions:", axiosError)
          if (axiosError.response) {
            setError(
              `Error ${axiosError.response.status}: ${axiosError.response.data?.message || "Failed to load test. Link might be invalid or expired."}`,
            )
          } else if (axiosError.request) {
            setError("Network Error: Could not reach server. Please check connection.")
          } else {
            setError(`Error: ${axiosError.message || "Unexpected error occurred."}`)
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    if (testId) {
      fetchQuestions()
    } else {
      setError("No Test ID provided in URL.")
      setLoading(false)
    }

    return () => {
      controller.abort()
    }
  }, [testId])

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!studentName.trim()) {
      alert("Please enter your name.")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`https://assessly-h4b-server.vercel.app/api/v1/tests/submit/${testId}`, {
        studentName: studentName.trim(),
        submissions: questions.map((questionString, index) => ({
          question: questionString,
          answer: answers[index]?.trim() || "",
        })),
      })
      setScore(response.data.score)
      setIsSubmitted(true)
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>
      console.error("Submission error:", axiosError)
      if (axiosError.response) {
        setError(
          `Submission Error ${axiosError.response.status}: ${axiosError.response.data?.message || "Failed to submit test."}`,
        )
      } else if (axiosError.request) {
        setError("Network Error: Could not submit. Check connection.")
      } else {
        setError(`Error: ${axiosError.message || "Unexpected error during submission."}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const toggleViewMode = () => {
    setShowAllQuestions(!showAllQuestions)
  }

  if (loading && !error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#0A1020]">
        <div className="mb-8">
          <AssesslyLogo size="large" />
        </div>
        <div className="relative w-24 h-24">
          <div className="absolute w-full h-full border-4 border-[#2A3A59]/20 rounded-full"></div>
          <div className="absolute w-full h-full border-t-4 border-[#4A72B0] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#A0AEC0] text-sm font-medium tracking-wider">LOADING</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#0A1020] px-4">
        <div className="mb-8">
          <AssesslyLogo size="large" />
        </div>
        <div className="max-w-xl w-full p-8 bg-gradient-to-b from-[#1A2942]/40 to-[#0F1A2E] border border-[#3A4A6A]/50 rounded-xl shadow-[0_0_25px_rgba(15,23,42,0.3)] backdrop-blur-sm">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#2A3A59]/60 flex items-center justify-center border border-[#4A72B0]/70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#7A9AD0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#7A9AD0] mb-4 text-center">Error Encountered</h2>
          <p className="text-[#D0DEF7] text-center bg-[#2A3A59]/30 p-4 rounded-lg border border-[#3A4A6A]/40">
            {error}
          </p>
          <div className="mt-8 text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#4A72B0] hover:bg-[#5A82C0] text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#4A72B0]/50"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0 && !loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#0A1020] px-4">
        <div className="mb-8">
          <AssesslyLogo size="large" />
        </div>
        <div className="text-center p-8 text-[#A0AEC0] bg-[#1A2942]/30 border border-[#3A4A6A]/40 rounded-xl shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-[#7A9AD0] mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xl font-medium">No questions found for this test.</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      // Added py-12 for top/bottom padding inside the main container
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#0A1020] to-[#050A14] px-4 py-12">
        <div className="mb-8">
          <AssesslyLogo size="large" />
        </div>
        {/* Changed max-w-xl to max-w-3xl to make the card wider */}
        <div className="max-w-3xl w-full p-8 bg-[#0F1A2E]/80 border border-[#4A72B0]/20 rounded-xl shadow-[0_0_30px_rgba(74,114,176,0.2)] backdrop-blur-sm">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[#1A2942]/60 flex items-center justify-center border border-[#4A72B0]/70 shadow-[0_0_15px_rgba(74,114,176,0.3)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[#7A9AD0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#7A9AD0] mb-6 text-center">Test Submitted Successfully</h2>

          <div className="space-y-6">
            <div className="bg-[#1A2942]/50 p-5 rounded-lg border border-[#3A4A6A]/40 backdrop-blur-sm">
              <p className="text-[#A0AEC0] text-sm uppercase tracking-wider mb-1">Student Name</p>
              <p className="text-xl text-[#E2E8F0] font-medium">{studentName}</p>
            </div>

            <div className="bg-[#1A2942]/50 p-5 rounded-lg border border-[#3A4A6A]/40 backdrop-blur-sm">
              <p className="text-[#A0AEC0] text-sm uppercase tracking-wider mb-1">Test Title</p>
              <p className="text-xl text-[#E2E8F0] font-medium">{title}</p>
            </div>

            <div className="bg-[#1A2942]/50 p-5 rounded-lg border border-[#3A4A6A]/40 backdrop-blur-sm">
              <p className="text-[#A0AEC0] text-sm uppercase tracking-wider mb-1">Subject</p>
              <p className="text-xl text-[#E2E8F0] font-medium">{subject}</p>
            </div>

            <div className="bg-gradient-to-r from-[#1A2942]/60 to-[#0F1A2E]/70 p-6 rounded-lg border border-[#4A72B0]/30 backdrop-blur-sm">
              <p className="text-[#A0AEC0] text-sm uppercase tracking-wider mb-2">Your Score</p>
              <div className="flex items-center justify-between">
                <p className="text-4xl font-bold text-[#7A9AD0]">{score}</p>
                <div className="text-[#A0AEC0] text-lg">
                  <span className="text-sm opacity-70">out of</span> 100
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[#A0AEC0] text-sm">
              Powered by <span className="text-[#7A9AD0] font-medium">Assessly</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1020] to-[#050A14] text-[#E2E8F0] py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Assessly Branding */}
        <div className="mb-8 flex flex-col items-center">
          <AssesslyLogo size="medium" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#D0DEF7] mt-6 mb-2 text-center">{title}</h1>
          <p className="text-xl text-[#A0AEC0] font-medium">{subject}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 px-4">
          <div className="flex justify-between text-sm text-[#A0AEC0] mb-2">
            <span>Progress</span>
            <span>
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-[#1A2942]/50 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4A72B0] to-[#7A9AD0] transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={toggleViewMode}
            className="px-5 py-2 bg-[#1A2942]/70 hover:bg-[#2A3A59]/80 border border-[#3A4A6A]/50 rounded-full text-sm font-medium text-[#A0AEC0] transition-all duration-300 flex items-center space-x-2"
          >
            <span>{showAllQuestions ? "Single Question View" : "Show All Questions"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={showAllQuestions ? "M4 6h16M4 12h16M4 18h7" : "M4 6h16M4 10h16M4 14h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {showAllQuestions ? (
            // All questions view
            <div className="space-y-8">
              {questions.map((questionString, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-b from-[#1A2942]/40 to-[#0F1A2E]/50 rounded-xl border border-[#3A4A6A]/30 shadow-lg hover:shadow-[#1A2942]/30 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#2A3A59]/80 flex items-center justify-center text-[#D0DEF7] font-bold mr-3 border border-[#4A72B0]/50">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-[#A0AEC0]">Question {index + 1}</h3>
                  </div>

                  <p className="mb-6 text-[#E2E8F0] leading-relaxed pl-4 border-l-2 border-[#4A72B0]/50">
                    {questionString}
                  </p>

                  <div className="relative">
                    <input
                      id={`answer-${index}`}
                      type="text"
                      placeholder="Your answer..."
                      value={answers[index] || ""}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="w-full px-5 py-4 bg-[#1A2942]/50 border border-[#3A4A6A]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A72B0]/40 text-[#E2E8F0] placeholder-[#A0AEC0]/50 transition-all"
                      aria-label={`Answer for question ${index + 1}`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A0AEC0]/70 text-sm">
                      {answers[index]?.length || 0} chars
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Single question view
            <div className="p-8 bg-gradient-to-b from-[#1A2942]/40 to-[#0F1A2E]/50 rounded-xl border border-[#3A4A6A]/30 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#2A3A59]/80 flex items-center justify-center text-[#D0DEF7] font-bold mr-4 border border-[#4A72B0]/50 shadow-inner">
                  {currentQuestion + 1}
                </div>
                <h3 className="text-2xl font-semibold text-[#A0AEC0]">Question {currentQuestion + 1}</h3>
              </div>

              <div className="mb-8 p-6 bg-[#1A2942]/50 rounded-lg border border-[#3A4A6A]/30">
                <p className="text-[#E2E8F0] text-lg leading-relaxed">{questions[currentQuestion]}</p>
              </div>

              <div className="relative mb-8">
                <input
                  id={`answer-${currentQuestion}`}
                  type="text"
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion] || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                  className="w-full px-6 py-5 bg-[#1A2942]/50 border border-[#3A4A6A]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A72B0]/40 text-[#E2E8F0] placeholder-[#A0AEC0]/50 transition-all text-lg"
                  aria-label={`Answer for question ${currentQuestion + 1}`}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#A0AEC0]/70">
                  {answers[currentQuestion]?.length || 0} chars
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="px-5 py-3 bg-[#1A2942]/70 hover:bg-[#2A3A59]/80 border border-[#3A4A6A]/50 rounded-lg text-[#A0AEC0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={currentQuestion === questions.length - 1}
                  className="px-5 py-3 bg-[#1A2942]/70 hover:bg-[#2A3A59]/80 border border-[#3A4A6A]/50 rounded-lg text-[#A0AEC0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Student Name Input */}
          <div className="p-6 bg-gradient-to-b from-[#1A2942]/40 to-[#0F1A2E]/50 rounded-xl border border-[#3A4A6A]/30 shadow-lg mt-10">
            <label htmlFor="studentName" className="block mb-3 text-xl font-medium text-[#A0AEC0]">
              Your Name
            </label>
            <input
              type="text"
              id="studentName"
              placeholder="Enter your full name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              className="w-full px-6 py-4 bg-[#1A2942]/50 border border-[#3A4A6A]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A72B0]/40 text-[#E2E8F0] placeholder-[#A0AEC0]/50 transition-all text-lg"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-8 bg-gradient-to-r from-[#3A5A9A] to-[#4A72B0] hover:from-[#2A4A8A] hover:to-[#3A62A0] text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(74,114,176,0.3)] hover:shadow-[0_6px_25px_rgba(74,114,176,0.5)] transition-all duration-300 text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Submit Test
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer with Assessly Branding */}
        <div className="mt-12 text-center">
          <p className="text-[#A0AEC0] text-sm">
            Powered by <span className="text-[#7A9AD0] font-medium">Assessly</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// Assessly Logo Component
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

export default TestQuestions
