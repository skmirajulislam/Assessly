import CreateAssignment from "./CreateAssignments";
import AssignmentSection from "./AssignmentSection";
const FinalAssignment = () => {
    return (
        <div className="p-10 min-h-screen bg-gray-900" >
            <h1 className="text-4xl mb-5 font-bold font-mono text-gray-100">Assignment</h1>
            <CreateAssignment/>
            <AssignmentSection/>
        </div>
    );
}
export default FinalAssignment;
