import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../Components/Input";
import { Check, Info } from "lucide-react";

const Login: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function login() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("https://assessly-h4b-server.vercel.app/api/v1/auth/signin", {
        username: username,
        password: password,
      });
      alert("Login Successful!");
      localStorage.setItem("token", response.data.token);

      navigate("/home");
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        alert("Login Failed: Invalid credentials!");
      } else {
        alert("Login Failed: An unexpected error occurred.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center p-4">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(15,23,42,0.9)] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl relative">
        {/* Main container border glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-transparent pointer-events-none shadow-[inset_0_0_30px_rgba(59,130,246,0.2)]"></div>

        <div className="flex flex-col md:flex-row relative">
          {/* Left Panel */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-8 md:p-12 text-white relative overflow-hidden">
            {/* Left panel border glow */}
            <div className="absolute inset-0 border-[1px] border-blue-500/20 shadow-[inset_0_0_30px_rgba(59,130,246,0.2),0_0_20px_rgba(59,130,246,0.1)] pointer-events-none"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>
            
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">Assessly</h1>
              <p className="text-gray-300 mb-8">
                Your ultimate assessment companion for streamlined evaluations.
              </p>

              <div className="space-y-4">
                {[
                  "Online Assessments made easy",
                  "Track student progress",
                  "Generate insightful reports",
                  "Simplify grading workflows",
                ].map((text, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-1.5 rounded-full shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/30 group-hover:glow-blue-500/20 transition-all duration-300">
                      <Check className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">{text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-12">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#1e293b]/80 to-[#0f172a]/80 shadow-lg shadow-black/20 hover:shadow-blue-500/10 transition-all duration-300">
                  <Info className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Join educators simplifying assessments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 p-8 md:p-12 bg-white/90 backdrop-blur-xl relative">
            {/* Right panel border glow */}
            <div className="absolute inset-0 border-[1px] border-blue-500/10 shadow-[inset_0_0_30px_rgba(59,130,246,0.1),0_0_20px_rgba(59,130,246,0.05)] pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                Welcome back!
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  login();
                }}
                className="space-y-6"
              >
                <Input
                  label="Username"
                  type="email"
                  placeholder="you@example.com"
                  inputRef={usernameRef}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  inputRef={passwordRef}
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transform hover:translate-y-[-1px] active:translate-y-[1px]"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <div className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 hover:underline decoration-2 underline-offset-4 hover:glow-blue-500/30"
                  >
                    Sign up
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;