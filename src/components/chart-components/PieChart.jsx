import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const items = [
  {id:'id_A', value: 30 , label: 'Reported' },
  { id: 'id_B', value: 30, label: 'Under Process' },
  { id: 'id_C', value: 40, label: 'Resolved' },
];

export default function OnSeriesItemClick() {
  const [identifier, setIdentifier] = React.useState(null);
  const [id, setId] = React.useState(undefined);

  const handleClick = (event, itemIdentifier, item) => {
    setId(item.id);
    setIdentifier(itemIdentifier);
  };

  return (
    <>
      {/* Title updated here */}
      <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>
        Incident Status Overview
      </Typography>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        sx={{ width: '100%' }}
        className='shadow-md border-2 border-slate-700 rounded-lg'
      >
        {/* Removed the item id and identifier display */}
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
