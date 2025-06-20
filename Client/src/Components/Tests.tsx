import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, Calendar, Clock, FileText, AlertCircle, ExternalLink } from 'lucide-react';
import { StateContext } from '../Context API/StateContext';
import GenerateTest from './GenerateTest';
import ExportButtonTest from './ExportButtonTest';

interface Test {
  _id?: string;
  title: string;
  subject: string;
  description: string;
  numQuestions: number;
  difficulty: string;
  testDateTime: string;
  hash: string;
  createdAt: string;
}

const Tests: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState<boolean>(false);
  const { refreshTrigger, triggerRefresh } = useContext(StateContext);
  const token = localStorage.getItem('token');

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://assessly-h4b-server.vercel.app/api/v1/tests/tests', {
        headers: { token: token }
      });
      setTests(response.data.tests);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch tests');
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [refreshTrigger]); 

  const handleCloseModal = () => {
    setShowGenerateModal(false);
    fetchTests();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const copyTestLink = (hash: string) => {
    const link = `${window.location.origin}/test/${hash}`;
    navigator.clipboard.writeText(link);
    alert('Test link copied to clipboard!');
  };

  const handleTestCreated = () => {
    triggerRefresh();
    fetchTests(); 
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-indigo-400 font-medium">Loading your tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-400">Your Tests</h1>
        <button 
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
        >
          <Plus size={18} />
          Create Test
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      )}

      {tests.length === 0 && !loading && !error ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-300 mb-2">No Tests Yet</h2>
          <p className="text-gray-400 mb-6">You haven't created any tests. Create your first test to get started!</p>
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition"
          >
            Create Your First Test
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map(test => (
            <div key={test._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/20 transition border border-gray-700 hover:border-indigo-500/30">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-2 truncate">{test.title}</h2>
                <div className="flex items-center mb-2">
                  <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${getDifficultyColor(test.difficulty)}`}>
                    {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
                  </span>
                  <span className="text-sm text-gray-400">{test.subject}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{test.description}</p>
                
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDate(test.testDateTime)}</span>
                </div>
                
                <div className="flex items-center text-gray-400 text-sm mb-4">
                  <Clock size={14} className="mr-1" />
                  <span>{test.numQuestions} questions</span>
                </div>
                
                <div className="flex flex-col gap-2 mt-4">
                  <button 
                    onClick={() => copyTestLink(test.hash)}
                    className="w-full flex justify-center items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded transition"
                  >
                    <ExternalLink size={14} />
                    Copy Test Link
                  </button>
                  
                  <ExportButtonTest testHash={test.hash} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Test Modal */}
      <GenerateTest 
        isOpen={showGenerateModal} 
        onClose={handleCloseModal} 
        onTestCreated={handleTestCreated}
      />
    </div>
  );
};

export default Tests;
