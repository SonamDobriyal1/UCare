import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-primary" fill="hsl(174, 42%, 41%)" />
            <span className="text-lg font-serif font-semibold">UCare</span>
          </div>
          <p className="text-sm opacity-60 leading-relaxed">
            AI-powered mental health support for individuals and families affected by addiction.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider opacity-80">Navigation</h4>
          <div className="flex flex-col gap-2">
            {[
              { label: "Home", to: "/" },
              { label: "About", to: "/about" },
              { label: "Features", to: "/features" },
              { label: "Chatbot", to: "/chatbot" },
              { label: "Community", to: "/community" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider opacity-80">Resources</h4>
          <div className="flex flex-col gap-2">
            <span className="text-sm opacity-60">Mental Health Guides</span>
            <span className="text-sm opacity-60">Recovery Resources</span>
            <span className="text-sm opacity-60">Community Forum</span>
            <span className="text-sm opacity-60">FAQ</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider opacity-80">Contact</h4>
          <div className="flex flex-col gap-2">
            <Link to="/contact" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
              Get in Touch
            </Link>
            <span className="text-sm opacity-60">support@ucare.com</span>
            <span className="text-sm opacity-60">KIET Group of Institutions</span>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10 mt-12 pt-8 text-center">
        <p className="text-xs opacity-40">© 2025 UCare. All rights reserved. Built with care for mental well-being.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
