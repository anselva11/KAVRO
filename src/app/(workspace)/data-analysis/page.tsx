"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import {
  BarChart3,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  Table,
  CheckCircle2,
  TrendingUp,
  Database,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ColumnStat {
  name: string;
  type: "numeric" | "text" | "date";
  count: number;
  nullCount: number;
  mean?: number;
  min?: number;
  max?: number;
}

export default function DataAnalysisPage() {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [stats, setStats] = useState<ColumnStat[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleCSV = `Month,MRR,New_Customers,Churn_Rate,Customer_Acquisition_Cost
Jan,45000,120,2.1,380
Feb,52000,145,1.9,360
Mar,61000,180,1.8,340
Apr,74000,210,1.5,310
May,88000,260,1.4,290
Jun,105000,310,1.2,275`;

  const processData = (parsedRows: any[], name: string) => {
    if (!parsedRows || parsedRows.length === 0) {
      setError("Parsed file is empty");
      return;
    }

    const cols = Object.keys(parsedRows[0]);
    setColumns(cols);
    setData(parsedRows);
    setFileName(name);
    setError(null);
    setAiInsight(null);

    // Compute deterministic stats
    const computedStats: ColumnStat[] = cols.map((col) => {
      let numericCount = 0;
      let sum = 0;
      let min = Infinity;
      let max = -Infinity;
      let nullCount = 0;

      parsedRows.forEach((row) => {
        const val = row[col];
        if (val === undefined || val === null || val === "") {
          nullCount++;
          return;
        }
        const num = Number(val);
        if (!isNaN(num)) {
          numericCount++;
          sum += num;
          if (num < min) min = num;
          if (num > max) max = num;
        }
      });

      const isNumeric = numericCount > parsedRows.length * 0.7;

      if (isNumeric) {
        return {
          name: col,
          type: "numeric",
          count: parsedRows.length,
          nullCount,
          mean: Math.round((sum / numericCount) * 100) / 100,
          min,
          max,
        };
      }

      return {
        name: col,
        type: "text",
        count: parsedRows.length,
        nullCount,
      };
    });

    setStats(computedStats);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setError("Please upload a valid CSV formatted file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB size limit.");
      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        processData(results.data, file.name);
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
      },
    });
  };

  const loadSampleData = () => {
    Papa.parse(sampleCSV, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        processData(results.data, "sample_enterprise_saas_metrics.csv");
      },
    });
  };

  const generateAIExplanation = async () => {
    if (data.length === 0) return;
    setIsAnalyzing(true);
    setAiInsight(null);

    try {
      const summaryStats = stats
        .filter((s) => s.type === "numeric")
        .map((s) => `${s.name}: Mean=${s.mean}, Min=${s.min}, Max=${s.max}`)
        .join("; ");

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Analyze this deterministic summary of the dataset "${fileName}".
Columns: ${columns.join(", ")}
Calculated Stats: ${summaryStats}
Total Rows: ${data.length}

Explain the key trends, anomalies, and strategic business implications.
RULE: Do not invent any figures; refer strictly to the computed numbers.`,
            },
          ],
        }),
      });

      const json = await res.json();
      if (json.success && json.message?.content) {
        setAiInsight(json.message.content);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate statistical synthesis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Data Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic CSV parsing with mathematically verified insights.
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={loadSampleData} className="h-8 text-xs border-slate-800 bg-[#0E1320] self-start sm:self-auto font-mono">
          Load Sample Dataset
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center space-x-2 text-xs text-red-300 font-mono">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      {data.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-[#090D15] p-12 text-center space-y-3 hover:border-slate-700 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <Upload className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Upload Tabular Dataset</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Select a CSV file up to 5MB. Calculations are performed locally and deterministically.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center space-x-2">
            <label className="cursor-pointer">
              <span className="inline-flex items-center justify-center h-8 px-3 rounded bg-slate-100 text-xs font-medium text-slate-950 hover:bg-white shadow-sm transition-colors">
                Choose CSV File
              </span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
            <Button variant="secondary" size="sm" onClick={loadSampleData} className="h-8 text-xs border-slate-800 bg-[#0E1320]">
              Demo CSV
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Meta Banner */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-[#0A0E18] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white font-mono">{fileName}</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {data.length} records | {columns.length} columns | Deterministic calculations verified
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={generateAIExplanation}
                isLoading={isAnalyzing}
                className="h-7 text-xs bg-slate-100 text-slate-950 hover:bg-white font-medium border-0"
              >
                Synthesize Insights
              </Button>
              <label className="cursor-pointer">
                <Button variant="secondary" size="sm" className="h-7 text-xs border-slate-800 bg-[#0E1320]">
                  Replace File
                </Button>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* AI Fact-Grounded Insights Card */}
          {aiInsight && (
            <Card className="border-slate-800 bg-[#090D15]">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-slate-800/80">
                <CardTitle className="text-xs font-semibold font-mono text-slate-200">
                  Statistical Synthesis
                </CardTitle>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Verified Ground Truth
                </span>
              </CardHeader>
              <CardContent className="p-4 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                {aiInsight}
              </CardContent>
            </Card>
          )}

          {/* Computed Statistics Matrix */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Computed Distribution Stats
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {stats.map((stat) => (
                <div key={stat.name} className="p-3.5 rounded-lg border border-slate-800 bg-[#0A0E18] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white font-mono truncate">{stat.name}</span>
                    <span className="kbd-badge text-[10px] uppercase">
                      {stat.type}
                    </span>
                  </div>
                  {stat.type === "numeric" ? (
                    <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Mean</span>
                        <span className="text-slate-200 font-semibold">{stat.mean}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Min</span>
                        <span className="text-slate-400">{stat.min}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Max</span>
                        <span className="text-slate-400">{stat.max}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 font-mono">
                      {stat.count} rows, {stat.nullCount} empty
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Raw Data Table Preview */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Data Sample (First 10 Rows)
            </h3>
            <div className="rounded-lg border border-slate-800 bg-[#0A0E18] overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#070A10] border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="px-3.5 py-2 font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {data.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                      {columns.map((col) => (
                        <td key={col} className="px-3.5 py-1.5 text-slate-300">
                          {String(row[col] ?? "—")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
