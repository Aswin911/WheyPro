
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, EyeOff, Zap, ArrowRight, LoaderCircle } from "lucide-react";

import { registerUser } from "@/services/authService";

const initialForm = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};

    const username = form.username.trim().toLowerCase();
    const email = form.email.trim().toLowerCase();

    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
      newErrors.username =
        "Use 3–30 characters: letters, numbers or underscores.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      newErrors.email = "Enter a valid email address.";
    }

    if (form.password.length < 15 || form.password.length > 128) {
      newErrors.password =
        "Password must contain between 15 and 128 characters.";
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await registerUser({
        username: form.username.trim().toLowerCase(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      navigate("/login", {
        replace: true,
        state: { registered: true },
      });
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 409) {
        setServerError("That username or email is already in use.");
      } else if (status === 400 && data?.errors?.length) {
        const backendErrors = {};

        data.errors.forEach((item) => {
          backendErrors[item.field] = item.message;
        });

        setErrors(backendErrors);
      } else {
        setServerError(
          data?.message || "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "username",
      label: "Username",
      placeholder: "Choose a username",
      type: "text",
      autoComplete: "username",
    },
    {
      name: "email",
      label: "Email address",
      placeholder: "you@example.com",
      type: "email",
      autoComplete: "email",
    },
  ];

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
              Built for your goals
            </p>

            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-[-0.05em] xl:text-6xl">
              Make every
              <br />
              step count.
            </h1>

            <p className="mt-6 max-w-sm text-base leading-8 text-white/55">
              Create your WheyPro account and make nutrition
              part of your fitness journey.
            </p>
          </div>

          <p className="relative z-10 text-xs font-medium tracking-widest text-white/35">
            WHEYPRO / YOUR JOURNEY STARTS HERE
          </p>
        </section>

        {/* Form panel */}
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
              Create your account
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#151515]">
              Join WheyPro.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#777A72]">
              Start building an account around your goals.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-3.5">
              {fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-semibold text-[#252525]"
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={Boolean(errors[field.name])}
                    className="h-11 w-full rounded-xl border border-[#E5E5DF] bg-[#FAFAF8] px-4 text-sm text-[#151515] outline-none transition focus:border-[#A8D64E] focus:ring-4 focus:ring-[#C7F36B]/20 disabled:opacity-60"
                  />

                  {errors[field.name] && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

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
                    autoComplete="new-password"
                    placeholder="At least 15 characters"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={Boolean(errors.password)}
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

                {errors.password && (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#252525]"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    className="h-11 w-full rounded-xl border border-[#E5E5DF] bg-[#FAFAF8] px-4 pr-12 text-sm text-[#151515] outline-none transition focus:border-[#A8D64E] focus:ring-4 focus:ring-[#C7F36B]/20 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777A72] hover:text-[#151515]"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {serverError && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {serverError}
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-[#777A72]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#151515] underline decoration-[#C7F36B] decoration-2 underline-offset-4 hover:text-[#789F35]"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-8 text-center text-xs leading-5 text-[#A0A098]">
              By creating an account, you agree to our Terms
              and Privacy Policy.
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
