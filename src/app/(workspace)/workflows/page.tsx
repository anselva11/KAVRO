"use client";

import React, { useState } from "react";
import {
  Workflow,
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Mail,
  ArrowRight,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

interface ExecutionLog {
  id: string;
  workflowName: string;
  status: "completed" | "running" | "failed";
  timestamp: string;
  durationMs: number;
  outputSummary: string;
}

export default function WorkflowsPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<any | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<ExecutionLog[]>([
    {
      id: "wf-1",
      workflowName: "Inbound Feedback Synthesis",
      status: "completed",
      timestamp: "Today at 09:15 AM",
      durationMs: 820,
      outputSummary: "Parsed customer objection and generated 3-point retention proposal draft.",
    },
    {
      id: "wf-2",
      workflowName: "Sprint & Deliverable Aggregation",
      status: "completed",
      timestamp: "Yesterday at 05:30 PM",
      durationMs: 940,
      outputSummary: "Aggregated 14 tasks into structured board update brief.",
    },
  ]);

  const workflows = [
    {
      id: "wf-report",
      name: "Milestone Brief to Strategic Report",
      category: "Document Pipeline",
      description: "Converts bulleted milestone notes into a full 5-section executive report.",
      steps: ["Extract bullet metrics", "Validate factual scope", "Structure executive headings", "Save draft to Studio"],
      icon: FileText,
    },
    {
      id: "wf-email",
      name: "Inbound Feedback to Response Memo",
      category: "Communications",
      description: "Analyzes client feedback and drafts a structured, polite executive email with commitments.",
      steps: ["Detect key blockers", "Draft tailored resolution", "Verify tone", "Output to Document Studio"],
      icon: Mail,
    },
    {
      id: "wf-digest",
      name: "Weekly Sprint & Milestone Digest",
      category: "Operations",
      description: "Aggregates engineering & product deliverables into an executive dashboard summary.",
      steps: ["Categorize deliverables", "Identify blockers & risks", "Calculate velocity score", "Generate digest"],
      icon: Workflow,
    },
  ];

  const triggerWorkflow = (wf: any) => {
    setSelectedWorkflow(wf);
    setIsConfirmOpen(true);
  };

  const handleExecute = () => {
    setIsRunning(true);
    setTimeout(() => {
      const newLog: ExecutionLog = {
        id: `wf-${Date.now()}`,
        workflowName: selectedWorkflow.name,
        status: "completed",
        timestamp: "Just now",
        durationMs: 680,
        outputSummary: `Successfully executed: ${selectedWorkflow.steps[selectedWorkflow.steps.length - 1]}`,
      };
      setLogs([newLog, ...logs]);
      setIsRunning(false);
      setIsConfirmOpen(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
          Workflow Blueprints
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Standardized operational pipelines with explicit human authorization gates.
        </p>
      </div>

      {/* Available Workflows Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Standard Blueprints
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {workflows.map((wf) => {
            const Icon = wf.icon;
            return (
              <Card key={wf.id} className="border-slate-800 bg-[#0A0E18] flex flex-col justify-between hover:border-slate-700 transition-colors">
                <CardHeader className="space-y-1.5 p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {wf.category}
                    </span>
                    <span className="kbd-badge">v1.2</span>
                  </div>
                  <CardTitle className="text-xs font-semibold text-white">{wf.name}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">{wf.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 p-4 pt-0">
                  <div className="border-t border-slate-800/80 pt-2">
                    <ul className="space-y-1 text-xs">
                      {wf.steps.map((step, idx) => (
                        <li key={idx} className="flex items-center text-[11px] text-slate-400 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 mr-1.5 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => triggerWorkflow(wf)}
                    size="sm"
                    className="w-full h-7 text-xs font-medium bg-slate-100 text-slate-950 hover:bg-white border-0 mt-2"
                  >
                    <Play className="w-2.5 h-2.5 mr-1.5 fill-current" /> Execute Pipeline
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Execution Audit Log */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Pipeline Audit Log ({logs.length})
        </h2>

        <div className="rounded-lg border border-slate-800 bg-[#090D15] divide-y divide-slate-800/80 font-mono text-xs">
          {logs.map((log) => (
            <div key={log.id} className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-slate-200">{log.workflowName}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                    {log.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-sans">{log.outputSummary}</p>
              </div>

              <div className="flex items-center space-x-3 text-slate-500 text-[10px]">
                <span>{log.durationMs}ms</span>
                <span>•</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Gate Modal */}
      {selectedWorkflow && (
        <Modal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title="Authorize Pipeline Execution"
          description="Operational workflows require explicit user authorization prior to running."
        >
          <div className="space-y-3 text-xs text-slate-300 pt-1">
            <div className="p-3 rounded border border-slate-800 bg-navy-900 space-y-1 font-mono">
              <p className="font-semibold text-white">{selectedWorkflow.name}</p>
              <p className="text-slate-400 text-[11px] font-sans">{selectedWorkflow.description}</p>
            </div>

            <div className="p-3 rounded border border-slate-800 bg-[#0A0E18] text-slate-400 text-xs flex items-start space-x-2 font-mono text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
              <span>
                Tokens will be allocated from workspace quota and an immutable audit log entry will be created.
              </span>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800/80">
              <Button variant="ghost" size="sm" onClick={() => setIsConfirmOpen(false)} disabled={isRunning} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleExecute} isLoading={isRunning} className="h-8 text-xs bg-slate-100 text-slate-950 hover:bg-white font-medium border-0">
                Confirm &amp; Run
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
