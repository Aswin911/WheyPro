
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

import { loginUser } from "@/services/authService";
import { useAuth } from "@/context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registered = location.state?.registered;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      login(data);
      const from = location.state?.from?.pathname || "/account";
      navigate(from, { replace: true });
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        setError("Incorrect email or password.");
      } else if (status === 429) {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to sign in. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F7F4] px-5 py-4">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/5 lg:grid-cols-2">

        {/* Brand panel */}
        <section className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden bg-[#151715] p-10 text-white lg:flex">
          <div className="absolute -right-32 -top-24 size-96 rounded-full bg-[#C7F36B]/10 blur-[100px]" />
          <div className="absolute -bottom-32 -left-24 size-96 rounded-full bg-[#C7F36B]/10 blur-[100px]" />

          <Link to="/" className="relative z-10 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-[#C7F36B]">
              <Zap className="size-5 fill-[#151515] text-[#151515]" />
            </span>
            <span className="text-xl font-black tracking-tight">
              WHEY<span className="text-[#C7F36B]">PRO</span>
            </span>
          </Link>

          <div className="relative z-10 max-w-md">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C7F36B]">
              Welcome back
            </p>

            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-[-0.05em] xl:text-6xl">
              Your goals.
              <br />
              Your journey.
              <br />
              Your WheyPro.
            </h1>

            <p className="mt-6 max-w-sm text-base leading-8 text-white/55">
              Sign in and keep moving towards the goals
              you've set for yourself.
            </p>
          </div>

          <p className="relative z-10 text-xs font-medium tracking-widest text-white/35">
            WHEYPRO / BUILT FOR YOUR GOALS
          </p>
        </section>

        {/* Login form */}
        <section className="flex items-center justify-center px-6 py-8 sm:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Link to="/" className="mb-10 inline-flex items-center gap-2 lg:hidden">
              <Zap className="size-6 fill-[#151515] text-[#151515]" />
              <span className="text-lg font-black">
                WHEY<span className="text-[#91B83F]">PRO</span>
              </span>
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#91B83F]">
              Your account
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#151515]">
              Welcome back.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#777A72]">
              Sign in to continue your WheyPro journey.
            </p>

            {registered && (
              <p className="mt-5 rounded-xl border border-[#C7F36B] bg-[#C7F36B]/15 px-4 py-3 text-sm text-[#425D17]">
                Account created successfully. You can sign in now.
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#252525]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-11 w-full rounded-xl border border-[#E5E5DF] bg-[#FAFAF8] px-4 text-sm text-[#151515] outline-none transition focus:border-[#A8D64E] focus:ring-4 focus:ring-[#C7F36B]/20 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#252525]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11 w-full rounded-xl border border-[#E5E5DF] bg-[#FAFAF8] px-4 pr-12 text-sm text-[#151515] outline-none transition focus:border-[#A8D64E] focus:ring-4 focus:ring-[#C7F36B]/20 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777A72] hover:text-[#151515]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-5 text-sm font-bold text-[#151515] transition hover:-translate-y-0.5 hover:bg-[#B6E653] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#777A72]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-[#151515] underline decoration-[#C7F36B] decoration-2 underline-offset-4 hover:text-[#789F35]"
              >
                Create account
              </Link>
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
