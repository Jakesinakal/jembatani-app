/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GradeConditionSectionProps {
  grade: 'A' | 'B' | 'C';
  setGrade: (v: 'A' | 'B' | 'C') => void;
  condition: 'Segar' | 'Kering' | 'Olahan';
  setCondition: (v: 'Segar' | 'Kering' | 'Olahan') => void;
}

export function GradeConditionSection({
  grade,
  setGrade,
  condition,
  setCondition,
}: GradeConditionSectionProps) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 shadow-sm space-y-4">
      <div className="space-y-2">
        <span className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
          Grade Kualitas
        </span>
        <div className="flex gap-2.5">
          {(['A', 'B', 'C'] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGrade(g)}
              className={`flex-1 py-2 text-label-md font-bold rounded-lg transition-all border ${
                grade === g
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-low text-on-surface-variant border-outline-variant'
              }`}
            >
              Grade {g}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
          Kondisi Barang
        </span>
        <div className="flex gap-2.5">
          {(['Segar', 'Kering', 'Olahan'] as const).map((cond) => (
            <button
              key={cond}
              type="button"
              onClick={() => setCondition(cond)}
              className={`flex-1 py-1.5 text-label-md font-bold rounded-lg transition-all border ${
                condition === cond
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-low text-on-surface-variant border-outline-variant'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
