"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <Badge variant="default">Support & Sales</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Get in touch with the KAVRO team
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Have questions about our enterprise quotas, security architecture, or custom integrations? We respond within one business day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0F1626]/70 space-y-2">
            <Mail className="w-5 h-5 text-primary-400" />
            <h3 className="text-sm font-semibold text-white">Email Us</h3>
            <p className="text-xs text-slate-400">Direct inquiries to our leadership & technical team:</p>
            <p className="text-xs font-mono text-primary-300">support@kavro.app</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-[#0F1626]/70 space-y-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Enterprise SLA</h3>
            <p className="text-xs text-slate-400">
              Enterprise subscribers receive dedicated Slack channels and guaranteed 2-hour response windows.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0F1626]/70">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-semibold text-white">Message Dispatched Successfully</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Thank you for reaching out. A specialist from our solutions team will review your requirements and reply shortly.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  id="contact-name"
                  placeholder="e.g. Jane Doe"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Work Email"
                  id="contact-email"
                  type="email"
                  placeholder="jane@company.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <Input
                label="Subject"
                id="contact-subject"
                placeholder="Enterprise inquiry, feature request, or feedback"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />

              <Textarea
                label="Message"
                id="contact-message"
                rows={4}
                placeholder="Tell us how KAVRO can assist your workflow..."
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />

              <Button type="submit" isLoading={isSubmitting} className="w-full">
                <Send className="w-3.5 h-3.5 mr-1.5" /> Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
