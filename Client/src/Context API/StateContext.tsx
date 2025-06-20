import React, { createContext, useState, ReactNode } from 'react';

export const StateContext = createContext<any>(undefined);

interface StateProviderProps {
    children: ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
    const [modalOpen, setModal] = useState(false)
    const [isAssignments, setAssignments] = useState(false)
    const [isSubmissions, setSubmissions] = useState(false)
    const [isHome, setHome] = useState(true)
    const [isTests, setTests] = useState(false)
    const [ocrOutput, setOcrOutput] = useState("")
    const [sub_id, setSub_id] = useState("")
    const [studentName, setStudentName] = useState("")
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const triggerRefresh = () => setRefreshTrigger(prev => prev + 1)

    return (
        <StateContext.Provider value={{
            modalOpen, setModal,
            isAssignments, setAssignments,
            isSubmissions, setSubmissions,
            ocrOutput, setOcrOutput,
            sub_id, setSub_id,
            isHome, setHome,
            studentName, setStudentName,
            refreshTrigger, triggerRefresh,
            isTests, setTests
        }}>
            {children}
        </StateContext.Provider>
    );
};