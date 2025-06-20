
import { useEffect, useState } from "react"
import axios from "axios"
import ExportButton from "./ExportButton"

interface Submission {
  _id: string
  Title: string
  Description: string
  Deadline: string
  hash: string
}

const Submissions = () => {
  const token = localStorage.getItem("token")
  const [submissionsData, setSubmissionsData] = useState<Submission[]>([])
  const [numberOfSubmissions, setNumberOfSubmissions] = useState<number[]>([])
  const [combinedData, setCombinedData] = useState<{ submission: Submission; count: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get("https://assessly-h4b-server.vercel.app/api/v1/assignments/latest", {
          headers: {
            token: token,
          },
        })
        setSubmissionsData(response.data.assignments)
        setNumberOfSubmissions(response.data.submissionCounts)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to fetch data. Please check your network and try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (
      submissionsData.length > 0 &&
      numberOfSubmissions.length > 0 &&
      submissionsData.length === numberOfSubmissions.length
    ) {
      const combined = submissionsData.map((submission, index) => ({
        submission: submission,
        count: numberOfSubmissions[index],
      }))
      setCombinedData(combined)
    }
  }, [submissionsData, numberOfSubmissions])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-indigo-500 border-r-indigo-700 border-b-indigo-600 border-l-indigo-800 animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-indigo-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 p-4">
        <div className="bg-gray-800 rounded-xl shadow-md p-8 max-w-md w-full border border-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-red-400 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-100 text-center mb-3">Error</h2>
          <p className="text-gray-300 text-center mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center border border-indigo-500/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Calculate if deadline is approaching (within 3 days)
  const isDeadlineApproaching = (deadlineString: string) => {
    const deadline = new Date(deadlineString)
    const now = new Date()
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return diffDays <= 3 && diffDays > 0
  }

  // Check if deadline has passed
  const isDeadlinePassed = (deadlineString: string) => {
    const deadline = new Date(deadlineString)
    const now = new Date()
    return deadline < now
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-100 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-indigo-600">
                Submissions
              </span>
            </h1>
            <p className="mt-2 text-gray-400 max-w-3xl">Manage and export your assignment submissions</p>
          </div>
          <div className="px-4 py-2 bg-indigo-900/30 text-indigo-300 rounded-full text-sm font-semibold flex items-center border border-indigo-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {combinedData.length} {combinedData.length === 1 ? "assignment" : "assignments"} found
          </div>
        </div>

        {combinedData.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-10 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-600 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-200 mb-2">No submissions found</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              There are no assignments or submissions available at this time.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col space-y-6">
            {combinedData.map((item) => {
              const deadlineApproaching = isDeadlineApproaching(item.submission.Deadline)
              const deadlinePassed = isDeadlinePassed(item.submission.Deadline)

              return (
                <div
                  key={item.submission._id}
                  className="w-full bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <h2 className="text-xl font-bold text-gray-100">{item.submission.Title}</h2>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          deadlinePassed
                            ? "bg-red-900/30 text-red-400"
                            : deadlineApproaching
                              ? "bg-amber-900/30 text-amber-400"
                              : "bg-emerald-900/30 text-emerald-400"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-1.5 ${
                            deadlinePassed ? "bg-red-500" : deadlineApproaching ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                        ></span>
                        {deadlinePassed ? "Deadline passed" : deadlineApproaching ? "Deadline approaching" : "Active"}
                      </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 rounded-lg mb-4 relative pl-4">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-l-md"></div>
                      <div className="py-4 pr-4">
                        <div className="flex items-center mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-indigo-400 mr-1.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Assignment Description
                          </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-sm">
                          {item.submission.Description || "No description provided for this assignment."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 px-6 py-4 flex flex-wrap md:flex-nowrap items-center justify-between border-t border-gray-700">
                    <div className="flex flex-wrap items-center gap-6 mb-3 md:mb-0">
                      <div className="flex items-center">
                        <div className="bg-indigo-900/30 p-2 rounded-full mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-indigo-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-medium">Deadline</div>
                          <div
                            className={`text-sm font-medium ${deadlinePassed ? "text-red-400" : deadlineApproaching ? "text-amber-400" : "text-gray-300"}`}
                          >
                            {formatDate(item.submission.Deadline)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="bg-purple-900/30 p-2 rounded-full mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-purple-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-medium">Submissions</div>
                          <div className="text-sm font-medium text-gray-300">
                            {item.count} {item.count === 1 ? "response" : "responses"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <ExportButton hash={item.submission.hash} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Submissions

