import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap'
import _ from 'lodash'
import { useMemo } from 'react'

import { recordsToLogs, getStats, renderTime } from './utils'
import ScatterPlotGraph from './ScatterPlotGraph'

// Get all times from records, as an array
const getAllTimes = (records) => {
  const allTimes = []
  Object.keys(records).forEach((scrambleKey) => {
    records[scrambleKey].forEach((record) => {
      allTimes.push({ time: record.time / 10, created_at: 1000 * record.created_at })
    })
  })
  return allTimes
}

function ListRecentLogs({ logs, limit = 8 }) {
  return (
    <div className="my-4">
      <h2 className="text-center">Recent Times</h2>
      <ul className="list-group">
        {_.orderBy(logs, 'created_at', 'desc')
          .slice(0, limit)
          .map((log, index) => {
            const date = new Date(1000 * log.created_at).toLocaleDateString()
            const time = new Date(1000 * log.created_at).toLocaleTimeString()
            return (
              <li key={`log-${index}`} className="list-group-item">
                <div className="row">
                  <div className="col-6">{log.scramble}</div>
                  <div className="col-2">{renderTime(log.time)}</div>
                  <div className="col-4">{`${date} - ${time}`}</div>
                </div>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default function DisplayStats({ records, handleClose, show }) {
  const allTimes = getAllTimes(records)
  const { mean, median } = getStats(allTimes.map((record) => record.time))
  const totalTimeSpent = _.sum(allTimes.map((record) => record.time))

  const logs = useMemo(() => {
    return recordsToLogs(records)
  }, [records])

  const items = [
    {
      title: 'Mean',
      value: renderTime(mean),
    },
    {
      title: 'Median',
      value: renderTime(median),
    },
    {
      title: 'Total Time',
      value: renderTime(totalTimeSpent),
    },
    {
      title: 'Total Solves',
      value: allTimes.length,
    },
  ]

  return (
    <Modal dialogClassName="modal-lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Stats</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="my-4">
          <h2 className="text-center">Graph</h2>
          <ScatterPlotGraph data={allTimes} />
        </div>
        <div className="my-4">
          <ul className="list-group">
            {items.map(({ title, value }, i) => {
              return (
                <li key={`stat-${i}`} className="fs-4 list-group-item">
                  <div className="row">
                    <div className="fw-bold col-6 col-md-3">{title}: </div>
                    <div className="col-6 col-md-4"> {value}</div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="my-4">
          <ListRecentLogs logs={logs} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
