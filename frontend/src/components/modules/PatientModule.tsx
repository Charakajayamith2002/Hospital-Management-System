'use client';

import React, { useState } from 'react';
import { Plus, Search, UserPlus, Heart, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { Patient } from '../../types';

export const PatientModule: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      _id: '1',
      mrn: 'MRN-2026-00084',
      fullName: 'Robert Henderson',
      dateOfBirth: '1978-04-12',
      gender: 'MALE',
      bloodGroup: 'O+',
      contactNumber: '+1-555-8392',
      email: 'robert.h@example.com',
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
      createdAt: '2026-10-01',
    },
    {
      _id: '2',
      mrn: 'MRN-2026-00085',
      fullName: 'Eleanor Vance',
      dateOfBirth: '1989-11-23',
      gender: 'FEMALE',
      bloodGroup: 'A+',
      contactNumber: '+1-555-9201',
      email: 'eleanor.v@example.com',
      allergies: ['Sulfa Drugs'],
      chronicConditions: ['Asthma'],
      createdAt: '2026-10-03',
    },
    {
      _id: '3',
      mrn: 'MRN-2026-00086',
      fullName: 'Marcus Brody',
      dateOfBirth: '1965-02-17',
      gender: 'MALE',
      bloodGroup: 'B-',
      contactNumber: '+1-555-4421',
      email: 'marcus.b@example.com',
      allergies: [],
      chronicConditions: ['Coronary Artery Disease'],
      createdAt: '2026-10-06',
    },
  ]);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'MALE',
    bloodGroup: 'O+',
    contactNumber: '',
    email: '',
    allergies: '',
    chronicConditions: '',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.fullName || !newPatient.contactNumber) return;

    const year = new Date().getFullYear();
    const newMRN = `MRN-${year}-${String(patients.length + 87).padStart(5, '0')}`;

    const created: Patient = {
      _id: String(Date.now()),
      mrn: newMRN,
      fullName: newPatient.fullName,
      dateOfBirth: newPatient.dateOfBirth || '1990-01-01',
      gender: newPatient.gender as any,
      bloodGroup: newPatient.bloodGroup,
      contactNumber: newPatient.contactNumber,
      email: newPatient.email,
      allergies: newPatient.allergies ? newPatient.allergies.split(',').map(s => s.trim()) : [],
      chronicConditions: newPatient.chronicConditions ? newPatient.chronicConditions.split(',').map(s => s.trim()) : [],
      createdAt: new Date().toISOString(),
    };

    setPatients([created, ...patients]);
    setShowModal(false);
    setNewPatient({
      fullName: '',
      dateOfBirth: '',
      gender: 'MALE',
      bloodGroup: 'O+',
      contactNumber: '',
      email: '',
      allergies: '',
      chronicConditions: '',
    });
  };

  const filtered = patients.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.mrn.toLowerCase().includes(search.toLowerCase()) ||
    p.contactNumber.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Patient Master Index (EHR)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Centralized Electronic Health Records &amp; Medical Record Numbers (MRN)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by Patient Name, Medical Record Number (MRN-...), or Phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
        />
      </div>

      {/* Patient Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">MRN</th>
              <th className="py-3 px-4">Patient Name</th>
              <th className="py-3 px-4">Gender / Blood Group</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Known Allergies</th>
              <th className="py-3 px-4">Chronic History</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((patient) => (
              <tr key={patient._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-teal-700">
                  {patient.mrn}
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  {patient.fullName}
                  <span className="block text-[11px] font-normal text-slate-400">DOB: {patient.dateOfBirth}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-medium text-slate-700">{patient.gender}</span>
                  {patient.bloodGroup && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                      {patient.bloodGroup}
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  {patient.contactNumber}
                  {patient.email && <span className="block text-[11px] text-slate-400">{patient.email}</span>}
                </td>
                <td className="py-3.5 px-4">
                  {patient.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                          <ShieldAlert className="w-2.5 h-2.5" />
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px]">No known allergies</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  {patient.chronicConditions.length > 0 ? (
                    <span className="text-slate-700">{patient.chronicConditions.join(', ')}</span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">None</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button className="text-teal-600 hover:text-teal-800 font-semibold text-[11px] bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded transition">
                    View EHR &rarr;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Patient Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Register New Patient (Generate MRN)</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newPatient.fullName}
                  onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newPatient.dateOfBirth}
                    onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={newPatient.bloodGroup}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+1-555-0000"
                    value={newPatient.contactNumber}
                    onChange={(e) => setNewPatient({ ...newPatient, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Allergies (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Aspirin"
                  value={newPatient.allergies}
                  onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Chronic Conditions (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, Asthma"
                  value={newPatient.chronicConditions}
                  onChange={(e) => setNewPatient({ ...newPatient, chronicConditions: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-xs transition"
                >
                  Create Patient &amp; Assign MRN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

