import React, { useState } from 'react';
import { BusinessInsight, api } from '../services/api';
import { Sparkles, Bot, ShieldCheck, RefreshCw, AlertTriangle, TrendingUp, CheckCircle, FileText } from 'lucide-react';

interface InsightsProps {
  insights: BusinessInsight[];
}

export const Insights: React.FC<InsightsProps> = ({ insights }) => {
  const [aiNarrative, setAiNarrative] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string>('Deterministic Analytics Engine');

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const res = await api.generateAiInsights();
      setAiNarrative(res.narrative);
      setSource(res.source);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>✨ AI-Generated Executive Business Briefing</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Architecture: Raw Data → SQL/Python Engine → Verified Financial KPIs → LLM Natural Language Synthesis.
          </p>
        </div>

        <button
          onClick={handleGenerateAI}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Synthesizing Verified KPIs...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Executive Briefing</span>
            </>
          )}
        </button>
      </div>

      {/* AI Narrative Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Executive Synthesis Briefing
              </h3>
              <p className="text-[10px] text-slate-400">
                Engine: <span className="font-semibold text-blue-400">{source}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Mathematically Verified</span>
          </div>
        </div>

        {aiNarrative ? (
          <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-3 leading-relaxed bg-slate-950/50 p-5 rounded-xl border border-slate-800">
            {aiNarrative.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('###')) {
                return <h3 key={i} className="text-sm font-bold text-white mt-2 mb-1">{paragraph.replace('###', '')}</h3>;
              }
              if (paragraph.startsWith('####')) {
                return <h4 key={i} className="text-xs font-bold text-blue-400 mt-3 mb-1">{paragraph.replace('####', '')}</h4>;
              }
              return (
                <p key={i} className="text-slate-300">
                  {paragraph}
                </p>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2 opacity-60" />
            <p className="text-xs text-slate-300 font-semibold">
              Ready to generate natural-language executive narrative.
            </p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
              Click the button above to synthesize the verified SQL and Python calculations into an actionable C-suite briefing.
            </p>
            <button
              onClick={handleGenerateAI}
              className="mt-4 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
            >
              Generate Now
            </button>
          </div>
        )}
      </div>

      {/* Verified Business Findings Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          Verified Analytical Findings (Pre-Calculated Ground Truth)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((ins) => {
            const isWarning = ins.type === 'warning' || ins.type === 'alert';
            return (
              <div
                key={ins.id}
                className={`p-4.5 rounded-xl border transition ${
                  isWarning ? 'bg-slate-900 border-amber-500/30' : 'bg-slate-900 border-blue-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isWarning ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    )}
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {ins.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                    {ins.stat}
                  </span>
                </div>

                <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                  {ins.finding}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-blue-400 flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-400" />
                  <span><strong>Prescribed Business Action:</strong> {ins.recommendation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
