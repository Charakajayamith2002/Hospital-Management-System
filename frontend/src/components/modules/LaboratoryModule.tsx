'use client';

import React, { useState } from 'react';
import { FlaskConical, CheckCircle2, Clock, Check, FileCheck } from 'lucide-react';
import { LabOrder } from '../../types';

export const LaboratoryModule: React.FC = () => {
  const [orders, setOrders] = useState<LabOrder[]>([
    {
      _id: 'lab-1',
      patientId: { _id: '1', fullName: 'Robert Henderson', mrn: 'MRN-2026-00084' },
      testName: 'Complete Blood Count (CBC / FBC)',
      category: 'Hematology',
      cost: 1650, // LKR
      status: 'PROCESSING',
    },
    {
      _id: 'lab-2',
      patientId: { _id: '2', fullName: 'Eleanor Vance', mrn: 'MRN-2026-00085' },
      testName: 'Lipid Profile & Serum Cholesterol',
      category: 'Biochemistry',
      cost: 3200, // LKR
      status: 'ORDERED',
    },
    {
      _id: 'lab-3',
      patientId: { _id: '3', fullName: 'Marcus Brody', mrn: 'MRN-2026-00086' },
      testName: 'Chest X-Ray (PA View Digital)',
      category: 'Radiology',
      cost: 4500, // LKR
      status: 'COMPLETED',
      conclusion: 'Normal lung parenchymal markings. No cardiomegaly.',
      verifiedAt: '2026-10-07 11:30 AM',
    },
  ]);

  const advanceStatus = (id: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o._id !== id) return o;
        if (o.status === 'ORDERED') return { ...o, status: 'SAMPLE_COLLECTED' };
        if (o.status === 'SAMPLE_COLLECTED') return { ...o, status: 'PROCESSING' };
        if (o.status === 'PROCESSING') {
          return {
            ...o,
            status: 'COMPLETED',
            conclusion: 'Values within normal physiological reference ranges.',
            verifiedAt: new Date().toLocaleTimeString(),
          };
        }
        return o;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Laboratory &amp; Diagnostic Diagnostics</h2>
          <p className="text-xs text-slate-500 mt-0.5">Specimen tracking, test results verification, and electronic diagnostic sign-off (LKR)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {orders.map((order) => {
          const isDone = order.status === 'COMPLETED';

          return (
            <div
              key={order._id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                    {order.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-1">{order.testName}</h3>
                <p className="text-xs text-slate-600 mt-0.5">Patient: <strong>{order.patientId.fullName}</strong></p>
                <p className="text-[10px] font-mono text-slate-400">{order.patientId.mrn}</p>

                {order.conclusion && (
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <p className="font-semibold text-slate-800 text-[11px] mb-0.5">Diagnostic Finding:</p>
                    <p className="text-slate-600 text-[11px] italic">&ldquo;{order.conclusion}&rdquo;</p>
                    {order.verifiedAt && (
                      <p className="text-[10px] text-teal-600 mt-1 font-medium">Verified: {order.verifiedAt}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs text-teal-800">LKR {order.cost.toLocaleString()}</span>
                {!isDone ? (
                  <button
                    onClick={() => advanceStatus(order._id)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Advance Pipeline &rarr;
                  </button>
                ) : (
                  <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" />
                    Report Published
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
