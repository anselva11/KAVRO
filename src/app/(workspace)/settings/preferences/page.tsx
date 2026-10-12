"use client";

import React, { useState } from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PreferencesPage() {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [defaultTone, setDefaultTone] = useState("professional");
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Workspace Preferences</h1>
        <p className="text-xs text-slate-400">
          Customize UI aesthetics, model generation defaults, and editor behavior.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Preferences saved successfully.</span>
        </div>
      )}

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance & Theme</CardTitle>
          <CardDescription>Select your preferred visual aesthetic for KAVRO</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "dark", label: "Dark Mode (Default)", icon: Moon },
              { id: "light", label: "Light Mode", icon: Sun },
              { id: "system", label: "System Sync", icon: Monitor },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`p-3.5 rounded-xl border text-left space-y-2 transition-colors cursor-pointer ${
                    isSelected
                      ? "border-primary-500 bg-primary-500/15 text-white"
                      : "border-slate-800 bg-[#0E1524] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-primary-400" : "text-slate-500"}`} />
                  <p className="text-xs font-semibold">{t.label}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Generation Defaults */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Document Studio Defaults</CardTitle>
          <CardDescription>Configure pre-selected settings for newly generated documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="pref-tone" className="block text-xs font-medium text-slate-300 mb-1.5">
              Default Tone of Voice
            </label>
            <select
              id="pref-tone"
              value={defaultTone}
              onChange={(e) => setDefaultTone(e.target.value)}
              className="w-full h-10 px-3 text-xs text-slate-100 bg-navy-900 border border-slate-800 rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="professional">Professional & Direct</option>
              <option value="persuasive">Persuasive & Commercial</option>
              <option value="executive">Executive & Strategic</option>
              <option value="concise">Concise & Minimal</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <div>
              <p className="text-xs font-medium text-slate-200">Autosave in Document Studio</p>
              <p className="text-[11px] text-slate-500">Automatically sync edits to PostgreSQL as you type</p>
            </div>
            <input
              type="checkbox"
              checked={autoSaveEnabled}
              onChange={(e) => setAutoSaveEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-primary-600 bg-navy-900 border-slate-700"
            />
          </div>

          <Button size="sm" onClick={handleSave} className="h-8 text-xs">
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
