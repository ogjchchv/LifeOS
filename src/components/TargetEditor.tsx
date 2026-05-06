import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';

export function TargetEditor({ value, onChange, unit, hideSlash }: { value: number, onChange: (val: number) => void, unit?: string, hideSlash?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempVal, setTempVal] = useState(value.toString());

  useEffect(() => {
    setTempVal(value.toString());
  }, [value]);

  const handleSave = () => {
    if (tempVal && !isNaN(Number(tempVal))) {
      onChange(Number(tempVal));
    } else {
      setTempVal(value.toString());
    }
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsEditing(true)}>
         <span className="text-2xl text-neutral-600 group-hover:text-neutral-400 transition-colors">{!hideSlash && '/ '}{value}{unit ? ` ${unit}` : ''} <Settings size={14} className="inline opacity-0 group-hover:opacity-100 transition-opacity" /></span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
       {!hideSlash && <span className="text-2xl text-neutral-600">/ </span>}
       <input type="number" autoFocus value={tempVal} onChange={e => setTempVal(e.target.value)} onBlur={handleSave} onKeyDown={e => e.key === 'Enter' && handleSave()} className="w-20 bg-neutral-900 border border-neutral-700 text-white px-2 py-1 rounded text-xl outline-none" />
       {unit && <span className="text-2xl text-neutral-600">{unit}</span>}
    </div>
  );
}
