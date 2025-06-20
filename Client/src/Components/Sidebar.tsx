import SidebarItem from "./SidebarItem";
import { StateContext } from "../Context API/StateContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { LuNotebookPen } from "react-icons/lu";
import { LiaBookReaderSolid } from "react-icons/lia";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineLogout } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { FaClipboardQuestion } from "react-icons/fa6";

export const Sidebar = () => {
    const { isHome, isAssignments, isSubmissions, isTests, setHome, setAssignments, setSubmissions, setTests } = useContext(StateContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleHomeClick = () => {
        setHome(true);
        setAssignments(false);
        setSubmissions(false);
        setTests(false);
        setIsSidebarOpen(false);
    };

    const handleAssignmentClick = () => {
        setHome(false);
        setAssignments(true);
        setSubmissions(false);
        setTests(false);
        setIsSidebarOpen(false);
    };

    const handleSubmissionsClick = () => {
        setHome(false);
        setAssignments(false);
        setSubmissions(true);
        setTests(false);
        setIsSidebarOpen(false);
    };
    
    const handleTestsClick = () => {
        setHome(false);
        setAssignments(false);
        setSubmissions(false);
        setTests(true);
        setIsSidebarOpen(false);
    };

    const handleLogoutClick = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <>
            {/* Mobile hamburger button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button 
                    onClick={toggleSidebar}
                    className="bg-gray-800/90 text-indigo-400 p-2 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Toggle menu"
                >
                    {isSidebarOpen ? <IoCloseOutline size={24} /> : <RxHamburgerMenu size={24} />}
                </button>
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Main sidebar */}
            <div 
                className={`fixed md:sticky top-0 h-screen z-45 md:z-10 w-72 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                } transition-all duration-300 ease-in-out border-r border-gray-700/30`}
            >
                <div className="h-full flex flex-col">
                    {/* Brand header */}
                    <div className="p-6 flex items-center justify-center border-b border-gray-700/40">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                Assessly
                            </h1>
                            <div className="text-xs text-gray-400 mt-1">Education Made Simple</div>
                        </div>
                    </div>

                    {/* Navigation section */}
                    <div className="flex-grow overflow-y-auto py-6 px-4">
                        <div className="mb-6 px-2">
                            <div className="h-1 w-12 bg-indigo-500 rounded-full mb-2"></div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Navigation
                            </h3>
                        </div>
                        
                        <ul className="space-y-2">
                            <SidebarItem 
                                text="Dashboard" 
                                icon={<FaHome className="w-5 h-5" />} 
                                onClick={handleHomeClick} 
                                active={isHome} 
                            />
                            <SidebarItem 
                                text="Assignments" 
                                icon={<LuNotebookPen className="w-5 h-5" />} 
                                onClick={handleAssignmentClick} 
                                active={isAssignments} 
                            />
                            <SidebarItem 
                                text="Submissions" 
                                icon={<LiaBookReaderSolid className="w-5 h-5" />} 
                                onClick={handleSubmissionsClick} 
                                active={isSubmissions} 
                            />
                            <SidebarItem 
                                text="Tests" 
                                icon={<FaClipboardQuestion className="w-5 h-5" />} 
                                onClick={handleTestsClick} 
                                active={isTests} 
                            />
                        </ul>
                    </div>

                    {/* Bottom section */}
                    <div className="p-4 border-t border-gray-700/40">
                        <button 
                            onClick={handleLogoutClick}
                            className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-gray-700/30 hover:bg-gray-700/60 text-gray-300 hover:text-white transition-all duration-200 group"
                        >
                            <AiOutlineLogout className="w-5 h-5 mr-3 text-indigo-400 group-hover:text-indigo-300" />
                            <span>Logout</span>
                        </button>
                        
                        <div className="mt-4 pt-4 border-t border-gray-800/60 text-center">
                            <div className="text-xs text-gray-500">
                                © {new Date().getFullYear()} Assessly
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;