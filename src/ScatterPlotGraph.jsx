import React from 'react'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LineController,
} from 'chart.js'
import { Scatter } from 'react-chartjs-2'
import { linearRegression } from 'simple-statistics'

ChartJS.register(LinearScale, PointElement, LineController, LineElement, Tooltip, Legend)

function ScatterPlotGraph({ data }) {
  const orderedData = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  const regressionResult = linearRegression(
    orderedData.map((item, index) => [index + 1, item.time]),
  )
  const slope = regressionResult.m
  const yIntercept = regressionResult.b

  const regressionLine = orderedData.map((item, index) => ({
    x: index + 1,
    y: slope * (index + 1) + yIntercept,
  }))

  const chartData = {
    datasets: [
      {
        label: 'Scatter Dataset',
        data: orderedData.map((item, index) => ({
          x: index + 1,
          y: item.time,
        })),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
      },
      {
        label: 'Regression Line',
        data: regressionLine,
        borderColor: 'rgba(255,0,0,1)',
        borderWidth: 1,
        type: 'line',
        fill: false,
        pointRadius: 0,
      },
    ],
  }
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return <Scatter data={chartData} options={options} />
}

export default ScatterPlotGraph
