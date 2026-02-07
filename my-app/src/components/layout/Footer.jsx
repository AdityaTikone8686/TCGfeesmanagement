import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  ArrowRight,
} from "lucide-react";
import useVisitors from "../hooks/useVisitors";


export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-white">
                <img
                  src="/TikoneCricketGurukul1.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold text-foreground">
                Tikone Cricket Gurukul
              </span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              Professional cricket coaching with state-of-the-art facilities.
              Join hundreds of students who have transformed their game with our
              expert coaching.
            </p>

            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/officialtikonecricketgurukul/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: "/#", label: "Home" },
                { to: "/admin/login", label: "Admin Portal" },
                { to: "/student/login", label: "Student Portal" },
                { to: "/student/register", label: "Register" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition group"
                  >
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <ul className="space-y-3 text-muted-foreground">
              {[
                "Batting Training",
                "Bowling Practice",
                "Fielding Skills",
                "Match Practice",
                "Fitness Training",
              ].map((service) => (
                <li key={service} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Us</h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-green-600 mt-1" />
                <p className="text-muted-foreground">
                  Boat Club, near Kazu Devi Temple, Sector 33, Thergaon, Pune –
                  411033
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-blue-600 mt-1" />
                <p className="text-muted-foreground">
                  +91 9881332092<br />
                  +91 9881998200
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-purple-600 mt-1" />
                <p className="text-muted-foreground">
                  tikonecricketgurukul@gmail.com
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-orange-600 mt-1" />
                <p className="text-muted-foreground">
                  Mon–Sat: 4:00 PM – 7:00 PM<br />
                  Sun: 7:30 AM – 9:30 AM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2025 Tikone Cricket Gurukul | All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
              <Link
                to="/privacy-policy"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookie-policy"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
