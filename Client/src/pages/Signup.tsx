import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../Components/Input";
import { Check, Info } from "lucide-react";

const Signup: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const initialpassRef = useRef<HTMLInputElement>(null);
  const firstnameRef = useRef<HTMLInputElement>(null);
  const lastnameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signup() {
    const firstname = firstnameRef.current?.value;
    const lastname = lastnameRef.current?.value;
    const username = usernameRef.current?.value;
    const initialpassword = initialpassRef.current?.value;
    const finalpass = passwordRef.current?.value;

    if (!firstname || !lastname || !username || !initialpassword || !finalpass) {
      alert("Please fill in all fields.");
      return;
    }

    if (initialpassword !== finalpass) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      await axios.post("https://assessly-h4b-server.vercel.app/api/v1/auth/signup", {
        firstName: firstname,
        lastName: lastname,
        username: username,
        password: finalpass,
      });
      alert("Signup Successful!");
      navigate("/signin");
    } catch (error: any) {
      console.error("Signup Error:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
        if (error.response.status === 409) {
          alert("Signup Failed: Username already exists!");
        } else {
          alert(`Signup Failed: ${error.response.data?.message || 'Server error'}`);
        }
      } else if (error.request) {
        console.error("Error Request:", error.request);
        alert("Signup Failed: Could not connect to the server. Please try again later.");
      } else {
        console.error("Error Message:", error.message);
        alert("Signup Failed: An unexpected error occurred.");
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 pt-10 pb-10">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white ring-2 ring-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.4)]">
        <div className="hidden md:flex md:flex-col justify-between w-1/2 bg-gradient-to-br from-gray-800 via-gray-900 to-black p-12 text-white relative">
           <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-blue-400/30 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-gray-500/30 blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-blue-600/20 blur-3xl animate-pulse delay-500"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 font-sans">Assessly</h1>
            <p className="text-lg text-gray-300 mb-8">
              Your ultimate assessment companion for streamlined evaluations.
            </p>
            <div className="space-y-4">
              {[
                "Online Assessments made easy",
                "Track student progress ",
                "Generate insightful reports",
                "Simplify grading workflows",

              ].map((text, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-blue-500/30 p-1.5 rounded-full">
                    <Check className="h-4 w-4 text-blue-200" />
                  </div>
                  <span className="text-gray-200">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 mt-auto">
            <div className="inline-flex items-center space-x-2 bg-gray-700/50 px-4 py-2 rounded-lg">
              <Info className="h-5 w-5 text-blue-300" />
              <span className="text-gray-300 text-sm">Join educators simplifying assessments</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="md:hidden text-center mb-8">
             <h2 className="text-3xl font-bold text-gray-900 font-sans">Assessly</h2>
             <p className="text-gray-600">Streamlined evaluations</p>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Create your account</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signup();
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
              <Input label="FirstName" type="text" placeholder="Your first name" inputRef={firstnameRef} />
              <Input label="LastName" type="text" placeholder="Your last name" inputRef={lastnameRef} />
            </div>
            <Input label="Username" type="email" placeholder="you@example.com" inputRef={usernameRef} />
            <Input label="Password" type="password" placeholder="Enter password" inputRef={initialpassRef} />
            <Input label="Confirm Password" type="password" placeholder="Re-enter password" inputRef={passwordRef} />
            <div className="pt-2">
              <button
                className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg"
                type="submit"
              >
                Create Account
              </button>
            </div>
          </form>
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center">
              <div className="flex-grow h-px bg-gray-300"></div>
              <div className="mx-4 text-sm text-gray-500">or</div>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>
            <p className="mt-6 text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/signin"
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;