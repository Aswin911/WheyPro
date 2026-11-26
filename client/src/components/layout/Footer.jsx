
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Camera,
  Users,
  Play,
  Zap,
  Mail,
} from "lucide-react";

const footerLinks = {
  Explore: [
    { label: "Home", href: "#home" },
    { label: "Products", href: "#products" },
    { label: "About us", href: "#about" },
  ],
  Account: [
    { label: "Login", href: "/login", route: true },
    { label: "Register", href: "/register", route: true },
  ],
  Support: [
    { label: "Contact", href: "#contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer
      id="contact"
      className="scroll-mt-20 bg-[#151715] px-5 pb-8 pt-20 text-white sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">

        {/* Main footer */}
        <div className="grid gap-14 border-b border-white/10 pb-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#C7F36B]">
                <Zap className="size-5 fill-[#151515] text-[#151515]" />
              </span>

              <span className="text-xl font-black tracking-tight">
                WHEY<span className="text-[#C7F36B]">PRO</span>
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-white/50">
              Nutrition meets performance. Make every
              step of your fitness journey count.
            </p>

            <a
              href="mailto:contact@wheypro.com"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#C7F36B] transition-colors hover:text-white"
            >
              <Mail className="size-4" />
              Contact us
              <ArrowUpRight className="size-3" />
            </a>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-bold">{heading}</h3>

              <ul className="mt-6 space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.route ? (
                      <Link
                        to={link.href}
                        className="text-sm text-white/50 transition-colors hover:text-[#C7F36B]"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-white/50 transition-colors hover:text-[#C7F36B]"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom footer */}
        <div className="flex flex-col items-center justify-between gap-5 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} WheyPro. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {[
                { Icon: Camera, label: "Instagram" },
                { Icon: Users, label: "Facebook" },
                { Icon: Play, label: "YouTube" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="text-white/50 transition-colors hover:text-[#C7F36B]"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>

          <p className="text-xs font-medium tracking-wider text-white/40">
            BUILT FOR YOUR GOALS.
          </p>
        </div>
      </div>
    </footer>
  );
}
