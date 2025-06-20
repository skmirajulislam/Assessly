import { ReactElement } from "react";

interface itemProps {
    text: string;
    icon: ReactElement;
    onClick?: () => void;
    active?: boolean;
}

const SidebarItem = (props: itemProps) => {
    return (
        <li>
            <button
                onClick={props.onClick}
                className={`w-full flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 group
                    ${props.active
                        ? "bg-gradient-to-r from-indigo-600/40 to-indigo-500/20 border-l-4 border-indigo-500" 
                        : "text-gray-300 hover:bg-gray-700/40 border-l-4 border-transparent" 
                    }`}
            >
                <div className={`${props.active
                    ? "text-indigo-400" 
                    : "text-gray-400 group-hover:text-indigo-400" 
                } transition-colors duration-200`}>
                    {props.icon}
                </div>
                <span className={`text-base font-medium ${props.active
                    ? "text-indigo-300" 
                    : "text-gray-300 group-hover:text-indigo-300" 
                } transition-colors duration-200`}>
                    {props.text}
                </span>
                {props.active && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-indigo-400"></div>
                )}
            </button>
        </li>
    );
};

export default SidebarItem;