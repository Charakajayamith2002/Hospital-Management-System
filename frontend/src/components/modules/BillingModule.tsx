'use client';

import React, { useState } from 'react';
import { Receipt, DollarSign, CheckCircle, CreditCard, Plus, X } from 'lucide-react';
import { Bill } from '../../types';

export const BillingModule: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([
    {
      _id: 'b-1',
      invoiceNumber: 'INV-2026-00041',
      patientId: { _id: '1', fullName: 'Robert Henderson', mrn: 'MRN-2026-00084' },
      items: [
        { itemType: 'CONSULTATION', description: 'Consultant Cardiologist Channeling Fee', unitPrice: 3000, quantity: 1, total: 3000 },
        { itemType: 'PHARMACY', description: 'Atorvastatin 20mg (30 Tablets)', unitPrice: 65, quantity: 30, total: 1950 },
      ],
      subtotal: 4950,
      tax: 120, // Hospital admin fee
      totalAmount: 5070,
      paidAmount: 5070,
      paymentStatus: 'PAID',
      paymentMethod: 'CARD',
      createdAt: '2026-10-07',
    },
    {
      _id: 'b-2',
      invoiceNumber: 'INV-2026-00042',
      patientId: { _id: '2', fullName: 'Eleanor Vance', mrn: 'MRN-2026-00085' },
      items: [
        { itemType: 'CONSULTATION', description: 'General Outpatient OPD Consultation', unitPrice: 1500, quantity: 1, total: 1500 },
        { itemType: 'LAB_TEST', description: 'Lipid Profile & Serum Cholesterol', unitPrice: 3200, quantity: 1, total: 3200 },
      ],
      subtotal: 4700,
      tax: 150,
      totalAmount: 4850,
      paidAmount: 0,
      paymentStatus: 'UNPAID',
      paymentMethod: 'PENDING',
      createdAt: '2026-10-07',
    },
  ]);

  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const handlePay = () => {
    if (!selectedBill) return;
    setBills(prev =>
      prev.map(b =>
        b._id === selectedBill._id
          ? {
              ...b,
              paidAmount: b.totalAmount,
              paymentStatus: 'PAID',
              paymentMethod,
            }
          : b
      )
    );
    setSelectedBill(null);
  };

  const totalBilled = bills.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalCollected = bills.reduce((acc, b) => acc + b.paidAmount, 0);
  const outstanding = totalBilled - totalCollected;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Billing, Invoicing &amp; Cash Counter (LKR)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Centralized financial settlement across Channeling, Admissions, Pharmacy, and Diagnostics</p>
        </div>
      </div>

      {/* Revenue Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Billed Today</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1">LKR {totalBilled.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Collected</p>
          <h3 className="text-xl font-bold text-emerald-600 mt-1">LKR {totalCollected.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Pending Receivables</p>
          <h3 className="text-xl font-bold text-amber-600 mt-1">LKR {outstanding.toLocaleString()}</h3>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Patient Name &amp; MRN</th>
              <th className="py-3 px-4">Line Items</th>
              <th className="py-3 px-4">Net Total (LKR)</th>
              <th className="py-3 px-4">Status &amp; Mode</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bills.map((bill) => {
              const isPaid = bill.paymentStatus === 'PAID';

              return (
                <tr key={bill._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-700">
                    {bill.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {bill.patientId.fullName}
                    <span className="block text-[10px] font-mono text-slate-400">{bill.patientId.mrn}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <ul className="space-y-0.5">
                      {bill.items.map((item, idx) => (
                        <li key={idx} className="text-[11px]">
                          &bull; {item.description} ({item.quantity}x) — LKR {item.total.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    LKR {bill.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {bill.paymentStatus}
                    </span>
                    {isPaid && (
                      <span className="block text-[10px] text-slate-400 font-medium mt-0.5">via {bill.paymentMethod}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {!isPaid ? (
                      <button
                        onClick={() => setSelectedBill(bill)}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition"
                      >
                        Collect Payment &rarr;
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-semibold text-xs flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Settled
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Collect Payment (LKR)</h3>
              <button onClick={() => setSelectedBill(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Invoice: <strong>{selectedBill.invoiceNumber}</strong><br />
                Patient: <strong>{selectedBill.patientId.fullName}</strong>
              </p>

              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <span className="text-xs text-slate-500">Amount Due</span>
                <p className="text-2xl font-bold text-teal-800">LKR {selectedBill.totalAmount.toLocaleString()}</p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="CASH">Cash (LKR Counter)</option>
                  <option value="CARD">Visa / MasterCard (POS Terminal)</option>
                  <option value="LANKAPAY / FRIMI">LankaPay / QR / Online Banking</option>
                  <option value="INSURANCE">Private Health Insurance (Ceylinco / Sri Lanka Insurance / AIA)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedBill(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePay}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold"
                >
                  Confirm Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
