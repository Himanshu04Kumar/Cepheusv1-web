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
    <div className="bg-amber-500/10 border-2 border-amber-500/20 p-6 rounded-xl space-y-4">
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
        <AlertCircle size={24} />
        <h3 className="text-lg font-bold">Action Required: Approve Repair</h3>
      </div>
      <div className="bg-card p-4 rounded-lg shadow-inner text-sm space-y-2 text-foreground border border-amber-500/10">
        <p><strong className="text-muted-foreground">Diagnosis:</strong> {diagnosis}</p>
        <p><strong className="text-muted-foreground">Parts:</strong> {parts}</p>
        <div className="pt-2 border-t border-border mt-2 flex justify-between items-end">
          <span className="text-muted-foreground uppercase text-xs font-bold tracking-tight">Total Quoted Price</span>
          <span className="text-2xl font-bold text-foreground">₹{price.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onDecline}
          className="flex-1 bg-card text-amber-600 border border-amber-500/20 py-3 rounded-lg font-bold hover:bg-amber-500/5 transition-colors"
        >
          Decline
        </button>
        <button
          onClick={onApprove}
          className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all active:scale-[0.98]"
        >
          Approve & Repair
        </button>
      </div>
    </div>
  );
}
