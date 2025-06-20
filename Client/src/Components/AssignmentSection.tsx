import React, { useState, useEffect } from 'react';
import AssignmentCard from './AssignmentCard';
import axios from 'axios';
interface Assignment {
    Name?: boolean;
    Class?: boolean;
    Section?: boolean;
    RollNo?: boolean;
    Department?: boolean;
    Email?: boolean;
    PhoneNumber?: boolean;
    hash?: string;
    Title?: string;
    Deadline?: string;
    userId?: any;
    _id?: string; 
    [key: string]: any;
}

const AssignmentSection: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('https://assessly-h4b-server.vercel.app/api/v1/assignments/latest/all', {
        headers: { token: token || '' }
      });
      console.log(response.data.data);
      setAssignments(response.data.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAssignments();
    } else {
      setLoading(false);
      console.warn('No token found');
    }
  }, [token]);

  const handleDelete = async (_id: string) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      await axios.delete(`https://assessly-h4b-server.vercel.app/api/v1/assignments/delete`, {
        headers: { 
          token: token || ''
        },
        data: { _id } 
      });
      await fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment');
    }
  };

  return (
    <div className='overflow-auto'>
      <h1 className="text-3xl font-bold text-gray-100 mb-5 mt-4">Existing Assignments</h1>
      {loading ? (
        <p className="text-gray-300">Loading...</p>
      ) : (
        <div className="flex flex-wrap gap-3 overflow-y-clip">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment._id || assignment.Title}
              {...assignment}
              onDelete={handleDelete}
              _id={assignment._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentSection;