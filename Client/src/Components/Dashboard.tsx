import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import GeneratorModal from './GeneratorModal';
import GenerateTest from './GenerateTest';
import { StateContext } from '../Context API/StateContext';
import DashboardTop from '../assets/DashboardTop.svg';
import ExportButtonTest from './ExportButtonTest';

const scrollbarStyle = `
  .themed-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .themed-scrollbar::-webkit-scrollbar-track {
    background: #1f2937;
    border-radius: 6px;
  }
  .themed-scrollbar::-webkit-scrollbar-thumb {
    background-color: #4f46e5;
    border-radius: 6px;
    border: 2px solid #1f2937;
  }
  .themed-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #6366f1;
  }
`;

interface Card {
    _id?: string; 
    hash?: string;
    Questions?: string;
    Title?: string;
    Description?: string;
    Deadline?: string;
    [key: string]: any;
}

interface Test {
    hash?: string;
    _id?: string;
    title: string;
    description: string;
    duration: string;
    testDateTime: string;
    numQuestions: number;
    status: 'upcoming' | 'ongoing' | 'completed';
}



const Dashboard: React.FC = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [submissionCounts, setSubmissionCounts] = useState<number[]>([]);
    const [combinedFinal, setCombinedFinal] = useState<{ card: Card; count: number }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [firstName, setFirstName] = useState<string>('');
    const [tests, setTests] = useState<Test[]>([]);
    const [testModalOpen, setTestModalOpen] = useState<boolean>(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { setModal, refreshTrigger } = useContext(StateContext);

    

    const fetchUserData = async () => {
        try {
            const response = await axios.get('https://assessly-h4b-server.vercel.app/api/v1/users/data', {
                headers: {
                  token: token
                }
            });
            setFirstName(response.data.info.firstName);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchAssignmentsAndCounts = async () => {
        try {
            const assignmentsResponse = await axios.get('https://assessly-h4b-server.vercel.app/api/v1/assignments/', {
                headers: {
                    token: token
                }
            });
            console.log(assignmentsResponse.data)
            setCards(assignmentsResponse.data.info as Card[]);
            setSubmissionCounts(assignmentsResponse.data.submissionCounts as number[]);
            console.log(cards)
            console.log(submissionCounts)
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cards:', error);
            setLoading(false);
        }
    };

   
    const fetchTests = async () => {
        try {
            
             const response = await axios.get('https://assessly-h4b-server.vercel.app/api/v1/tests/tests', {
                 headers: { token: token }
             });
             setTests(response.data.tests);
             console.log(tests);
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserData();
            fetchAssignmentsAndCounts();
            fetchTests();
        }
        else {
            navigate('/');
        }
    }, [refreshTrigger]);

    useEffect(() => {
        if (cards && submissionCounts && cards.length > 0 && submissionCounts.length > 0 && cards.length === submissionCounts.length) {
            const combined = cards.map((card, index) => ({
                card: card,
                count: submissionCounts[index]
            }));
            setCombinedFinal(combined);
            console.log(combinedFinal)
        }
    }, [cards, submissionCounts]);
    
    const getTimeRemaining = (deadline: string | undefined): string => {
        if (!deadline) return "No deadline";
        const now = new Date();
        const due = new Date(deadline);
        const diff = due.getTime() - now.getTime();

        if (diff <= 0) return "Overdue";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;

        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return `${hours} hour${hours > 1 ? 's' : ''} left`;
    };

    const getStatusColor = (deadline: string | undefined): string => {
        if (!deadline) return "bg-gray-100 text-gray-800";
        const now = new Date();
        const due = new Date(deadline);
        const diff = due.getTime() - now.getTime();

        if (diff <= 0) return "bg-red-100 text-red-800";
        if (diff < 1000 * 60 * 60 * 24 * 2) return "bg-yellow-100 text-yellow-800";
        return "bg-green-100 text-green-800";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-900">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-indigo-400 font-medium">Loading your assignments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-0 pt-2 bg-gray-900">
            <style>{scrollbarStyle}</style>
            <div className="flex bg-gradient-to-r from-indigo-500 to-purple-600 m-4 p-6 rounded-xl shadow-lg relative overflow-hidden transform transition-all duration-500 hover:shadow-xl">
                <div className="flex flex-col gap-3 justify-center z-10 font-poppins max-w-[60%] text-white">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Welcome, {firstName}
                        <span className="inline-block animate-wave ml-2">👋</span>
                    </h1>
                    <p className="text-indigo-100">
                        Assessly - Simplifying assignment submissions and grading for students and educators. Now with magic test question generation for stress-free quizzes!" 
                        <br />Here's an overview of your active assignments and tests. 
                    </p>
                    <div className="flex gap-2 mt-2">
                        <button
                            className="bg-gray-800 text-indigo-400 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-all border border-indigo-500/20"
                            onClick={() => setModal(true)}
                        >
                            Create a New Assignment
                        </button>
                    </div>
                </div>
                <img
                    src={DashboardTop}
                    alt="Education supplies"
                    className="absolute right-0 top-0 h-full w-auto pr-3 object-contain animate-float"
                />
            </div>

            <div className="mx-4 flex flex-col lg:flex-row gap-6">
                {/* Assignments Section */}
                <div className="lg:w-2/3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-3xl pl-2 pt-2 font-bold font-poppins text-gray-100">Active Assignments</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {combinedFinal.length > 0 ? (
                            combinedFinal.map((item, index) => {
                                const { card, count } = item;
                                const statusColor = getStatusColor(card.Deadline);
                                const timeRemaining = getTimeRemaining(card.Deadline);

                                return (
                                    <div
                                        key={card._id}
                                        className="bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-700 transform hover:-translate-y-1 cursor-pointer"
                                        onClick={() => navigate(`/share/${card.hash}`)}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-semibold text-gray-100 line-clamp-1">{card.Title}</h3>
                                            <span className={`${statusColor} py-1 px-3 rounded-full text-xs font-medium`}>
                                                {timeRemaining}
                                            </span>
                                        </div>

                                        <p className="text-gray-400 mb-4 line-clamp-2">{card.Description || "No description provided"}</p>

                                        <div className="flex items-center gap-2 text-gray-400 mb-4 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Due: {new Date(card.Deadline || '').toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="ml-1 text-sm font-medium text-gray-300">
                                                    {count || 0} submissions
                                                </span>
                                            </div>
                                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-4 rounded-lg text-sm font-medium transition-colors">
                                                View
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-2 flex flex-col items-center justify-center py-10 text-center bg-gray-800 rounded-xl border border-gray-700 shadow-md">
                                <div className="text-indigo-400 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-gray-100 mb-2">No assignments found</h3>
                                <p className="text-gray-400 max-w-sm mb-6">You don't have any active assignments at the moment. Create one to get started!</p>
                                <button
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg text-sm font-medium transition-colors"
                                    onClick={() => setModal(true)}
                                >
                                    Create a New Assignment
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tests Section */}
                <div className="lg:w-1/3">
                    <div className="bg-gray-800/90 rounded-3xl shadow-2xl p-8 border border-purple-500/10 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:bg-gray-800">
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex justify-between items-center relative">
                                <div className="relative">
                                    <span className="absolute -left-4 -top-4 w-16 h-16 bg-purple-700 rounded-full blur-2xl opacity-30"></span>
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent relative">
                                        Upcoming Tests
                                    </h2>
                                </div>
                                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                    View All
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setTestModalOpen(true)}
                                    className="w-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-300 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-indigo-500/30 hover:border-indigo-400/40 shadow-sm hover:shadow flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create New Test
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[270px] overflow-y-scroll pr-2 themed-scrollbar" style={{ 
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#4f46e5 #1f2937'
                        }}>
                            {tests.map((test) => (
                                <div 
                                    key={test._id} 
                                    className="group p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl hover:from-indigo-900/30 hover:to-purple-900/30 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-indigo-500/30 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-h-[120px]"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-semibold text-gray-100 group-hover:text-indigo-300 transition-colors duration-300">{test.title}</h3>
                                        {/* <span className={`${getTestStatusColor(test.status)} px-3 py-1 rounded-full text-xs font-medium shadow-sm`}>
                                            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                                        </span> */}
                                    </div>
                                    <p className="text-sm text-gray-400 mb-3 line-clamp-2 group-hover:text-gray-300">{test.description}</p>
                                    <div className="flex items-center justify-between gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2 bg-gray-700/80 px-3 py-1 rounded-full shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-medium text-gray-300">{test.numQuestions}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-gray-700/80 px-3 py-1 rounded-full shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="font-medium text-gray-300">{new Date(test.testDateTime).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</span>
                                            </div>
                                        </div>
                                        <ExportButtonTest testHash={test.hash || ''} />
                                    </div>
                                </div>
                            ))}

                            {tests.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="text-indigo-400 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-100 mb-2">No upcoming tests</h3>
                                    <p className="text-gray-400 text-sm">You don't have any scheduled tests at the moment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <GeneratorModal />
            <GenerateTest isOpen={testModalOpen} onClose={() => setTestModalOpen(false)} />
        </div>
    );
};

export default Dashboard;