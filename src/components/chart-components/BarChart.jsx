import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const uData = [10, 12, 8, 15, 9, 5, 7];
const pData = [25, 30, 20, 22, 27, 15, 18];
const xLabels = [
  'Mon',
  'Tue',
  'Wed',
  'Thur',
  'Fri',
  'Sat',
  'Sun',
];

export default function SimpleBarChart() {
  return (
    <div className="p-4">
      <h2 className="text-center text-xl font-semibold mb-4">Weekly Incident Reports</h2>
      <BarChart 
        className="shadow-md border-2 border-slate-700 rounded-lg"
        width={500}
        height={300}
        series={[
          { data: pData, label: 'Reported', id: 'pvId' },
          { data: uData, label: 'Solved', id: 'uvId' },
        ]}
        xAxis={[{ data: xLabels, scaleType: 'band' }]}
      />
    </div>
  );
}
