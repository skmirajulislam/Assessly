"use client"

import type React from "react"
import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import type { Dispatch, SetStateAction } from "react"
import {
  CheckCircle,
  FileText,
  Upload,
  AlertCircle,
  ChevronDown,
  Calendar,
  User,
  Mail,
  Phone,
  BookOpen,
  Layers,
  Building,
  Hash,
} from "lucide-react"

import { StateContext } from "../Context API/StateContext"

interface Assignment {
  Name?: boolean
  Class?: boolean
  Section?: boolean
  RollNo?: boolean
  Department?: boolean
  Email?: boolean
  PhoneNumber?: boolean
  Title?: string
  Deadline?: string
  [key: string]: any
}

interface BoolField {
  key: string
  valueState: [string, Dispatch<SetStateAction<string>>]
  icon: React.ReactNode
  type: string
  placeholder: string
}

const StudentSubmission = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const [assignment, setAssignments] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const { setStudentName } = useContext(StateContext)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const [nameValue, setNameValue] = useState("")
  const [classValue, setClassValue] = useState("")
  const [sectionValue, setSectionValue] = useState("")
  const [rollNoValue, setRollNoValue] = useState("")
  const [departmentValue, setDepartmentValue] = useState("")
  const [emailValue, setEmailValue] = useState("")
  const [phoneNumberValue, setPhoneNumberValue] = useState("")
  const { setOcrOutput, setSub_id } = useContext(StateContext)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get<any>(`https://assessly-h4b-server.vercel.app/api/v1/assignments/share/${shareId}`)
        console.log(response.data.info)
        setAssignments(response.data.info)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch data.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [shareId])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const maxSize = 2 * 1024 * 1024

      if (file.type === "application/pdf") {
        if (file.size <= maxSize) {
          setUploadedFile(file)
          setError(null)

          // Simulate upload progress
          setIsUploading(true)
          setUploadProgress(0)
          const interval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 100) {
                clearInterval(interval)
                setIsUploading(false)
                return 100
              }
              return prev + 5
            })
          }, 100)
        } else {
          setUploadedFile(null)
          setError("File size exceeds 2MB limit.")
          event.target.value = ""
        }
      } else {
        setUploadedFile(null)
        setError("Invalid file type. Please upload a PDF document.")
        event.target.value = ""
      }
    } else {
      setUploadedFile(null)
    }
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setSubmissionStatus("submitting")
    setError(null)

    if (!uploadedFile) {
      setError("Please upload the assignment file.")
      setSubmissionStatus(null)
      setLoading(false)
      return
    }

    const submissionData: { [key: string]: string } = {}
    const values = [
      { key: "Name", value: nameValue },
      { key: "Class", value: classValue },
      { key: "Section", value: sectionValue },
      { key: "RollNo", value: rollNoValue },
      { key: "Department", value: departmentValue },
      { key: "Email", value: emailValue },
      { key: "PhoneNumber", value: phoneNumberValue },
      { key: "hash", value: shareId ? shareId : "null" },
    ]

    values.forEach(({ key, value }) => {
      if ((assignment && assignment[key]) || key === "hash") {
        submissionData[key] = value
      }
    })

    const formData = new FormData()
    for (const key in submissionData) {
      formData.append(key, submissionData[key])
    }
    if (uploadedFile) {
      formData.append("assignmentFile", uploadedFile)
    } else {
      console.error("File missing despite check, stopping submission.")
      setError("File is required.")
      setSubmissionStatus("error")
      setLoading(false)
      return
    }

    try {
      setStudentName(nameValue)
      const response = await axios.post("https://assessly-h4b-server.vercel.app/api/v1/submissions/data", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setSubmissionStatus("success")
      setOcrOutput(response.data.ocrText)
      setSub_id(response.data.submissionId)
      console.log("Submission successful:", response.data)

      // Show success message with animation
      setTimeout(() => {
        navigate("/result")
      }, 2000)
    } catch (submissionError: any) {
      setSubmissionStatus("error")
      console.error("Submission error:", submissionError)
      const apiErrorMessage = submissionError.response?.data?.message
      const fallbackMessage = "Failed to submit data. Please check your input and file."
      setError(apiErrorMessage || fallbackMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !assignment) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-1 left-1 right-1 bottom-1 border-4 border-blue-600 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="mt-6 text-xl text-blue-300 font-medium tracking-wide">Loading assignment details...</p>
        </div>
      </div>
    )
  }

  if (error && !submissionStatus && !assignment) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center p-4">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-blue-100">Error Occurred</h3>
              <p className="mt-3 text-slate-300">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!assignment && !loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">
          <div className="text-center">
            <FileText className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-blue-100 mb-3">Assignment Not Found</h2>
            <p className="text-slate-300">
              The assignment details could not be loaded. Please check the link or contact the administrator.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const boolFields: BoolField[] = assignment
    ? [
        {
          key: "Name",
          valueState: [nameValue, setNameValue],
          icon: <User className="h-5 w-5 text-blue-400" />,
          type: "text",
          placeholder: "Enter your full name",
        },
        {
          key: "Class",
          valueState: [classValue, setClassValue],
          icon: <BookOpen className="h-5 w-5 text-blue-400" />,
          type: "text",
          placeholder: "Enter your class",
        },
        {
          key: "Section",
          valueState: [sectionValue, setSectionValue],
          icon: <Layers className="h-5 w-5 text-blue-400" />,
          type: "text",
          placeholder: "Enter your section",
        },
        {
          key: "RollNo",
          valueState: [rollNoValue, setRollNoValue],
          icon: <Hash className="h-5 w-5 text-blue-400" />,
          type: "text",
          placeholder: "Enter your roll number",
        },
        {
          key: "Department",
          valueState: [departmentValue, setDepartmentValue],
          icon: <Building className="h-5 w-5 text-blue-400" />,
          type: "text",
          placeholder: "Enter your department",
        },
        {
          key: "Email",
          valueState: [emailValue, setEmailValue],
          icon: <Mail className="h-5 w-5 text-blue-400" />,
          type: "email",
          placeholder: "Enter your email address",
        },
        {
          key: "PhoneNumber",
          valueState: [phoneNumberValue, setPhoneNumberValue],
          icon: <Phone className="h-5 w-5 text-blue-400" />,
          type: "tel",
          placeholder: "Enter your phone number",
        },
      ]
    : []

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col min-h-screen bg-slate-900 text-blue-50">
      <header className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700 shadow-lg backdrop-blur-sm bg-opacity-90">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <AssesslyLogo size="small"/>
          </div>
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-blue-100 tracking-wide">
              {assignment?.Title || "Assignment Submission"}
            </h1>
            {assignment?.Deadline && (
              <div className="flex items-center justify-center mt-1 text-blue-300">
                <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <p className="text-sm">
                  Due: <span className="font-medium text-blue-200">{assignment.Deadline}</span>
                </p>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md shadow-lg text-blue-100 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-300"
            disabled={submissionStatus === "submitting" || loading}
          >
            {submissionStatus === "submitting" || loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-300"
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
                Submitting
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {error && (submissionStatus === "error" || (!uploadedFile && error.includes("file"))) && (
          <div className="mb-6 bg-slate-800/50 border-l-4 border-blue-500 p-4 rounded-md shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-300">Error</h3>
                <div className="mt-1 text-sm text-blue-200">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {submissionStatus === "success" && (
          <div className="mb-8 bg-slate-800/50 border-l-4 border-blue-500 p-6 rounded-md shadow-lg animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-blue-200">Submission Successful</h3>
                <div className="mt-2 text-blue-300">
                  <p>Your assignment has been submitted successfully. Redirecting to results...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {boolFields.some((field) => assignment && assignment[field.key]) && (
            <section className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700 transition-all duration-300 hover:shadow-blue-900/20">
              <div className="border-b border-slate-700 bg-slate-800 px-6 py-4 flex items-center">
                <User className="h-5 w-5 text-blue-400 mr-2" />
                <h2 className="text-lg font-medium text-blue-100">Personal Information</h2>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  {boolFields.map(({ key, valueState, icon, type, placeholder }) => {
                    const [value, setValue] = valueState
                    if (assignment && assignment[key]) {
                      const labelText = key.replace(/([A-Z])/g, " $1").trim()
                      return (
                        <div key={key} className="sm:col-span-1">
                          <label htmlFor={key} className="block text-sm font-medium text-blue-300 mb-1">
                            {labelText} <span className="text-blue-400">*</span>
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              {icon}
                            </div>
                            <input
                              type={type}
                              id={key}
                              name={key}
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                              className="block w-full pl-10 pr-3 py-2.5 rounded-md border border-slate-600 bg-slate-700/50 shadow-inner focus:border-blue-500 focus:ring focus:ring-blue-500/20 focus:ring-opacity-50 sm:text-sm text-blue-100 placeholder-blue-400/50 disabled:bg-slate-800 disabled:cursor-not-allowed transition-all duration-300"
                              placeholder={placeholder}
                              required={true}
                              disabled={submissionStatus === "submitting" || loading}
                            />
                          </div>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            </section>
          )}

          <section className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700 transition-all duration-300 hover:shadow-blue-900/20">
            <div className="border-b border-slate-700 bg-slate-800 px-6 py-4 flex items-center">
              <FileText className="h-5 w-5 text-blue-400 mr-2" />
              <h2 className="text-lg font-medium text-blue-100">Assignment Submission</h2>
            </div>
            <div className="px-6 py-6">
              <label htmlFor="assignmentFile" className="block text-sm font-medium text-blue-300 mb-1">
                Upload Assignment File (PDF, max 2MB) <span className="text-blue-400">*</span>
              </label>
              <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                  error && error.includes("File")
                    ? "border-blue-500/70 bg-blue-500/10"
                    : "border-slate-600 hover:border-blue-500/50 hover:bg-slate-700/30"
                } border-dashed rounded-md transition-all duration-300`}
              >
                <div className="space-y-1 text-center">
                  {!uploadedFile ? (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-blue-400" />
                      <div className="flex text-sm text-blue-300 justify-center">
                        <label
                          htmlFor="assignmentFile"
                          className={`relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none ${
                            submissionStatus === "submitting" || loading ? "opacity-50 cursor-not-allowed" : ""
                          } transition-colors duration-300`}
                        >
                          <span>Upload a file</span>
                          <input
                            id="assignmentFile"
                            name="assignmentFile"
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf"
                            className="sr-only"
                            required
                            disabled={submissionStatus === "submitting" || loading}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-blue-400/70">PDF documents only, max 2MB.</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FileText className="h-12 w-12 text-blue-400 mb-3" />
                      <p className="text-sm font-medium text-blue-200 break-all px-2">{uploadedFile.name}</p>
                      <p className="text-xs text-blue-400/70 mt-1">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>

                      {isUploading && (
                        <div className="w-full mt-4 mb-2 bg-slate-700 rounded-full h-2.5">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFile(null)
                          if (error && (error.includes("File size") || error.includes("Invalid file type"))) {
                            setError(null)
                          }
                          const fileInput = document.getElementById("assignmentFile") as HTMLInputElement
                          if (fileInput) fileInput.value = ""
                        }}
                        className={`mt-4 inline-flex items-center px-3 py-1.5 border border-slate-600 text-xs font-medium rounded-md text-blue-200 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          submissionStatus === "submitting" || loading ? "opacity-50 cursor-not-allowed" : ""
                        } transition-all duration-300`}
                        disabled={submissionStatus === "submitting" || loading}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {error &&
                (error.includes("File size") ||
                  error.includes("Invalid file type") ||
                  error === "Please upload the assignment file.") && (
                  <p className="mt-2 text-sm text-blue-400">{error}</p>
                )}
            </div>
          </section>
        </div>

        <div className="mt-10">
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:translate-y-[-2px]"
              disabled={submissionStatus === "submitting" || loading || submissionStatus === "success"}
            >
              {submissionStatus === "submitting" || loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  {loading ? "Processing..." : "Submitting..."}
                </span>
              ) : (
                <>
                  Submit Assignment
                  <ChevronDown className="ml-2 h-5 w-5 rotate-[-90deg]" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-slate-800 border-t border-slate-700 py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-blue-400/70">
            Please ensure all required fields (*) are filled and the correct file is uploaded before submitting.
          </p>
        </div>
      </footer>
    </form>
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
      <div className="font-bold text-[#E2E8F0] text-2xl tracking-tight">
        <span className="text-[#7A9AD0]">Assess</span>ly
      </div>
    </div>
  )
}

export default StudentSubmission
