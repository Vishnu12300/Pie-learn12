import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  Download,
  Table,
  Key,
  ShieldCheck,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { POSTGRESQL_MIGRATION_SQL } from '../../utils/sqlMigrations';
import { useApp } from '../../context/AppContext';

export const DatabaseTab: React.FC = () => {
  const { setNotification } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeTable, setActiveTable] = useState<string>('all');

  const handleCopy = () => {
    navigator.clipboard.writeText(POSTGRESQL_MIGRATION_SQL);
    setCopied(true);
    setNotification({
      message: 'PostgreSQL / Supabase SQL migration copied to clipboard!',
      type: 'success',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([POSTGRESQL_MIGRATION_SQL], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pie_tech_learning_path_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
    setNotification({
      message: 'Downloaded "pie_tech_learning_path_schema.sql"',
      type: 'success',
    });
  };

  const tables = [
    {
      name: 'students',
      desc: 'PIE Tech enrolled students, academic standing, and predictive readiness score',
      cols: ['id (UUID PK)', 'full_name', 'roll_no (UNIQUE)', 'department', 'year', 'semester', 'cgpa', 'target_career', 'readiness_score', 'created_at'],
    },
    {
      name: 'skills',
      desc: 'Global taxonomy of technical & domain proficiencies evaluated',
      cols: ['id (VARCHAR PK)', 'name', 'domain', 'difficulty_level', 'category', 'created_at'],
    },
    {
      name: 'student_skills',
      desc: 'M:N join table tracking proficiency levels, quiz validations, and last assessment',
      cols: ['id (UUID PK)', 'student_id (FK)', 'skill_id (FK)', 'proficiency_level', 'industry_benchmark', 'verified_by_quiz', 'quiz_score', 'last_assessed'],
    },
    {
      name: 'learning_paths',
      desc: 'Dynamic recommended pathways generated for each student',
      cols: ['id (UUID PK)', 'student_id (FK)', 'title', 'target_role', 'total_milestones', 'completed_milestones', 'status', 'estimated_total_weeks', 'last_updated'],
    },
    {
      name: 'path_milestones',
      desc: 'Step-by-step nodes in the branching curriculum graph',
      cols: ['id (VARCHAR PK)', 'path_id (FK)', 'step_order', 'title', 'description', 'resource_url', 'difficulty', 'relevance_percent', 'is_completed', 'prerequisite_id (Self-FK)'],
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-100 text-orange-700">
              SUPABASE / POSTGRESQL 15+
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Database Persistence Layer
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Production SQL Migrations & Relational Schema
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete database DDL scripts covering students, skills taxonomy, join tables, dynamic paths, and milestone prerequisites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied SQL' : 'Copy Full Migration'}</span>
          </button>
          <button
            onClick={handleDownloadSql}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download .SQL</span>
          </button>
        </div>
      </div>

      {/* Schema Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {tables.map((tbl) => (
          <div
            key={tbl.name}
            onClick={() => setActiveTable(tbl.name)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeTable === tbl.name
                ? 'border-orange-500 bg-orange-50/40 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900">
              <Table className="w-4 h-4 text-orange-600" />
              <span>{tbl.name}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{tbl.desc}</p>
            <div className="mt-2 text-[10px] text-slate-400 font-mono">
              {tbl.cols.length} Columns
            </div>
          </div>
        ))}
      </div>

      {/* Code Editor Container */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="font-mono text-slate-400 ml-2">
              001_create_pie_tech_learning_tables.sql
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">Includes RLS Policies & Recalculate Triggers</span>
          </div>
        </div>

        <div className="p-4 overflow-x-auto max-h-[520px]">
          <pre className="font-mono text-xs text-slate-200 leading-relaxed">
            {POSTGRESQL_MIGRATION_SQL}
          </pre>
        </div>
      </div>
    </div>
  );
};
