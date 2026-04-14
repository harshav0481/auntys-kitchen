import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import loginBg from "@/assets/login-bg.jpg";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    if (login(username, password)) {
      navigate("/");
    } else {
      setError("Please enter valid credentials");
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail.trim()) {
      setForgotSuccess(true);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      {/* Full background image */}
      <div className="absolute inset-0">
        <img src={loginBg} alt="Traditional Andhra food" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* Form card */}
      <div className="relative w-full max-w-md animate-scale-in rounded-2xl border border-border/50 bg-card/95 p-8 shadow-2xl backdrop-blur-sm">
        {forgotMode ? (
          <>
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold text-primary">Forgot Password</h1>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                Enter your email and we'll send a reset link
              </p>
            </div>

            {forgotSuccess ? (
              <div className="mt-8 rounded-lg bg-green-50 p-4 text-center">
                <p className="font-body text-sm text-green-700">
                  Password reset link sent! Check your email inbox.
                </p>
                <button
                  onClick={() => { setForgotMode(false); setForgotSuccess(false); setForgotEmail(""); }}
                  className="mt-3 font-body text-sm font-semibold text-primary hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-1.5 block font-body text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary py-3 font-body font-bold text-primary-foreground transition-all hover:bg-maroon-light active:scale-[0.98]"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setForgotMode(false)}
                  className="w-full font-body text-sm text-muted-foreground hover:text-primary"
                >
                  ← Back to Sign In
                </button>
              </form>
            )}
          </>
        ) : (
          <>
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold text-primary">
                80's Aunty's Kitchen
              </h1>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                {isSignUp ? "Create your account" : "Sign in to order authentic Andhra delicacies"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-1.5 block font-body text-sm font-medium text-foreground">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block font-body text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-12 font-body text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="mb-1.5 block font-body text-sm font-medium text-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full rounded-lg border px-4 py-3 pr-12 font-body text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/20 ${
                        confirmPassword && confirmPassword !== password
                          ? "border-destructive focus:border-destructive"
                          : "border-input bg-background focus:border-primary"
                      }`}
                      placeholder="Re-enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="mt-1 font-body text-xs text-destructive">Passwords do not match</p>
                  )}
                  {confirmPassword && confirmPassword === password && (
                    <p className="mt-1 font-body text-xs text-green-600">Passwords match ✓</p>
                  )}
                </div>
              )}

              {error && (
                <p className="text-center font-body text-sm text-destructive">{error}</p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-3 font-body font-bold text-primary-foreground transition-all hover:bg-maroon-light active:scale-[0.98]"
              >
                {isSignUp ? "Create Account" : "Sign In"}
              </button>

              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="w-full font-body text-sm text-muted-foreground hover:text-primary"
                >
                  Forgot Password?
                </button>
              )}
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(""); setConfirmPassword(""); }}
                className="font-body text-sm text-muted-foreground"
              >
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <span className="font-semibold text-primary hover:underline">
                  {isSignUp ? "Sign In" : "Sign Up"}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
