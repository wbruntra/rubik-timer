import React from 'react'
import Plot from 'react-plotly.js'

function PlotlyScatter({ data }) {
  const orderedData = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  const scatterData = orderedData.map((item, index) => ({
    x: index + 1,
    y: item.time,
  }))

  return (
    <Plot
      data={[
        {
          x: scatterData.map((item) => item.x),
          y: scatterData.map((item) => item.y),
          mode: 'markers',
          type: 'scatter',
          name: 'Scatter Data',
          marker: { color: 'blue' },
        },
        {
          x: scatterData.map((item) => item.x),
          y: scatterData.map((item) => item.y),
          mode: 'lines',
          type: 'scatter',
          name: 'Regression Line',
          line: { color: 'red' },
        },
      ]}
      layout={{ title: 'Scatter Plot with Regression Line', autosize: true }}
    />
  )
}

export default PlotlyScatter
