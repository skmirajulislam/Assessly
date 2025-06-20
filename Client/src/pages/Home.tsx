import React, {useEffect, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import { StateContext } from '../Context API/StateContext';
import Sidebar from '../Components/Sidebar';
import Dashboard from '../Components/Dashboard';
import FinalAssignment from '../Components/Assignments';
import Submissions from '../Components/Submissions';
import Tests from '../Components/Tests';


interface ErrorBoundaryProps {
    children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean, error: Error | null }> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 text-white">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
                    <p className="text-gray-400 mb-6">{this.state.error?.message || "An unexpected error occurred."}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

const Home: React.FC = () => {
    
    const { isHome, isAssignments, isSubmissions, isTests } = useContext(StateContext);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/'); 
        }
    }, [token, navigate]);

    return (
        <div className="flex w-full min-h-screen">
            <Sidebar/>
            <div className='w-full h-full'>
                <ErrorBoundary>
                    {isHome && <Dashboard/>}       
                    {isAssignments && <FinalAssignment/>}
                    {isSubmissions && <Submissions/>}
                    {isTests && <Tests/>}
                </ErrorBoundary>
            </div>
            
        </div>
    );
};
export default Home;