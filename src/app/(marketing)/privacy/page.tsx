import React from "react";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="space-y-3">
        <Badge variant="default">Security & Compliance</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Effective Date: October 12, 2026 | Version 2.0</p>
      </div>

      <div className="prose prose-invert text-xs sm:text-sm text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">1. Commitment to Customer Privacy</h2>
          <p className="text-slate-400">
            At KAVRO Technologies, we prioritize data privacy and sovereignty. We do not monetize your corporate data, nor do we sell or license your inputs to third-party ad networks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">2. AI Model Training Protections</h2>
          <p className="text-slate-400">
            Prompts, business documents, and uploaded spreadsheets processed through KAVRO are not used to train public foundation models. We utilize enterprise API agreements with model providers that strictly exclude customer data retention for model improvement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">3. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Account Information</strong>: Email address, profile name, and authentication tokens via Supabase Auth.</li>
            <li><strong>Workspace Content</strong>: Document texts, prompt history, and metadata saved within your tenant workspace.</li>
            <li><strong>Audit & Telemetry Logs</strong>: Token consumption counts, model latency metrics, and API status codes for quota calculation.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">4. Data Isolation & Row Level Security (RLS)</h2>
          <p className="text-slate-400">
            All user data stored in PostgreSQL is governed by database-enforced Row Level Security. Cross-tenant leakage is prevented at the database kernel level regardless of application bugs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">5. Data Deletion Rights</h2>
          <p className="text-slate-400">
            Users retain full ownership of their workspace artifacts. You can permanently delete conversations, documents, or your entire account at any time via Settings. Deletion cascades immediately across primary storage and backup logs.
          </p>
        </section>
      </div>
    </div>
  );
}
