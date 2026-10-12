"use client";

import React, { useState } from "react";
import { User, Lock, Trash2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ProfileSettingsPage() {
  const [fullName, setFullName] = useState("Executive Operator");
  const [email, setEmail] = useState("operator@kavro.app");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }, 400);
  };

  const handleDeleteAccount = () => {
    if (confirm("WARNING: Account deletion is permanent and will delete all workspace documents and conversations. Are you sure?")) {
      alert("Account deletion request submitted. Session will now terminate.");
      window.location.href = "/";
    }
  };

  return (
    <div className="max-w-3xl space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Profile Settings</h1>
        <p className="text-xs text-slate-400">
          Manage your personal account credentials and security authentication.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile changes updated successfully.</span>
        </div>
      )}

      {/* Profile Details Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription>Your public operator name and contact address</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-400 flex items-center justify-center text-lg font-bold text-white shadow-md">
                {fullName.charAt(0)}
              </div>
              <div>
                <Button variant="secondary" size="sm" type="button" className="text-xs">
                  Change Avatar
                </Button>
                <p className="text-[11px] text-slate-500 mt-1">JPG, PNG or GIF up to 2MB</p>
              </div>
            </div>

            <Input
              label="Full Name"
              id="profile-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" size="sm" isLoading={isUpdating} className="h-9 text-xs">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Update Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Security & Password</CardTitle>
          <CardDescription>Update your Supabase authentication password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Current Password"
            id="cur-password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            id="new-password"
            type="password"
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button variant="secondary" size="sm" className="h-8 text-xs">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/30 bg-red-950/10">
        <CardHeader>
          <CardTitle className="text-base text-red-400">Danger Zone</CardTitle>
          <CardDescription>Permanent destruction of workspace records and data</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-200">Delete Account & Data</p>
            <p className="text-[11px] text-slate-400">
              Immediately purges all database conversations, documents, and API quota events.
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={handleDeleteAccount} className="h-8 text-xs">
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
