import { Greeting } from "../components/Greeting";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HomeImage from "../assets/home.jpg";
import { toast } from "react-hot-toast";
import Input from "../components/Input";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import Oauth from "../components/Oauth";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [variant, setVariant] = useState("login");

  const getGreeting = Greeting;
  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  }, []);

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      updateProfile(auth.currentUser, {
        displayName: username,
      });

      const formdata = { username, email };
      formdata.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formdata);

      navigate("/dashboard");
      toast.success("Succesfully registered");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const loginuser = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredentials.user) {
        // Fetch the user's data from Firestore based on their UID
        const userDocRef = doc(db, "users", userCredentials.user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();

          // Check if the user is an admin based on the 'isAdmin' field
          const isAdmin = userData.isAdmin === true;

          // Check if the user is an ESH based on the 'isESH' field
          const isESH = userData.isESH === true;

          if (isAdmin) {
            navigate("/admin"); // Navigate to the admin page
          } else if (isESH) {
            navigate("/esh"); // Navigate to the ESH dashboard
          } else {
            navigate("/dashboard"); // Navigate to the user dashboard
          }

          toast.success("Successfully Logged In");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid email or password");
    }
  };




  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 md:p-12">
      <div className="max-w-6xl w-full">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Fortune <span className="text-[#FF5162]">Physiotherapy</span>
          </h1>
          <p className="mt-4 text-slate-500 text-lg md:text-xl font-medium">
            Advanced Clinical Management System
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
          <div className="w-full max-w-md">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100">
              <form
                className="flex flex-col space-y-6"
                onSubmit={variant === "login" ? loginuser : registerUser}
              >
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                    {getGreeting()}
                  </h2>
                  <p className="text-slate-500">
                    {variant === "login" ? "Welcome back! Please login to your account." : "Create a new account to get started."}
                  </p>
                </div>

                {variant === "register" && (
                  <Input
                    label="Username"
                    id="username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    type="text"
                    value={username}
                  />
                )}
                <Input
                  label="Email"
                  id="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  type="email"
                  value={email}
                />
                <Input
                  label="Password"
                  id="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  value={password}
                />

                <button className="w-full bg-[#FF5162] hover:bg-[#E64858] text-white font-semibold py-4 rounded-2xl shadow-lg shadow-red-200 transition-all duration-300 active:scale-[0.98] mt-4">
                  {variant === "login" ? "Sign In" : "Create Account"}
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-400">Or continue with</span>
                  </div>
                </div>

                <Oauth />

                <p className="text-center text-slate-600 mt-8">
                  {variant === "login"
                    ? "New to Fortune Clinincals?"
                    : "Already have an account?"}
                  <button
                    type="button"
                    onClick={toggleVariant}
                    className="text-[#FF5162] font-semibold ml-2 hover:underline focus:outline-none"
                  >
                    {variant === "login" ? "Register Now" : "Login Instead"}
                  </button>
                </p>
              </form>
            </div>
          </div>

          <div className="hidden lg:block w-full max-w-2xl">
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#FF5162]/5 rounded-[3rem] blur-2xl group-hover:bg-[#FF5162]/10 transition-all duration-500"></div>
              <img 
                src={HomeImage} 
                alt="home" 
                className="relative rounded-[2.5rem] shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

