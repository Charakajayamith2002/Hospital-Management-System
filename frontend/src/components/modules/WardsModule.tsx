'use client';

import React, { useState } from 'react';
import { BedDouble, Check, AlertCircle, RefreshCw, User, Plus, X } from 'lucide-react';
import { Bed } from '../../types';

export const WardsModule: React.FC = () => {
  const [beds, setBeds] = useState<Bed[]>([
    { _id: 'b1', wardName: 'Intensive Care Unit (ICU)', roomNumber: 'ICU-1', bedNumber: 'Bed-A', dailyRate: 35000, status: 'OCCUPIED', currentPatientId: { _id: '1', fullName: 'Robert Henderson', mrn: 'MRN-2026-00084' } },
    { _id: 'b2', wardName: 'Intensive Care Unit (ICU)', roomNumber: 'ICU-1', bedNumber: 'Bed-B', dailyRate: 35000, status: 'AVAILABLE' },
    { _id: 'b3', wardName: 'General Ward A (Male)', roomNumber: 'GW-101', bedNumber: 'Bed-1', dailyRate: 3500, status: 'OCCUPIED', currentPatientId: { _id: '2', fullName: 'Eleanor Vance', mrn: 'MRN-2026-00085' } },
    { _id: 'b4', wardName: 'General Ward A (Male)', roomNumber: 'GW-101', bedNumber: 'Bed-2', dailyRate: 3500, status: 'AVAILABLE' },
    { _id: 'b5', wardName: 'General Ward B (Female)', roomNumber: 'GW-102', bedNumber: 'Bed-1', dailyRate: 3500, status: 'CLEANING' },
    { _id: 'b6', wardName: 'Pediatric Care Ward', roomNumber: 'PED-201', bedNumber: 'Bed-1', dailyRate: 6500, status: 'AVAILABLE' },
    { _id: 'b7', wardName: 'Private Deluxe Suite', roomNumber: 'DLX-301', bedNumber: 'Bed-A', dailyRate: 22000, status: 'AVAILABLE' },
  ]);

  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [patientName, setPatientName] = useState('');

  const handleAdmit = () => {
    if (!selectedBed || !patientName) return;
    setBeds(prev =>
      prev.map(b =>
        b._id === selectedBed._id
          ? {
              ...b,
              status: 'OCCUPIED',
              currentPatientId: { _id: String(Date.now()), fullName: patientName, mrn: 'MRN-2026-00091' },
            }
          : b
      )
    );
    setSelectedBed(null);
    setPatientName('');
  };

  const handleDischarge = (bedId: string) => {
    setBeds(prev =>
      prev.map(b =>
        b._id === bedId
          ? { ...b, status: 'CLEANING', currentPatientId: null }
          : b
      )
    );
  };

  const handleClearBed = (bedId: string) => {
    setBeds(prev =>
      prev.map(b =>
        b._id === bedId
          ? { ...b, status: 'AVAILABLE' }
          : b
      )
    );
  };

  const wards = Array.from(new Set(beds.map(b => b.wardName)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Inpatient (IPD) &amp; Bed Ward Station</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time bed occupancy, admission, transfer, and sanitation tariffs (LKR)</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Occupied</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Cleaning</span>
        </div>
      </div>

      {/* Ward Cards */}
      <div className="space-y-6">
        {wards.map((ward) => {
          const wardBeds = beds.filter(b => b.wardName === ward);
          const occupied = wardBeds.filter(b => b.status === 'OCCUPIED').length;

          return (
            <div key={ward} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <BedDouble className="w-4 h-4 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-900">{ward}</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {occupied} / {wardBeds.length} Occupied
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {wardBeds.map((bed) => {
                  const isAvailable = bed.status === 'AVAILABLE';
                  const isOccupied = bed.status === 'OCCUPIED';
                  const isCleaning = bed.status === 'CLEANING';

                  return (
                    <div
                      key={bed._id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isAvailable
                          ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400'
                          : isOccupied
                          ? 'bg-blue-50/60 border-blue-200 shadow-xs'
                          : 'bg-amber-50/50 border-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{bed.roomNumber} &bull; {bed.bedNumber}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : isOccupied
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {bed.status}
                        </span>
                      </div>

                      <p className="text-[11px] font-semibold text-teal-800 mt-1">LKR {bed.dailyRate.toLocaleString()} / day</p>

                      {isOccupied && bed.currentPatientId && (
                        <div className="mt-2.5 p-2 bg-white/80 rounded-lg border border-blue-100 text-xs">
                          <p className="font-semibold text-slate-900">{bed.currentPatientId.fullName}</p>
                          <p className="text-[10px] font-mono text-slate-400">{bed.currentPatientId.mrn}</p>
                          <button
                            onClick={() => handleDischarge(bed._id)}
                            className="mt-2 w-full py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold transition"
                          >
                            Discharge Patient
                          </button>
                        </div>
                      )}

                      {isAvailable && (
                        <button
                          onClick={() => setSelectedBed(bed)}
                          className="mt-3 w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded text-[11px] font-semibold transition"
                        >
                          Admit Patient &rarr;
                        </button>
                      )}

                      {isCleaning && (
                        <button
                          onClick={() => handleClearBed(bed._id)}
                          className="mt-3 w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Mark Sanitized</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Admission Modal */}
      {selectedBed && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Admit Patient to {selectedBed.wardName}</h3>
              <button onClick={() => setSelectedBed(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Selected: <strong>{selectedBed.roomNumber} ({selectedBed.bedNumber})</strong> &bull; Tariff: <strong>LKR {selectedBed.dailyRate.toLocaleString()} / day</strong>
              </p>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Marcus Brody"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedBed(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdmit}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold"
                >
                  Confirm Bed Allocation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
