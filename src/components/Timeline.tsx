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
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
      <h3 className="font-bold flex items-center gap-2">
        <Clock size={18} className="text-blue-600" />
        Progress Timeline
      </h3>
      <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 relative">
            <div className={`z-10 rounded-full p-1 ${item.completed ? 'bg-green-500' : item.active ? 'bg-blue-600' : 'bg-gray-200'}`}>
              <CheckCircle2 size={14} className="text-white" />
            </div>
            <div>
              <p className={`text-sm font-bold ${item.active ? 'text-blue-600' : 'text-gray-900'}`}>{item.status}</p>
              <p className="text-xs text-gray-400">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
