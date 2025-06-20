import { useNavigate } from 'react-router-dom';
import error404Gif from '../assets/error404.gif';

function ErrorRoute() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center bg-gradient-to-br from-[#181a20] via-[#233554] to-[#4f8cff] relative overflow-hidden">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 animate-pulse" width="100%" height="100%">
        <circle cx="10%" cy="80%" r="2" fill="#4f8cff" fillOpacity="0.35" />
        <circle cx="90%" cy="20%" r="2.5" fill="#b7d4ff" fillOpacity="0.25" />
        <circle cx="50%" cy="50%" r="1.5" fill="#4f8cff" fillOpacity="0.18" />
        <circle cx="70%" cy="70%" r="1.8" fill="#b7d4ff" fillOpacity="0.18" />
        <circle cx="30%" cy="30%" r="2" fill="#4f8cff" fillOpacity="0.13" />
      </svg>
      <img
        src={error404Gif}
        alt="404 mascot"
        className="w-full max-w-2xl aspect-[4/1.1] object-cover mt-8 mb-4 rounded-3xl shadow-2xl shadow-blue-400/40 border border-blue-400/10 animate-[float_3s_ease-in-out_infinite]"
        style={{
          animationName: 'float',
          animationDuration: '3s',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-in-out'
        }}
      />
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4 z-10">
        <div className="flex items-center justify-center text-[5.5rem] md:text-[7rem] font-black gap-4 md:gap-8 mb-2 select-none">
          <span className="text-blue-400 drop-shadow-[0_2px_16px_rgba(79,140,255,0.25)] animate-pulse">4</span>
          <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-100 bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(79,140,255,0.15)] animate-gradient-x">
            0
          </span>
          <span className="text-blue-400 drop-shadow-[0_2px_16px_rgba(79,140,255,0.25)] animate-pulse">4</span>
        </div>
        <div className="text-xl md:text-2xl font-bold text-blue-50 mb-2 mt-2 text-center drop-shadow-[0_2px_8px_rgba(79,140,255,0.08)] font-mono">
          Oops! Page Not Found
        </div>
        <div className="text-base md:text-lg text-blue-200 mb-6 text-center max-w-lg font-light">
          The page you’re looking for doesn’t exist or has been moved. But don’t worry, you can always head back home!
        </div>
        <button
          onClick={handleGoHome}
          className="mt-1 px-8 py-2 rounded-full border border-blue-400/70 text-blue-400 bg-transparent font-semibold text-base hover:bg-blue-950/40 hover:text-blue-300 hover:border-blue-300 transition-all duration-150 shadow-none focus:outline-none active:scale-95"
        >
          Go Home
        </button>
      </div>
      <div className="w-full text-center text-blue-200 text-sm py-4 tracking-wide z-10">
        &copy; {new Date().getFullYear()} Assessly &mdash; All rights reserved.
      </div>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-18px); }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease-in-out infinite;
          }
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}
      </style>
    </div>
  );
}

export default ErrorRoute;