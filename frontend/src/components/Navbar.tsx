'use client';

import React from 'react';
import { Activity, Shield, UserCheck, Bell, Building2 } from 'lucide-react';
import { Role } from '../types';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  currentUser: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, onRoleChange, currentUser }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
          <Activity className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-slate-900 tracking-tight">ApexCare</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              HMS Core
            </span>
          </div>
          <p className="text-xs text-slate-500">Metropolitan Teaching Hospital &bull; MongoDB Edition</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Role Switcher for Interactive RBAC Demo */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 shadow-inner">
          <Shield className="w-4 h-4 text-slate-500 ml-1" />
          <span className="text-xs font-medium text-slate-600">Simulate Role:</span>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as Role)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ADMIN">Super Admin</option>
            <option value="DOCTOR">Doctor (Cardiology)</option>
            <option value="NURSE">Head Nurse (Ward)</option>
            <option value="PHARMACIST">Pharmacist</option>
            <option value="LAB_TECH">Lab Technician</option>
            <option value="RECEPTIONIST">Front Desk & Billing</option>
          </select>
        </div>

        {/* User Card */}
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-semibold text-xs">
            {currentUser.substring(0, 2).toUpperCase()}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">{currentUser}</p>
            <p className="text-[11px] text-teal-600 font-medium capitalize">{currentRole.toLowerCase().replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

