'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar, TabType } from '../components/Sidebar';
import { OverviewModule } from '../components/modules/OverviewModule';
import { PatientModule } from '../components/modules/PatientModule';
import { AppointmentsModule } from '../components/modules/AppointmentsModule';
import { WardsModule } from '../components/modules/WardsModule';
import { PharmacyModule } from '../components/modules/PharmacyModule';
import { LaboratoryModule } from '../components/modules/LaboratoryModule';
import { BillingModule } from '../components/modules/BillingModule';
import { Role } from '../types';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<Role>('ADMIN');
  const [currentTab, setCurrentTab] = useState<TabType>('overview');

  const getRoleUser = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return 'Dr. Arthur Vance (Chief Admin)';
      case 'DOCTOR':
        return 'Dr. Sarah Connor (Cardiology)';
      case 'NURSE':
        return 'Nurse Emily Clarke (Ward Station)';
      case 'PHARMACIST':
        return 'Alex Mercer (Lead Pharmacist)';
      case 'LAB_TECH':
        return 'David Miller (Pathologist)';
      case 'RECEPTIONIST':
        return 'Lisa Watson (Front Desk / Billing)';
      default:
        return 'Hospital Staff';
    }
  };

  const renderModule = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewModule onNavigate={setCurrentTab} />;
      case 'patients':
        return <PatientModule />;
      case 'appointments':
        return <AppointmentsModule />;
      case 'wards':
        return <WardsModule />;
      case 'pharmacy':
        return <PharmacyModule />;
      case 'laboratory':
        return <LaboratoryModule />;
      case 'billing':
        return <BillingModule />;
      default:
        return <OverviewModule onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        currentUser={getRoleUser(currentRole)}
      />

      <div className="flex flex-1">
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          currentRole={currentRole}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl overflow-x-hidden">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}

