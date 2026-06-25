import { Clock, CheckCircle2 } from 'lucide-react';

interface TimelineItem {
  status: string;
  date: string;
  completed: boolean;
  active?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm space-y-6 border border-border">
      <h3 className="font-bold flex items-center gap-2 text-foreground">
        <Clock size={18} className="text-primary" />
        Progress Timeline
      </h3>
      <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 relative">
            <div className={`z-10 rounded-full p-1 transition-colors duration-300 ${
              item.completed ? 'bg-green-500' :
              item.active ? 'bg-primary animate-pulse' :
              'bg-muted'
            }`}>
              <CheckCircle2 size={14} className="text-white" />
            </div>
            <div>
              <p className={`text-sm font-bold transition-colors ${item.active ? 'text-primary' : 'text-foreground'}`}>{item.status}</p>
              <p className="text-xs text-muted-foreground">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
