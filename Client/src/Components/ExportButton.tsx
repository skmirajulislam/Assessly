import axios from 'axios';

interface ExportButtonProps {
    hash: string;  
}
export default function ExportButton({ hash }: ExportButtonProps) {
    const token = localStorage.getItem('token');

    const handleExport = async () => {
        try {
            const response = await axios.post("https://assessly-h4b-server.vercel.app/api/v1/assignments/export", {
                hash: hash,  
            }, {
                headers: {
                    token: token,
                },
                responseType: 'blob',  
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `submissions.csv`); 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); 
        } catch (error: any) {
            console.error("Error exporting data:", error);
            alert("Error exporting data.  See console for details.");
        }
    };

    return (
        <button 
            onClick={handleExport}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors flex items-center gap-1"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
        </button>
    );
}