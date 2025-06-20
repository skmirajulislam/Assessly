import type React from "react"
import { useContext, useState } from "react"
import { ArrowRightIcon, ArrowLeftIcon, CloudArrowUpIcon } from "@heroicons/react/24/solid"
import pdfToText from 'react-pdftotext';
import mammoth from 'mammoth';
import { AiOutlineClose, AiOutlineEye, AiOutlineCalendar, AiFillInfoCircle } from 'react-icons/ai';
import { FiCheck, FiFileText, FiLink, FiArrowUpRight } from 'react-icons/fi';
import axios from "axios";
import { StateContext } from "../Context API/StateContext";


const GeneratorModal = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [fileContent, setFileContent] = useState<string | null>(null)
    const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState(false)
    const [fileName, setFileName] = useState<string | null>(null)
    const [title, setTitle] = useState<string>(""); 
    const [deadline, setDeadline] = useState<string>(""); 
    const [description, setDescription] = useState<string>(""); 
  

    const [isNameChecked, setIsNameChecked] = useState<boolean>(false);
    const [isClassChecked, setIsClassChecked] = useState<boolean>(false);
    const [isSectionChecked, setIsSectionChecked] = useState<boolean>(false);
    const [isRollNoChecked, setIsRollNoChecked] = useState<boolean>(false);
    const [isDepartmentChecked, setIsDepartmentChecked] = useState<boolean>(false);
    const [isEmailChecked, setIsEmailChecked] = useState<boolean>(false);
    const [isPhoneNumberChecked, setIsPhoneNumberChecked] = useState<boolean>(false);
  
    const { modalOpen, setModal, triggerRefresh } = useContext(StateContext);
  
  
    const nextPage = () => currentPage < 3 && setCurrentPage((p) => p + 1)
    const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1)
  
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
  
      processFile(file)
    }
  
    const processFile = async (file: File) => {
      setIsLoadingFile(true); 
  
      if (file.type === 'application/pdf') {
        try {
          const text = await pdfToText(file);
          setFileContent(text);
          setFileName(file.name);
          alert("File loaded successfully!");
        } catch (error) {
          console.error("Failed to extract text from PDF", error);
          setFileContent('');
          setFileName(null);
          alert('Error extracting text from PDF.');
        } finally {
          setIsLoadingFile(false); 
        }
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          setFileContent(result.value);
          setFileName(file.name);
          alert("File loaded successfully!");
        } catch (error) {
          console.error('Error parsing DOCX file', error);
          alert('Error parsing DOCX file');
          setFileContent('');
          setFileName(null);
        } finally {
          setIsLoadingFile(false); 
        }
      }
      else {
        alert('Unsupported file format. Only PDF and DOCX  are supported.');
        setFileContent('');
        setFileName(null);
        setIsLoadingFile(false); 
      }
    };
  
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(true)
    }
  
    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      if (e.currentTarget.contains(e.relatedTarget as Node)) return
      setIsDragging(false)
    }
  
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) {
        processFile(file)
      }
    }
  
    const handleGenerateLink = () => {
      
      const token = localStorage.getItem('token')
  
      const dataToSend = {
        Name: isNameChecked,
        Class: isClassChecked,
        Section: isSectionChecked,
        RollNo: isRollNoChecked,
        Department: isDepartmentChecked,
        Email: isEmailChecked,
        PhoneNumber: isPhoneNumberChecked,
        Questions: fileContent,
        Title: title,
        Description: description,
        Deadline: deadline,
      }
  
      axios.post("https://assessly-h4b-server.vercel.app/api/v1/assignments/generate", dataToSend, {
          headers: {
            token: token
          }
        })
        .then(response => {
          const hash = response.data.hash;
          localStorage.setItem('assignmentHash', hash);
          const assignmentUrl = `https://assessly-h4b.vercel.app/share/${hash}`;
          alert(`Assignment link generated: ${assignmentUrl}`);
          setModal((e:boolean)=> !e)
          triggerRefresh()
        })
        .catch(error => {
          console.error("Error sending data:", error);
          alert("Failed to generate assignment link. Please try again.");
          setModal((e:boolean)=> !e)
          triggerRefresh()
        });
      console.log("Data to Send to Backend:", dataToSend)
    }
  
    if (!modalOpen) return null
  
    return (
      <div className="fixed inset-0 z-500 bg-black/80 backdrop-blur-sm transition-opacity flex items-center justify-center p-4 font-mono">
        <div
          className="relative bg-gray-900 rounded-3xl shadow-2xl overflow-hidden transform transition-all w-full max-w-md md:max-w-2xl animate-fadeIn" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-6 md:px-10">
            <div className="flex items-center justify-between pb-4 border-b border-gray-700">
              <h3 className="text-2xl sm:text-2xl md:text-3xl font-extrabold text-blue-400 tracking-tight">
                Assignment Generator
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
              </h3>
              <button
                onClick={()=>setModal((e:boolean)=> !e)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                aria-label="Close"
              >
                <AiOutlineClose className="h-5 w-5 sm:h-5 md:h-6 sm:w-5 md:w-6" />
              </button>
            </div>
          </div>
  
          {/* Progress Indicator */}
          <div className="px-6 sm:px-8 md:px-10">
            <div className="relative mb-8 md:mb-10">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-700 rounded-full"></div>
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((currentPage - 1) / 2) * 100}%` }}
              ></div>
              <div className="relative flex justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`relative z-10 flex items-center justify-center w-8 h-8 sm:w-8 md:w-10 sm:h-8 md:h-10 rounded-full transition-all duration-300 ${
                        currentPage >= step
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-900"
                          : "bg-gray-800 border-2 border-gray-700 text-gray-400"
                      }`}
                    >
                      {currentPage > step ? (
                        <FiCheck className="w-4 h-4 sm:w-4 md:w-5 sm:h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                      ) : (
                        <span className="text-sm font-bold">{step}</span>
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${currentPage >= step ? "text-blue-300" : "text-gray-500"}`}
                    >
                      {step === 1 ? "Details" : step === 2 ? "Fields" : "Upload"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Content */}
          <div className="px-6 sm:px-8 md:px-10 overflow-y-auto max-h-[calc(80vh-300px)]">
            <div className="space-y-8">
              {currentPage === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm sm:text-sm md:text-base font-medium text-blue-300 mb-2">
                      Assignment Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        required
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a descriptive title for your assignment"
                        className="w-full px-4 py-3 sm:px-4 md:px-4 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-500"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                        <AiOutlineEye className="w-5 h-5 sm:w-5 md:w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                      </div>
                    </div>
                  </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm sm:text-sm md:text-base font-medium text-blue-300 mb-2">
                        Submission Deadline <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="w-full px-4 py-3 sm:px-4 md:px-4 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AiOutlineCalendar className="w-5 h-5 sm:w-5 md:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                        </div>
                      </div>
                    </div>
  
                    <div className="md:row-span-2">
                      <label className="block text-sm sm:text-sm md:text-base font-medium text-blue-300 mb-2">
                        Description <span className="text-gray-500 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide additional instructions or context for students..."
                        className="w-full px-4 py-3 sm:px-4 md:px-4 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none placeholder-gray-500"
                      />
                    </div>
  
                    <div>
                      <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded-lg mt-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AiFillInfoCircle className="h-5 w-5 sm:h-5 md:h-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm sm:text-sm md:text-sm text-blue-300">
                              Setting a clear deadline helps students manage their time effectively.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
  
              {currentPage === 2 && (
                <div className="space-y-6">
                <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 mb-5">
                  <h4 className="font-medium text-blue-300 mb-2">Student Information Fields</h4>
                  <p className="text-gray-400 text-sm sm:text-sm md:text-sm">
                    Select which information fields students need to provide when submitting their assignment.
                  </p>
                </div>
  
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    <label className="flex items-center p-4 border border-gray-700 rounded-xl hover:border-blue-500 hover:bg-gray-800/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 cursor-pointer group">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input type="checkbox" checked={isNameChecked} onChange={(e) => setIsNameChecked(e.target.checked)} className="w-5 h-5 sm:w-5 md:w-5 text-blue-600 border-gray-600 rounded focus:ring-blue-500" />
                        </div>
                        <div className="ml-3 flex items-center">
                          <AiOutlineEye className="w-5 h-5 sm:w-5 md:w-5 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" />
                          <span className="ml-2 text-gray-300 group-hover:text-blue-300 transition-colors duration-200">Name</span>
                        </div>
                      </div>
                    </label>
  
                    <label className="flex items-center p-4 border border-gray-700 rounded-xl hover:border-blue-500 hover:bg-gray-800/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 cursor-pointer group">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input type="checkbox" checked={isClassChecked} onChange={(e) => setIsClassChecked(e.target.checked)} className="w-5 h-5 sm:w-5 md:w-5 text-blue-600 border-gray-600 rounded focus:ring-blue-500" />
                        </div>
                        <div className="ml-3 flex items-center">
                          <FiFileText className="w-5 h-5 sm:w-5 md:w-5 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" />
                          <span className="ml-2 text-gray-300 group-hover:text-blue-300 transition-colors duration-200">Class</span>
                        </div>
                      </div>
                    </label>
  
                    <label className="flex items-center p-4 border border-gray-700 rounded-xl hover:border-blue-500 hover:bg-gray-800/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 cursor-pointer group">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input type="checkbox" checked={isSectionChecked} onChange={(e) => setIsSectionChecked(e.target.checked)} className="w-5 h-5 sm:w-5 md:w-5 text-blue-600 border-gray-600 rounded focus:ring-blue-500" />
                        </div>
                        <div className="ml-3 flex items-center">
                          <FiFileText className="w-5 h-5 sm:w-5 md:w-5 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" />
                          <span className="ml-2 text-gray-300 group-hover:text-blue-300 transition-colors duration-200">Section</span>
                        </div>
                      </div>
                    </label>
  
                    <label className="flex items-center p-4 border border-gray-700 rounded-xl hover:border-blue-500 hover:bg-gray-800/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 cursor-pointer group">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input type="checkbox" checked={isRollNoChecked} onChange={(e) => setIsRollNoChecked(e.target.checked)} className="w-5 h-5 sm:w-5 md:w-5 text-blue-600 border-gray-600 rounded focus:ring-blue-500" />
                        </div>
                        <div className="ml-3 flex items-center">
                          <FiFileText className="w-5 h-5 sm:w-5 md:w-5 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" />
                          <span className="ml-2 text-gray-300 group-hover:text-blue-300 transition-colors duration-200">Roll No.</span>
                        </div>
                      </div>
                    </label>
  
                    <label className="flex items-center p-4 border border-gray-700 rounded-xl hover:border-blue-500 hover:bg-gray-800/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 cursor-pointer group">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input type="checkbox" checked={isDepartmentChecked} onChange={(e) => setIsDepartmentChecked(e.target.checked)} className="w-5 h-5 sm:w-5 md:w-5 text-blue-600 border-gray-600 rounded focus:ring-blue-500" />
                        </div>
                        <div className="ml-3 flex items-center">
                          <FiFileText className="w-5 h-5 sm:w-5 md:w-5 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" />
                          <span className="ml-2 text-gray-300 group-hover:text-blue-300 transition-colors duration-200">Department</span>
                        </div>
                      </div>
                    </label>
  
                     <label className="flex items-center p-4 border border-gray-700 rounded-xl hover:border-blue-500 hover:bg-gray-800/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 cursor-pointer group">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input type="checkbox" checked={isEmailChecked} onChange={(e) => setIsEmailChecked(e.target.checked)} className="w-5 h-5 sm:w-5 md:w-5 text-blue-600 border-gray-600 rounded focus:ring-blue-500" />
                        </div>
                        <div className="ml-3 flex items-center">
                          <AiOutlineEye className="w-5 h-5 sm:w-5 md:w-5 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" />
                          <span className="ml-2 text-gray-300 group-hover:text-blue-300 transition-colors duration-200">Email</span>
                        </div>
                      </div>
                    </label>
  
                     <label className="flex items-center p-4 border border-gray-700 rounded-xl hover:border-blue-500 hover:bg-gray-800/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 cursor-pointer group">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input type="checkbox" checked={isPhoneNumberChecked} onChange={(e) => setIsPhoneNumberChecked(e.target.checked)} className="w-5 h-5 sm:w-5 md:w-5 text-blue-600 border-gray-600 rounded focus:ring-blue-500" />
                        </div>
                        <div className="ml-3 flex items-center">
                          <AiOutlineEye className="w-5 h-5 sm:w-5 md:w-5 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" />
                          <span className="ml-2 text-gray-300 group-hover:text-blue-300 transition-colors duration-200">Phone Number</span>
                        </div>
                      </div>
                    </label>
                </div>
              </div>
            )}

            {currentPage === 3 && (
              <div className="space-y-6" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
                  <h4 className="font-medium text-blue-300 mb-2">Upload Question File</h4>
                  <p className="text-gray-400 text-sm sm:text-sm md:text-sm">
                    Upload a document containing the assignment questions. Supported formats: PDF, DOCX, DOC.
                  </p>
                </div>

                {!fileContent && <div
                  className={`relative border-2 border-dashed rounded-xl p-8 sm:p-10 md:p-16 text-center cursor-pointer transition-all duration-300 bg-gray-800 ${
                    isDragging
                      ? "border-blue-500 bg-blue-900/20 scale-[1.02] shadow-lg"
                      : "border-gray-700 hover:border-blue-500 hover:bg-gray-800/80"
                  }`}
                >
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileUpload}
                  />

                  <label htmlFor="file-upload" className="cursor-pointer w-full h-full block">
                    <div className="space-y-4">
                      <div className="mx-auto h-16 w-16 sm:h-16 md:h-20 sm:w-16 md:w-20 text-blue-400 bg-blue-900/30 rounded-full flex items-center justify-center">
                        <CloudArrowUpIcon className="h-8 w-8 sm:h-10 sm:w-10 md:h-10 md:w-10" aria-hidden="true" />
                      </div>
                      <div className="text-lg sm:text-lg md:text-lg">
                        <span className="font-medium text-blue-400">Click to upload</span> <span className="text-gray-300">or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOCX or DOC (max. 10MB)</p>
                    </div>
                  </label>

                  {isDragging && (
                    <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center rounded-xl">
                      <div className="text-blue-300 font-bold text-xl flex items-center">
                        <FiArrowUpRight
                          className="w-8 h-8 mr-2 animate-bounce"
                          fill="none"
                          stroke="currentColor"
                        />
                        Drop file here
                      </div>
                    </div>
                  )}
                </div>}
                {isLoadingFile && (
                    <div className="flex justify-center items-center text-blue-300"> <p>Loading</p></div>
                )}

                {fileContent && (
                  <div className="mt-6 animate-fadeIn">
                    <div className="rounded-xl border border-gray-700 overflow-hidden shadow-md">
                      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                        <div className="flex items-center">
                          <FiFileText
                            className="w-5 h-5 text-blue-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                          />
                          <span className="text-sm font-medium text-gray-300 truncate max-w-xs">
                            {fileName || "Uploaded File"}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setFileContent(null)
                            setFileName(null)
                          }}
                          className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                        >
                          <AiOutlineClose className="w-5 h-5"  stroke="currentColor" />
                        </button>
                      </div>
                      <div className="p-4 bg-gray-800">
                        <div className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto max-h-40 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                          {fileContent.substring(0, 500)}
                          {fileContent.length > 500 && (
                            <>
                              <span className="opacity-50">...</span>
                              <div className="mt-2 text-xs text-gray-500 italic">
                                (Preview showing first 500 characters)
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

       
        <div className="bg-gray-800 px-6 py-6 sm:px-8 sm:py-6 md:px-10 flex flex-wrap justify-between items-center gap-4 border-t border-gray-700 mt-8">
          <div className="flex space-x-3">
            {currentPage > 1 && (
              <button
                onClick={prevPage}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                Back
              </button>
            )}

            {currentPage < 3 && (
              <button
                onClick={nextPage}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
              >
                Next
                <ArrowRightIcon className="h-4 w-4 ml-2" aria-hidden="true" />
              </button>
            )}
          </div>

          {currentPage === 3 && (
            <button
              onClick={handleGenerateLink}
              type="button"
              disabled={!fileContent}
              className={`inline-flex items-center px-5 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white
                ${
                  fileContent
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    : "bg-gray-600 cursor-not-allowed"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-all duration-200`}
            >
              <FiLink className="w-5 h-5 mr-2" fill="none" stroke="currentColor" />
              Generate Assignment Link
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GeneratorModal