import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface ApiErrorResponse {
    message: string;
    errors?: any;
}

interface GenerateTestProps {
    isOpen: boolean;
    onClose: () => void;
    onTestCreated?: (hash: string, url: string) => void;
}

const API_BASE_URL = 'https://assessly-h4b-server.vercel.app';

const GenerateTest: React.FC<GenerateTestProps> = ({ isOpen, onClose, onTestCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        description: '',
        numberOfQuestions: '',
        difficulty: 'medium',
        testDate: '',
        testTime: ''
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: '', subject: '', description: '', numberOfQuestions: '',
                difficulty: 'medium', testDate: '', testTime: ''
            });
            setCurrentStep(1);
            setError(null);
            setSuccessMessage(null);
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(null);
        if (successMessage) setSuccessMessage(null);
    };

    const nextStep = () => {
        if (formData.title.trim() && formData.subject.trim() && formData.description.trim()) {
            setError(null);
            setCurrentStep(2);
        } else {
            setError("Please fill in Title, Subject, and Description before proceeding.");
        }
    };

    const prevStep = () => {
        setError(null);
        setCurrentStep(1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!formData.testDate || !formData.testTime || !formData.numberOfQuestions || parseInt(formData.numberOfQuestions, 10) < 1) {
             setError("Please ensure Test Date, Time, and a valid Number of Questions are set.");
             return;
        }

        setLoading(true);

        try {
            const testDateTime = new Date(`${formData.testDate}T${formData.testTime}:00`);
            if (isNaN(testDateTime.getTime())) {
                throw new Error("Invalid Date or Time provided.");
            }

            const submissionData = {
                title: formData.title.trim(),
                subject: formData.subject.trim(),
                description: formData.description.trim(),
                numQuestions: parseInt(formData.numberOfQuestions, 10),
                difficulty: formData.difficulty,
                testDateTime: testDateTime.toISOString(),
            };

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Authentication token not found. Please log in again.");
            }

            const response = await axios.post(
                `${API_BASE_URL}/api/v1/tests/create`,
                submissionData,
                {
                    headers: {
                        'token': token
                    }
                }
            );

            const responseData = response.data;
            const testHash = responseData.hash;
            const testUrl = `${window.location.origin}/test/${testHash}`;

            setSuccessMessage(`Test created! Shareable Link: ${testUrl}`);
            console.log('Test created successfully:', responseData);

            if (onTestCreated) {
                onTestCreated(testHash, testUrl);
            }

            setTimeout(() => {
                 onClose();
            }, 3000);

        } catch (err: unknown) {
            console.error('Error creating test:', err);
            let errorMessage = "Failed to create test. Please try again.";

            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ApiErrorResponse>;
                if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
                    errorMessage = axiosError.response.data.message;
                    if (axiosError.response.data.errors) {
                        console.error("Validation errors:", axiosError.response.data.errors);
                    }
                } else if (axiosError.request) {
                    errorMessage = "No response received from server. Check network connection.";
                }
            } else if (err instanceof Error) {
                 errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-gray-800 w-full max-w-lg mx-auto rounded-2xl shadow-xl border border-blue-500/20">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-15 mix-blend-lighten"></div>
                    <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500 rounded-full blur-3xl opacity-15 mix-blend-lighten"></div>
                </div>

                <div className="relative p-6 md:p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                Create New AI Test
                            </h2>
                            <p className="text-blue-300/80 text-sm mt-1">
                                Step {currentStep} of 2: {currentStep === 1 ? 'Basic Information' : 'Test Configuration'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-700 rounded-lg disabled:opacity-50"
                            aria-label="Close modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center justify-center mb-6 relative">
                         <div className="absolute w-1/3 h-0.5 bg-gray-600 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                         <div className="relative z-10 flex items-center justify-around w-2/3">
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-300'} border-2 ${currentStep >= 1 ? 'border-blue-500' : 'border-gray-600'} shadow-sm`}>
                                    1
                                </div>
                                <span className={`text-xs ${currentStep >= 1 ? 'text-blue-300' : 'text-gray-500'}`}>Info</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-300'} border-2 ${currentStep === 2 ? 'border-blue-500' : 'border-gray-600'} shadow-sm`}>
                                    2
                                </div>
                                <span className={`text-xs ${currentStep === 2 ? 'text-blue-300' : 'text-gray-500'}`}>Config</span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-900/30 border border-green-700 text-green-300 rounded-lg text-sm">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className={`${currentStep === 1 ? 'block' : 'hidden'} space-y-4`}>
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-blue-300 mb-1">Test Title</label>
                                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400/50 shadow-sm"
                                    placeholder="e.g., Chapter 5 Quiz" />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-blue-300 mb-1">Subject</label>
                                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400/50 shadow-sm"
                                    placeholder="e.g., World History" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-blue-300 mb-1">Question Style Description</label>
                                <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={3}
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400/50 shadow-sm resize-none"
                                    placeholder="e.g., Multiple choice questions with 4 options each, focusing on key dates." />
                            </div>
                        </div>

                        <div className={`${currentStep === 2 ? 'block' : 'hidden'} space-y-4`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="testDate" className="block text-sm font-medium text-blue-300 mb-1">Test Date</label>
                                    <input type="date" id="testDate" name="testDate" value={formData.testDate} onChange={handleChange} required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400/50 shadow-sm appearance-none" />
                                </div>
                                <div>
                                    <label htmlFor="testTime" className="block text-sm font-medium text-blue-300 mb-1">Test Time</label>
                                    <input type="time" id="testTime" name="testTime" value={formData.testTime} onChange={handleChange} required
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400/50 shadow-sm appearance-none" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="numberOfQuestions" className="block text-sm font-medium text-blue-300 mb-1">Number of Questions</label>
                                <input type="number" id="numberOfQuestions" name="numberOfQuestions" value={formData.numberOfQuestions} onChange={handleChange} required min="1" step="1"
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400/50 shadow-sm"
                                    placeholder="e.g., 10" />
                            </div>
                            <div>
                                <label htmlFor="difficulty" className="block text-sm font-medium text-blue-300 mb-1">Difficulty Level</label>
                                <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} required
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white shadow-sm appearance-none"
                                     style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2360a5fa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            {currentStep === 1 && (
                                <>
                                    <button type="button" onClick={onClose} disabled={loading}
                                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/60 border border-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800 disabled:opacity-50">
                                        Cancel
                                    </button>
                                    <button type="button" onClick={nextStep}
                                        className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 shadow-md">
                                        Next <span aria-hidden="true">→</span>
                                    </button>
                                </>
                            )}
                            {currentStep === 2 && (
                                <>
                                    <button type="button" onClick={prevStep} disabled={loading}
                                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/60 border border-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800 disabled:opacity-50">
                                        <span aria-hidden="true">←</span> Back
                                    </button>
                                    <button type="submit" disabled={loading || !formData.testDate || !formData.testTime || !formData.numberOfQuestions}
                                        className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[110px]">
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Test'
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GenerateTest;