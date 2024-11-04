import { useState } from 'react'
import _ from 'lodash'
import { renderTime, splitKeyString } from './utils'
import { Collapse } from 'react-bootstrap'
import { produce } from 'immer'


const removeRecordByCreatedAt = (records, scramble, created_at) => {
  const scrambleKey = scramble.join('')

  if (!Object.keys(records).includes(scrambleKey)) {
    return records
  }

  const newRecords = produce(records, (draft) => {
    draft[scrambleKey] = records[scrambleKey].filter((record) => record.created_at !== created_at)
  })

  return newRecords
}

export default function RecordList({ records, setRecords, setScramble, currentScramble }) {
  const [open, setOpen] = useState(false)

  return (
    <ul className="list-group">
      {Object.keys(records).map((scrambleKey, i) => {
        const isCurrentScramble = currentScramble.join('') === scrambleKey
        const scrambleArray = splitKeyString(scrambleKey)
        const bestRecord = _.minBy(records[scrambleKey], (record) => record.time)
        return (
          <li key={scrambleKey} className="list-group-item">
            <div
              style={{ cursor: 'pointer' }}
              className="d-flex justify-content-between"
              onClick={() => {
                if (open === i) {
                  setOpen(false)
                  return
                }
                setOpen(i)
                setScramble(scrambleArray)
              }}
            >
              <div>
                {scrambleArray.map((move, index) => (
                  <span className="fw-bold" key={index}>
                    {move}{' '}
                  </span>
                ))}
              </div>
              <div>
                <span className="badge bg-secondary rounded-pill">
                  Best: {bestRecord ? renderTime(bestRecord.time / 10) : 'No Records'}
                </span>
              </div>
            </div>
            <Collapse in={isCurrentScramble}>
              <div>
                <ul className="list-group mt-2">
                  {records[scrambleKey].map((record, index) => (
                    <li
                      key={`record-${index}`}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this record?')) {
                          const newRecords = removeRecordByCreatedAt(
                            records,
                            scrambleArray,
                            record.created_at,
                          )
                          setRecords(newRecords)
                        }
                      }}
                    >
                      {renderTime(record.time / 10)}
                      <span className="badge bg-primary rounded-pill">
                        {new Date(record.created_at * 1000).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Collapse>
          </li>
        )
      })}
    </ul>
  )
}
