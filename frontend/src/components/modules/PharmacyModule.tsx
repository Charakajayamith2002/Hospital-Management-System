'use client';

import React, { useState } from 'react';
import { Pill, AlertTriangle, Plus, CheckCircle, Search } from 'lucide-react';
import { Medicine } from '../../types';

export const PharmacyModule: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      _id: 'm1',
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin Trihydrate',
      category: 'Antibiotic',
      dosageForm: 'Capsule',
      strength: '500mg',
      unitPrice: 45.0, // LKR
      stockQuantity: 500,
      reorderLevel: 100,
      batchNumber: 'SL-AMX-2026',
      expiryDate: '2027-12-31',
    },
    {
      _id: 'm2',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'Analgesic & Antipyretic',
      dosageForm: 'Tablet',
      strength: '500mg',
      unitPrice: 7.5, // LKR
      stockQuantity: 2500,
      reorderLevel: 200,
      batchNumber: 'SL-PCM-2026',
      expiryDate: '2028-06-30',
    },
    {
      _id: 'm3',
      name: 'Cetirizine 10mg',
      genericName: 'Cetirizine Dihydrochloride',
      category: 'Antihistamine',
      dosageForm: 'Tablet',
      strength: '10mg',
      unitPrice: 20.0, // LKR
      stockQuantity: 15, // Below reorder
      reorderLevel: 60,
      batchNumber: 'SL-CTZ-2026',
      expiryDate: '2026-12-31',
    },
    {
      _id: 'm4',
      name: 'Atorvastatin 20mg',
      genericName: 'Atorvastatin Calcium',
      category: 'Cardiovascular (Lipid-lowering)',
      dosageForm: 'Tablet',
      strength: '20mg',
      unitPrice: 65.0, // LKR
      stockQuantity: 450,
      reorderLevel: 80,
      batchNumber: 'SL-ATV-2026',
      expiryDate: '2027-05-20',
    },
  ]);

  const [search, setSearch] = useState('');

  const handleDispense = (id: string) => {
    setMedicines(prev =>
      prev.map(m =>
        m._id === id && m.stockQuantity > 0
          ? { ...m, stockQuantity: m.stockQuantity - 10 }
          : m
      )
    );
  };

  const handleRestock = (id: string) => {
    setMedicines(prev =>
      prev.map(m =>
        m._id === id
          ? { ...m, stockQuantity: m.stockQuantity + 100 }
          : m
      )
    );
  };

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.genericName.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pharmacy &amp; Formulary Stock</h2>
          <p className="text-xs text-slate-500 mt-0.5">Drug inventory, batch expiry management, and prescription dispensing in Sri Lankan Rupees (LKR)</p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by Brand Name, Generic Formulation, or Therapeutic Category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Medicine &amp; Strength</th>
              <th className="py-3 px-4">Therapeutic Class</th>
              <th className="py-3 px-4">Batch / Expiry</th>
              <th className="py-3 px-4">Unit Price (LKR)</th>
              <th className="py-3 px-4">Available Stock</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((med) => {
              const isLowStock = med.stockQuantity <= med.reorderLevel;

              return (
                <tr key={med._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {med.name}
                    <span className="block text-[11px] font-normal text-slate-400">
                      {med.genericName} &bull; {med.dosageForm}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{med.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-slate-800 font-medium">{med.batchNumber}</span>
                    <span className="block text-[11px] text-slate-400">Exp: {med.expiryDate}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-teal-800">LKR {med.unitPrice.toFixed(2)}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-800">{med.stockQuantity} units</span>
                      {isLowStock && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-semibold">
                          <AlertTriangle className="w-3 h-3 text-rose-500" />
                          Low Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleDispense(med._id)}
                      disabled={med.stockQuantity <= 0}
                      className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded font-semibold text-[11px] transition disabled:opacity-50"
                    >
                      Dispense 10 &rarr;
                    </button>
                    <button
                      onClick={() => handleRestock(med._id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] transition"
                    >
                      + Restock 100
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
