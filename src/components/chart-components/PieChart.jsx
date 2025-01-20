import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const items = [
  {id:'id_A', value: 30, label: 'Reported' },
  { id: 'id_B', value: 5, label: 'Processing' },
  { id: 'id_C', value: 20, label: 'Resolved' },
];

const formatObject = (obj) => {
  if (obj === null) {
    return '  undefined';
  }
  return JSON.stringify(obj, null, 2)
    .split('\n')
    .map((l) => `  ${l}`)
    .join('\n');
};
export default function OnSeriesItemClick() {
  const [identifier, setIdentifier] = React.useState(null);
  const [id, setId] = React.useState(undefined);

  const handleClick = (event, itemIdentifier, item) => {
    setId(item.id);
    setIdentifier(itemIdentifier);
  };

  return (
    <>
    
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-start', md: 'center' }}
      justifyContent="space-between"
      sx={{ width: '100%' }}
      className='shadow-md border-2 border-slate-700 rounded-lg'
    >
      <Typography
        component="pre"
        sx={{ maxWidth: { xs: '100%', md: '50%', flexShrink: 1 }, overflow: 'auto' }}
      >
        {`item id: ${id ?? 'undefined'}

item identifier:
${formatObject(identifier)}`}
      </Typography>

      <PieChart
        series={[
          {
            data: items,
          },
        ]}
        onItemClick={handleClick}
        width={400}
        height={200}
        margin={{ right: 200 }}
      />
    </Stack>
    </>
  );
}