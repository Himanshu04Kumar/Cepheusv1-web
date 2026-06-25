import { AlertCircle } from 'lucide-react';

interface ApprovalGateProps {
  diagnosis: string;
  parts: string;
  price: number;
  onApprove: () => void;
  onDecline: () => void;
}

export function ApprovalGate({ diagnosis, parts, price, onApprove, onDecline }: ApprovalGateProps) {
  return (
    <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-xl space-y-4">
      <div className="flex items-center gap-2 text-amber-800">
        <AlertCircle size={24} />
        <h3 className="text-lg font-bold">Action Required: Approve Repair</h3>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-inner text-sm space-y-2 text-gray-700 border border-amber-100">
        <p><strong>Diagnosis:</strong> {diagnosis}</p>
        <p><strong>Parts:</strong> {parts}</p>
        <div className="pt-2 border-t mt-2 flex justify-between items-end">
          <span className="text-gray-500 uppercase text-xs font-bold tracking-tight">Total Quoted Price</span>
          <span className="text-2xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onDecline}
          className="flex-1 bg-white text-amber-700 border border-amber-200 py-3 rounded-lg font-bold hover:bg-amber-100 transition"
        >
          Decline
        </button>
        <button
          onClick={onApprove}
          className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700 shadow-md transition"
        >
          Approve & Repair
        </button>
      </div>
    </div>
  );
}
