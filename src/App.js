import { useState, useEffect } from 'react'
import _ from 'lodash'
import useLocalStorage from './useLocalStorage'
import { produce } from 'immer'
import 'bootstrap/dist/css/bootstrap.min.css'
import Collapse from 'react-bootstrap/Collapse'
import ScatterPlotGraph from './ScatterPlotGraph'
import Timer from './Timer'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ShowCube from './ShowCube'

const getOppositeMove = (move) => {
  if (move.length === 1) {
    return move + "'"
  }
  if (move[1] === "'") {
    return move[0]
  }
  if (move[1] === '2') {
    return move
  }
}

// If the last three moves in an array are identical, replace the final three moves with the
// opposite move
// if the last two moves are identical, replace the last two moves with the double move

const simplifyMoves = (moves) => {
  let copyMoves = [...moves]

  if (copyMoves.length < 2) {
    return copyMoves
  }

  const lastTwoMoves = copyMoves.slice(copyMoves.length - 2)
  if (lastTwoMoves[0] === lastTwoMoves[1]) {
    const doubleMove = lastTwoMoves[0][0] + '2'
    copyMoves = [...copyMoves.slice(0, copyMoves.length - 2), doubleMove]
  }

  // if the last two moves start with the same letter, replace them with the opposite of the non-2 move
  // if (lastTwoMoves[0][0] === lastTwoMoves[1][0]) {
  //   const nonTwoMove = _.filter(lastTwoMoves, (move) => move.length === 1 || move[1] !== '2')[0]
  //   copyMoves = [...copyMoves.slice(0, copyMoves.length - 2), getOppositeMove(nonTwoMove)]
  // }

  if (copyMoves.length < 3) {
    return copyMoves
  }

  const lastThreeMoves = copyMoves.slice(moves.length - 3)
  if (lastThreeMoves[0] === lastThreeMoves[1] && lastThreeMoves[1] === lastThreeMoves[2]) {
    const oppositeMove = getOppositeMove(lastThreeMoves[0])
    copyMoves = [...copyMoves.slice(0, copyMoves.length - 3), oppositeMove]
  }

  return copyMoves
}

const renderTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600)
  const minutes = Math.floor((timeInSeconds - hours * 3600) / 60)
  const seconds = timeInSeconds - hours * 3600 - minutes * 60

  let result = ''

  if (hours > 0) {
    result += hours.toString().padStart(2, '0') + ':'
  }

  result += minutes.toString().padStart(2, '0') + ':'
  result += seconds.toFixed(1).padStart(4, '0')

  return result
}

const movesCancel = (move1, move2) => {
  if (move2 === getOppositeMove(move1)) {
    return true
  }

  if (move1.length === move2.length) {
    return false
  }
  const moves = _.orderBy([move1, move2], [(move) => move.length], ['desc'])

  if (moves[0][0] === moves[1][0]) {
    return true
  }

  return false
}

const getCrossMoveOptions = (lastMove) => {
  const movePairs = [
    ['F', 'B'],
    ['R', 'L'],
    ['U', 'D'],
  ]
  const face = lastMove[0]

  // filter out pair containing last face
  const filteredMovePairs = _.flatten(movePairs.filter((pair) => !pair.includes(face)))

  return filteredMovePairs
}

const getRandomMove = (moves) => {
  let possibleStartingMoves = getCrossMoveOptions(moves[moves.length - 1])
  console.log('possibleStartingMoves', possibleStartingMoves)
  const modifiers = ['', "'"]

  const mostRecentMove = moves[moves.length - 1]
  // if the final move in `moves` has length > 1 and ends with a 2,
  // only allow moves that start with a different letter
  if (mostRecentMove.length > 1 && mostRecentMove[1] === '2') {
    possibleStartingMoves = possibleStartingMoves.filter((move) => move[0] !== mostRecentMove[0])
  }

  const randomMove =
    possibleStartingMoves[Math.floor(Math.random() * possibleStartingMoves.length)]
  const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)]
  const nextMove = randomMove + randomModifier

  if (movesCancel(moves[moves.length - 1], nextMove)) {
    return getRandomMove(moves)
  }
  return nextMove
}

const getRandomMoves = (numMoves = 18) => {
  const moves = ['F', 'R', 'U', 'L', 'B', 'D']
  const modifiers = ['', "'"]

  const randomMove = () => {
    return moves[Math.floor(Math.random() * moves.length)]
  }

  let result = [randomMove()]
  for (let i = 0; result.length < numMoves; i++) {
    const nextMove = getRandomMove(result)
    result.push(nextMove)
    // if (!movesCancel(result[result.length - 1], nextMove)) {
    // }
    result = simplifyMoves(result)
  }

  return result
}

const addRecord = (records, scramble, time) => {
  const scrambleKey = JSON.stringify(scramble)

  const newRecord = {
    time,
    created_at: Date.now(),
  }

  let existingRecords = []

  if (Object.keys(records).includes(scrambleKey)) {
    existingRecords = [...records[scrambleKey]]
  }

  // use immer to update the records object
  const newRecords = produce(records, (draft) => {
    draft[scrambleKey] = [...existingRecords, newRecord]
  })

  return newRecords
}

const removeRecordByCreatedAt = (records, scramble, created_at) => {
  const scrambleKey = JSON.stringify(scramble)

  if (!Object.keys(records).includes(scrambleKey)) {
    return records
  }

  const newRecords = produce(records, (draft) => {
    draft[scrambleKey] = records[scrambleKey].filter((record) => record.created_at !== created_at)
  })

  return newRecords
}

