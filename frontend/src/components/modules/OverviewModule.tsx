'use client';

import React from 'react';
import { Users, BedDouble, Pill, FlaskConical, Calendar, ArrowUpRight, Clock, AlertTriangle } from 'lucide-react';

interface OverviewModuleProps {
  onNavigate: (tab: any) => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Active Registered Patients', value: '1,420', change: '+12 today', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', tab: 'patients' },
    { label: 'Total Inpatient Beds', value: '42 / 50 Occupied', change: '84% Occupancy', icon: BedDouble, color: 'text-indigo-600', bg: 'bg-indigo-50', tab: 'wards' },
    { label: "Today's OPD Appointments", value: '68 Scheduled', change: '14 Completed', icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-50', tab: 'appointments' },
    { label: 'Pending Lab Diagnostics', value: '19 Orders', change: '4 Urgent', icon: FlaskConical, color: 'text-amber-600', bg: 'bg-amber-50', tab: 'laboratory' },
    { label: 'Pharmacy Low Stock', value: '3 Medicines', change: 'Below Reorder', icon: Pill, color: 'text-rose-600', bg: 'bg-rose-50', tab: 'pharmacy' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Operations Center</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time status across OPD, IPD, Diagnostics, Pharmacy, and Billing</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span>MongoDB Replica Status: <strong className="text-emerald-600 font-medium">HEALTHY (PRIMARY)</strong></span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigate(stat.tab)}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
              </div>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Active Alerts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Live Clinical Activity Stream</h3>
            <span className="text-xs text-teal-600 font-medium">Auto-refresh: 15s</span>
          </div>
          <div className="space-y-3">
            {[
              { time: '14:28', title: 'Patient Admitted to ICU-1 (Bed-B)', meta: 'Patient MRN-2026-00084 • Admitted by Dr. Sarah Connor', badge: 'IPD Admission', badgeColor: 'bg-indigo-50 text-indigo-700' },
              { time: '14:15', title: 'Lab Results Verified: Complete Blood Count', meta: 'Patient MRN-2026-00042 • Verified by David Miller (Lab Tech)', badge: 'Laboratory', badgeColor: 'bg-amber-50 text-amber-700' },
              { time: '14:02', title: 'Prescription Dispensed: Amoxicillin 500mg', meta: 'Qty: 20 Capsules • Dispensed by Alex Mercer (Pharmacist)', badge: 'Pharmacy', badgeColor: 'bg-rose-50 text-rose-700' },
              { time: '13:50', title: 'Consultation Completed (OPD Token #14)', meta: 'Patient MRN-2026-00078 • Dr. James Wilson (Neurology)', badge: 'OPD Queue', badgeColor: 'bg-teal-50 text-teal-700' },
            ].map((act, index) => (
              <div key={index} className="flex items-start space-x-3.5 p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                <span className="text-xs font-mono text-slate-400 mt-0.5">{act.time}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-900">{act.title}</h4>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${act.badgeColor}`}>
                      {act.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System & Inventory Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Critical Clinical Alerts
          </h3>
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
            <div className="font-semibold flex items-center justify-between">
              <span>Low Pharmacy Inventory</span>
              <span className="text-[10px] bg-rose-200/80 px-1.5 py-0.5 rounded">Action Needed</span>
            </div>
            <p className="text-rose-700 text-[11px]">
              <strong>Cetirizine 10mg</strong> has only 15 units left (threshold is 50).
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-800 space-y-1">
            <div className="font-semibold flex items-center justify-between">
              <span>ICU Ward At Capacity</span>
              <span className="text-[10px] bg-indigo-200/80 px-1.5 py-0.5 rounded">High Load</span>
            </div>
            <p className="text-indigo-700 text-[11px]">
              ICU Ward is currently at 100% capacity. New emergency admissions route to Step-Down HDU.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('wards')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition"
            >
              Open Bed & Ward Station &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

