import axios from 'axios';
import { FiDownload } from 'react-icons/fi';
import { useState } from 'react';

interface ExportTestResultsButtonProps {
    testHash: string;
}
export default function ExportTestResultsButton({ testHash }: ExportTestResultsButtonProps) {
    const token = localStorage.getItem('token');
    const [isLoading, setIsLoading] = useState(false);

    const handleExportTestResults = async () => {
        if (!testHash) {
            alert("Test hash is missing.");
            return;
        }
        if (!token) {
            alert("Authentication token not found. Please log in again.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("https://assessly-h4b-server.vercel.app/api/v1/tests/export", {
                hash: testHash,
            }, {
                headers: {
                    token: token,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `test_results_${testHash}.csv`);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error: any) {
            console.error("Error exporting test results:", error);
            if (error.response && error.response.status === 404) {
                 alert("Error: Test not found or no results available to export.");
            } else if (error.response && (error.response.status === 401 || error.response.status === 403)){
                 alert("Authentication error. Please log in again.");
            }
            else {
                 alert("Error exporting test results. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleExportTestResults}
            className={`flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-md hover:shadow-indigo-500/50 hover:shadow-lg transform hover:-translate-y-0.5 border border-indigo-500/30 relative overflow-hidden group ${(!testHash || isLoading) ? 'opacity-70 cursor-not-allowed hover:from-indigo-600 hover:to-purple-600 hover:transform-none' : ''}`}
            disabled={!testHash || isLoading}
        >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            {isLoading ? (
                <>
                    <svg className="animate-spin h-10 w-10 text-white mr-1 relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="relative z-10">Exporting...</span>
                </>
            ) : (
                <>
                    <FiDownload className="h-4 w-4 mr-0.5 relative z-10 transition-transform duration-300 group-hover:-translate-y-px" />
                    <span className="relative z-10">Export</span>
                </>
            )}
        </button>
    );
}