// Get all times from records, as an array
const getAllTimes = (records) => {
  const allTimes = []
  Object.keys(records).forEach((scrambleKey) => {
    records[scrambleKey].forEach((record) => {
      allTimes.push({ time: record.time, created_at: record.created_at })
    })
  })
  return allTimes
}

const getMedian = (numbers) => {
  const sortedNumbers = _.sortBy(numbers)
  if (sortedNumbers.length === 0) {
    return null
  }
  if (sortedNumbers.length % 2 === 0) {
    const middleAvg =
      (sortedNumbers[sortedNumbers.length / 2] + sortedNumbers[sortedNumbers.length / 2 - 1]) / 2
    return middleAvg
  } else {
    const middleIndex = Math.floor(sortedNumbers.length / 2)
    return sortedNumbers[middleIndex]
  }
}

// get mean, median, and mode of an array of numbers
const getStats = (numbers) => {
  const mean = _.mean(numbers)
  const median = getMedian(numbers)
  return { mean, median }
}

function RecordList({ records, setRecords, setScramble, currentScramble }) {
  const [open, setOpen] = useState(false)

  return (
    <ul className="list-group">
      {Object.keys(records).map((scrambleKey, i) => {
        const isCurrentScramble = JSON.stringify(currentScramble) === scrambleKey
        const scrambleArray = JSON.parse(scrambleKey)
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
                  Best: {bestRecord ? renderTime(bestRecord.time) : 'No Records'}
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
                      {renderTime(record.time)}
                      <span className="badge bg-primary rounded-pill">
                        {new Date(record.created_at).toLocaleDateString()}
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

function DisplayCube({ showCube, handleClose }) {
  return (
    <Modal dialogClassName="modal-lg" show={showCube} onHide={handleClose}>
      <ShowCube />
    </Modal>
  )
}

function DisplayStats({ records, handleClose, show }) {
  const allTimes = getAllTimes(records)
  const { mean, median } = getStats(allTimes.map((record) => record.time))
  const totalTimeSpent = _.sum(allTimes.map((record) => record.time))

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
            <li className="fs-4 list-group-item">
              <div className="row">
                <div className="fw-bold col-3">Mean: </div>
                <div className="col-4"> {renderTime(mean)}</div>
              </div>
            </li>
            <li className="fs-4 list-group-item">
              <div className="row">
                <div className="fw-bold col-3">Median: </div>
                <div className="col-4"> {renderTime(median)}</div>
              </div>
            </li>
            <li className="fs-4 list-group-item">
              <div className="row">
                <div className="fw-bold col-3">Total Time: </div>
                <div className="col-4"> {renderTime(totalTimeSpent)}</div>
              </div>
            </li>
            <li className="fs-4 list-group-item">
              <div className="row">
                <div className="fw-bold col-3">Total Solves</div>
                <div className="col-4"> {allTimes.length}</div>
              </div>
            </li>
          </ul>
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

function App() {
  const [scramble, setScramble] = useState([])
  const [isActive, setIsActive] = useState(false)

  const [showStats, setShowStats] = useState(false)
  const [showCube, setShowCube] = useState(false)

  const [records, setRecords] = useLocalStorage('records', {})

  const [currentTimeSaved, setCurrentTimeSaved] = useState(false)

  return (
    <div
      style={{
        minHeight: '100vh',
      }}
      className="bg-light m-0"
    >
      <div className="container bg-white p-3">
        <h1 className="text-center">Rubik's Timer</h1>
        <button className="btn btn-primary" onClick={() => setShowCube(!showCube)}>
          Show Cube
        </button>
        <DisplayCube showCube={showCube} handleClose={() => setShowCube(false)} />
        <p className="text-center">
          To perform a scramble, hold the solved cube with the yellow side facing up and the blue
          side facing you (the F side)
        </p>
        <div>
          <p
            style={{
              backgroundColor: '#0d6efd',
            }}
            className="text-center my-4 fs-2 text-white move-display"
          >
            {scramble.map((move, index) => (
              <span className="p-2" key={index}>
                {move}{' '}
              </span>
            ))}
          </p>
        </div>

        <div className="text-center my-4">
          <button
            className="btn btn-primary"
            onClick={() => {
              const moves = getRandomMoves()
              setScramble(moves)
            }}
          >
            Generate New Scramble
          </button>
        </div>

        <Timer
          isActive={isActive}
          onStart={() => {
            setCurrentTimeSaved(false)
          }}
          onSave={(elapsedTime) => {
            if (scramble.length === 0 || elapsedTime === 0) {
              return
            }
            if (currentTimeSaved) {
              return
            }
            const newRecords = addRecord(records, scramble, elapsedTime)
            setRecords(newRecords)
            setCurrentTimeSaved(true)
          }}
        />

        {!isActive && (
          <>
            <DisplayStats
              records={records}
              handleClose={() => setShowStats(false)}
              show={showStats}
            />

            <h2 className="my-4 text-center">Existing Records</h2>
            <RecordList
              records={records}
              setRecords={setRecords}
              setScramble={setScramble}
              currentScramble={scramble}
            />
            <div className="text-center my-4">
              <Button variant="primary" onClick={() => setShowStats(true)}>
                Show Stats
              </Button>
              <button
                className="btn btn-danger ms-3"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all records?')) {
                    setRecords({})
                  }
                }}
              >
                Clear Records
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
