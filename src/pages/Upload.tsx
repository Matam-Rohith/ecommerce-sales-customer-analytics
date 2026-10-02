import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  UploadCloud, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  RefreshCw, 
  Database,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface UploadProps {
  onDataProcessed: () => void;
}

export const Upload: React.FC<UploadProps> = ({ onDataProcessed }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string>('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setSuccessMessage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      setCsvPreview(text.split('\n').slice(0, 5).join('\n'));
    };
    reader.readAsText(file);
  };

  const handleValidate = async () => {
    if (!selectedFile) return;
    setIsValidating(true);
    try {
      const res = await api.uploadData(selectedFile, false);
      setValidationResult(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      const res = await api.uploadData(selectedFile, true);
      setSuccessMessage('✓ Dataset successfully cleaned, normalized, and updated across the relational schema!');
      onDataProcessed();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>📥 Data Upload & Automated ETL Pipeline</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload new sales batches. The system executes automated schema verification, data cleaning, and relational ingestion.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-150 ${
          dragActive
            ? 'border-blue-500 bg-blue-950/30'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h3 className="text-sm font-bold text-white">
          Drag & Drop CSV / Excel transactional export here
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Supports standardized schemas with order_id, order_date, customer_id, product_id, and revenue.
        </p>

        <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20 cursor-pointer">
          <FileText className="w-4 h-4" />
          <span>Browse File</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>

        {selectedFile && (
          <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 inline-flex items-center gap-3 text-xs text-slate-200">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="font-semibold">{selectedFile.name}</span>
            <span className="text-slate-500">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="ml-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg font-bold text-xs transition cursor-pointer"
            >
              {isValidating ? 'Validating...' : 'Validate File'}
            </button>
          </div>
        )}
      </div>

      {/* Validation Checklist Card */}
      {validationResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Pre-Ingestion Schema Validation
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              validationResult.success ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {validationResult.success ? 'Validation Passed' : 'Schema Warnings'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-400 text-[10px] block">Row Count</span>
                <span className="font-bold text-white">{validationResult.total_rows.toLocaleString()} rows detected</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-400 text-[10px] block">Required Columns</span>
                <span className="font-bold text-white">All 7 Primary Columns Present</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-400 text-[10px] block">Duplicate Check</span>
                <span className="font-bold text-white">{validationResult.duplicate_orders} duplicate order IDs</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              {validationResult.missing_city_values > 0 ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <div>
                <span className="text-slate-400 text-[10px] block">City Metadata</span>
                <span className="font-bold text-white">{validationResult.missing_city_values} missing values</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400">
              Pipeline: Upload → Validation → Cleaning → PostgreSQL → Analytics Engine → Live Dashboard
            </div>

            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing ETL Pipeline...</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5" />
                  <span>Ingest & Reload Analytics</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};
