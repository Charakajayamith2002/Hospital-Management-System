'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Clock, CheckCircle2, User, Stethoscope, ChevronRight, X } from 'lucide-react';
import { Appointment } from '../../types';

export const AppointmentsModule: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      _id: 'app-1',
      patientId: {
        _id: '1',
        fullName: 'Robert Henderson',
        mrn: 'MRN-2026-00084',
        contactNumber: '+1-555-8392',
      },
      doctorId: {
        _id: 'doc-1',
        fullName: 'Dr. Sarah Connor',
        specialization: 'Interventional Cardiology',
      },
      appointmentDate: '2026-10-07',
      slotTime: '10:00 AM - 10:30 AM',
      tokenNumber: 1,
      type: 'OPD',
      status: 'IN_CONSULTATION',
      vitals: {
        bloodPressure: '135/88',
        heartRate: 78,
        temperature: 36.8,
        spO2: 98,
      },
    },
    {
      _id: 'app-2',
      patientId: {
        _id: '2',
        fullName: 'Eleanor Vance',
        mrn: 'MRN-2026-00085',
        contactNumber: '+1-555-9201',
      },
      doctorId: {
        _id: 'doc-1',
        fullName: 'Dr. Sarah Connor',
        specialization: 'Interventional Cardiology',
      },
      appointmentDate: '2026-10-07',
      slotTime: '10:30 AM - 11:00 AM',
      tokenNumber: 2,
      type: 'OPD',
      status: 'CHECKED_IN',
    },
    {
      _id: 'app-3',
      patientId: {
        _id: '3',
        fullName: 'Marcus Brody',
        mrn: 'MRN-2026-00086',
        contactNumber: '+1-555-4421',
      },
      doctorId: {
        _id: 'doc-2',
        fullName: 'Dr. James Wilson',
        specialization: 'Clinical Neurology',
      },
      appointmentDate: '2026-10-07',
      slotTime: '11:00 AM - 11:30 AM',
      tokenNumber: 1,
      type: 'OPD',
      status: 'SCHEDULED',
    },
  ]);

  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [rxDiagnosis, setRxDiagnosis] = useState('');
  const [rxMedicine, setRxMedicine] = useState('');

  const handleCompleteConsultation = () => {
    if (!selectedApp) return;
    setAppointments(prev =>
      prev.map(a =>
        a._id === selectedApp._id
          ? {
              ...a,
              status: 'COMPLETED',
              prescription: {
                diagnosis: rxDiagnosis || 'General Hypertension & Follow-up',
                medications: [
                  { medicineName: rxMedicine || 'Atorvastatin 20mg', dosage: '20mg', frequency: '0-0-1', durationDays: 30 },
                ],
              },
            }
          : a
      )
    );
    setSelectedApp(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_CONSULTATION':
        return <span className="bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full text-[10px]">In Consultation</span>;
      case 'CHECKED_IN':
        return <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full text-[10px]">Waiting in OPD</span>;
      case 'SCHEDULED':
        return <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full text-[10px]">Scheduled</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-[10px]">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Appointments &amp; Outpatient (OPD) Queue</h2>
          <p className="text-xs text-slate-500 mt-0.5">Doctor scheduling, real-time token queues, and consultation charting</p>
        </div>
      </div>

      {/* Appointment Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {appointments.map((app) => (
          <div
            key={app._id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                  Token #{app.tokenNumber}
                </span>
                {getStatusBadge(app.status)}
              </div>

              <h3 className="font-bold text-sm text-slate-900">{app.patientId.fullName}</h3>
              <p className="text-[11px] font-mono text-slate-400">{app.patientId.mrn}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <span className="font-medium text-slate-800">{app.doctorId.fullName}</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{app.slotTime}</span>
                </div>
              </div>

              {app.vitals && (
                <div className="mt-3 p-2 bg-slate-50 rounded-lg text-[11px] grid grid-cols-2 gap-1 text-slate-600">
                  <span>BP: <strong>{app.vitals.bloodPressure}</strong></span>
                  <span>Heart: <strong>{app.vitals.heartRate} bpm</strong></span>
                  <span>SpO2: <strong>{app.vitals.spO2}%</strong></span>
                  <span>Temp: <strong>{app.vitals.temperature}°C</strong></span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              {app.status !== 'COMPLETED' ? (
                <button
                  onClick={() => {
                    setSelectedApp(app);
                    setRxDiagnosis('');
                    setRxMedicine('');
                  }}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctor Consultation &rarr;</span>
                </button>
              ) : (
                <div className="text-center text-xs text-emerald-600 font-semibold flex items-center justify-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Prescription Issued</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Consultation Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Doctor Consultation &amp; Rx Builder</h3>
                <p className="text-xs text-slate-500">{selectedApp.patientId.fullName} &bull; {selectedApp.patientId.mrn}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  placeholder="e.g. Stage 1 Essential Hypertension"
                  value={rxDiagnosis}
                  onChange={(e) => setRxDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Prescribed Medication *</label>
                <input
                  type="text"
                  placeholder="e.g. Atorvastatin 20mg (Once daily at night for 30 days)"
                  value={rxMedicine}
                  onChange={(e) => setRxMedicine(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 text-teal-800 text-[11px]">
                Upon signing, this electronic prescription is automatically dispatched to the <strong>Central Pharmacy</strong> for dispensation and added to the patient&apos;s invoice.
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteConsultation}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold"
                >
                  Sign &amp; Complete Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

