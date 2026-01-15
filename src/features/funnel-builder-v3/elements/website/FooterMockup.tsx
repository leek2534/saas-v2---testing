import React from "react";
import { FooterProps } from "../../types/website-elements";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterMockupProps {
  props: Partial<FooterProps>;
}

export function FooterMockup({ props }: FooterMockupProps) {
  const {
    logo = { type: "text", content: "Brand" },
    tagline = "Building amazing experiences",
    linkSections = [
      {
        title: "Product",
        links: [
          { label: "Features", link: "#" },
          { label: "Pricing", link: "#" },
          { label: "Templates", link: "#" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", link: "#" },
          { label: "Blog", link: "#" },
          { label: "Careers", link: "#" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Help Center", link: "#" },
          { label: "Contact", link: "#" },
          { label: "Status", link: "#" },
        ],
      },
    ],
    socialLinks = [
      { platform: "facebook" as const, url: "#" },
      { platform: "twitter" as const, url: "#" },
      { platform: "instagram" as const, url: "#" },
      { platform: "linkedin" as const, url: "#" },
    ],
    newsletter,
    copyright = `© ${new Date().getFullYear()} Brand. All rights reserved.`,
    layout = "multi-column",
    appearance = {},
  } = props;

  const {
    variables = {
      colorPrimary: "#3b82f6",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
    },
  } = appearance;

  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    tiktok: null,
  };

  if (layout === "simple") {
    return (
      <footer className="w-full border-t border-slate-200 py-12 px-6" style={{ backgroundColor: variables.colorBackground }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              {logo.type === "text" ? (
                <div className="text-lg font-bold" style={{ color: variables.colorText }}>
                  {logo.content}
                </div>
              ) : (
                <img src={logo.content} alt="Logo" className="h-8" />
              )}
              <div className="hidden md:flex items-center gap-6">
                {linkSections[0]?.links.map((link, idx) => (
                  <a key={idx} href={link.link} className="text-sm text-slate-600 hover:text-slate-900">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {socialLinks?.map((social, idx) => {
                const Icon = socialIcons[social.platform];
                return Icon ? (
                  <a key={idx} href={social.url} className="text-slate-600 hover:text-slate-900">
                    <Icon className="h-5 w-5" />
                  </a>
                ) : null;
              })}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-600">
            {copyright}
          </div>
        </div>
      </footer>
    );
  }

  if (layout === "centered") {
    return (
      <footer className="w-full border-t border-slate-200 py-12 px-6" style={{ backgroundColor: variables.colorBackground }}>
        <div className="max-w-4xl mx-auto text-center">
          {logo.type === "text" ? (
            <div className="text-2xl font-bold mb-4" style={{ color: variables.colorText }}>
              {logo.content}
            </div>
          ) : (
            <img src={logo.content} alt="Logo" className="h-10 mx-auto mb-4" />
          )}
          {tagline && <p className="text-slate-600 mb-8">{tagline}</p>}
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {linkSections.flatMap(section => section.links).map((link, idx) => (
              <a key={idx} href={link.link} className="text-sm text-slate-600 hover:text-slate-900">
                {link.label}
              </a>
            ))}
          </div>

          {socialLinks && (
            <div className="flex justify-center gap-4 mb-8">
              {socialLinks.map((social, idx) => {
                const Icon = socialIcons[social.platform];
                return Icon ? (
                  <a key={idx} href={social.url} className="text-slate-600 hover:text-slate-900">
                    <Icon className="h-5 w-5" />
                  </a>
                ) : null;
              })}
            </div>
          )}

          <div className="pt-8 border-t border-slate-200 text-sm text-slate-600">
            {copyright}
          </div>
        </div>
      </footer>
    );
  }

  // multi-column
  return (
    <footer className="w-full border-t border-slate-200 py-12 px-6" style={{ backgroundColor: variables.colorBackground }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-2">
            {logo.type === "text" ? (
              <div className="text-xl font-bold mb-4" style={{ color: variables.colorText }}>
                {logo.content}
              </div>
            ) : (
              <img src={logo.content} alt="Logo" className="h-8 mb-4" />
            )}
            {tagline && <p className="text-sm text-slate-600 mb-4">{tagline}</p>}
            {socialLinks && (
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => {
                  const Icon = socialIcons[social.platform];
                  return Icon ? (
                    <a key={idx} href={social.url} className="text-slate-600 hover:text-slate-900">
                      <Icon className="h-5 w-5" />
                    </a>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Link Columns */}
          {linkSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="font-semibold mb-4" style={{ color: variables.colorText }}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a href={link.link} className="text-sm text-slate-600 hover:text-slate-900">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        {newsletter?.enabled && (
          <div className="mb-8 pb-8 border-b border-slate-200">
            <div className="max-w-md">
              <h3 className="font-semibold mb-2" style={{ color: variables.colorText }}>
                {newsletter.title || "Subscribe to our newsletter"}
              </h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={newsletter.placeholder || "Enter your email"}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className="px-4 py-2 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: variables.colorPrimary }}
                >
                  {newsletter.buttonText || "Subscribe"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-200 text-sm text-slate-600 text-center md:text-left">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
