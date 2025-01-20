
import React from 'react'
import OnSeriesItemClick from './chart-components/PieChart'
import SimpleBarChart from './chart-components/BarChart'
import LineWithPrediction from './chart-components/LineChart'

const Analytics = () => {
  return (
    <>
<div className="flex justify-center items-center flex-col gap-8 mt-14">
<h1 className="text-sky-500">Analytics</h1>
<div className="flex justify-center items-center flex-col gap-4">
<OnSeriesItemClick/>
    <SimpleBarChart/>
    <LineWithPrediction/>
</div>
   
</div>

    </>
  )
}

export default Analytics