import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import logo from '../assets/black.png'

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [userChoice, setUserChoice] = useState("Dashboard"); // Default choice

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChoiceChange = (e) => {
    setUserChoice(e.target.value);
  };

  const loginUser = (e) => {
    e.preventDefault();

    if (form.email === "" || form.password === "") {
      alert("Please enter your email and password.");
      return;
    }

    fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid credentials");
        }
        return response.json();
      })
      .then((data) => {
        alert("Successfully Logged In");
        localStorage.setItem("user", JSON.stringify(data));
        authContext.signin(data._id, () => {
          navigate(`/${userChoice.toLowerCase()}`); // Convert to lowercase for consistent routes
        });
      })
      .catch((error) => {
        alert("Wrong credentials, please try again.");
        console.error(error);
      });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen items-center place-items-center">
      <div className="flex justify-center">
        <img src={require("../assets/signup.jpg")} alt="Signup" />
      </div>
      <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
        <div>
          <img
            className="mx-auto h-30 w-60"
            src={require("../assets/black.png")}
            alt="InverTrax"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={loginUser}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Email address"
                value={form.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={form.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="choice"
                value="Dashboard"
                checked={userChoice === "Dashboard"}
                onChange={handleChoiceChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-900">Dashboard</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="choice"
                value="Pos"
                checked={userChoice === "Pos"}
                onChange={handleChoiceChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-900">Point of Sale</span>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                Don't have an account?{" "}
                <Link to="/register">Register now</Link>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
