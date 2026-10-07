'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BedDouble,
  Pill,
  FlaskConical,
  Receipt,
  FileText,
} from 'lucide-react';
import { Role } from '../types';

export type TabType = 'overview' | 'patients' | 'appointments' | 'wards' | 'pharmacy' | 'laboratory' | 'billing';

interface SidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentRole: Role;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, currentRole }) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, roles: ['ADMIN', 'DOCTOR', 'NURSE', 'PHARMACIST', 'LAB_TECH', 'RECEPTIONIST'] },
    { id: 'patients', label: 'Patient Master (MRN)', icon: Users, roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST', 'LAB_TECH'] },
    { id: 'appointments', label: 'Appointments & OPD', icon: Calendar, roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
    { id: 'wards', label: 'Wards & Beds (IPD)', icon: BedDouble, roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
    { id: 'pharmacy', label: 'Pharmacy & Stock', icon: Pill, roles: ['ADMIN', 'DOCTOR', 'PHARMACIST', 'NURSE'] },
    { id: 'laboratory', label: 'Laboratory Orders', icon: FlaskConical, roles: ['ADMIN', 'DOCTOR', 'LAB_TECH', 'NURSE'] },
    { id: 'billing', label: 'Billing & Invoicing', icon: Receipt, roles: ['ADMIN', 'RECEPTIONIST'] },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Hospital Modules
        </div>
        {navItems.map((item) => {
          const isAllowed = item.roles.includes(currentRole);
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => isAllowed && onTabChange(item.id as TabType)}
              disabled={!isAllowed}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm'
                  : isAllowed
                  ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isAllowed ? 'text-slate-500' : 'text-slate-300'}`} />
                <span>{item.label}</span>
              </div>
              {!isAllowed && (
                <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                  Restricted
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 bg-teal-50 border border-teal-200/60 rounded-xl text-xs text-teal-800">
        <p className="font-semibold flex items-center gap-1.5 mb-1">
          <FileText className="w-3.5 h-3.5 text-teal-600" />
          HIPAA & RBAC Active
        </p>
        <p className="text-[11px] text-teal-600/90 leading-relaxed">
          Sensitive patient EHR data filtered according to assigned staff credentials.
        </p>
      </div>
    </aside>
  );
};

