import React, { useContext, useState } from 'react';
import { StateContext } from '../Context API/StateContext';
import GeneratorModal from './GeneratorModal';
import { motion } from 'framer-motion';

const CreateAssignment: React.FC = () => {
    const { modalOpen, setModal } = useContext(StateContext);
    const [isHovered, setIsHovered] = useState(false);

    const handleModalOpen = () => {
        setModal((prev: boolean) => !prev);
    };

    return (
        <>
            <motion.div 
                className="w-full h-auto min-h-56 rounded-2xl shadow-xl bg-gradient-to-r from-blue-700 to-purple-700 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div 
                    className="w-full h-full p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Background animation elements */}
                    <div className="absolute inset-0 z-0">
                        <motion.div 
                            className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl"
                            animate={{ 
                                scale: isHovered ? 1.2 : 1,
                                x: isHovered ? 20 : 0 
                            }}
                            transition={{ duration: 1.5 }}
                        />
                        <motion.div 
                            className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-purple-500 opacity-20 blur-3xl"
                            animate={{ 
                                scale: isHovered ? 1.2 : 1,
                                x: isHovered ? -20 : 0 
                            }}
                            transition={{ duration: 1.5 }}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col text-left z-10 max-w-xl">
                        <motion.h1 
                            className="text-white text-4xl md:text-5xl font-bold mb-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Create Assignment
                        </motion.h1>
                        <motion.p 
                            className='text-white/90 text-lg md:text-xl font-light leading-relaxed'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            Generate assignments easily with our intuitive tool. Upload your document and customize fields for student submissions.
                        </motion.p>
                    </div>

                    <motion.button
                        className="group relative z-10 bg-gray-800 text-blue-400 text-lg font-semibold rounded-xl px-8 py-4 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 border border-blue-500/20"
                        onClick={handleModalOpen}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Create Assignment
                        </span>
                    </motion.button>
                </div>
            </motion.div>

            {modalOpen && (
                <motion.div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <GeneratorModal/>
                </motion.div>
            )}    
        </>
    );
};

export default CreateAssignment;