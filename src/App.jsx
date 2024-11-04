import { useState } from 'react'
import useLocalStorage from './useLocalStorage'
// import 'bootstrap/dist/css/bootstrap.min.css'
import Timer from './Timer'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ShowCubeModal from './ShowCube'
import { getRandomMoves, addRecord, joinClassNames } from './utils'
import RecordList from './RecordList'
import DisplayStats from './DisplayStats'
import DisplayRecentStats from './DisplayRecentStats'
import './App.scss'
import RenderFace from './RenderFace'
import { generateCube } from './cube-utils'

const RecordsModal = ({ handleClose, show, ...props }) => {
  return (
    <Modal size={'lg'} show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Records</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RecordList {...props} />
      </Modal.Body>
    </Modal>
  )
}

function ModeChooser({ setMode, show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Choose Mode</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-primary m-2"
            onClick={() => {
              setMode('normal')
              handleClose()
            }}
          >
            Normal
          </button>
          <button
            className="btn btn-primary m-2"
            onClick={() => {
              setMode('f2l')
              handleClose()
            }}
          >
            F2L
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

function App() {
  const [scramble, setScramble] = useState([])
  const [timerIsActive, setTimerIsActive] = useState(false)

  const [showStats, setShowStats] = useState(false)
  const [showCube, setShowCube] = useState(false)
  const [showModeChooser, setShowModeChooser] = useState(false)
  const [showRecords, setShowRecords] = useState(false)

  const [mode, setMode] = useState('normal')

  const [records, setRecords] = useLocalStorage('records', {})

  const [currentTimeSaved, setCurrentTimeSaved] = useState(false)

  const [cube, setCube] = useState(generateCube())

  const numMoves = mode === 'normal' ? 18 : 10

  const bottomButtons = [
    // {
    //   text: mode === 'normal' ? 'Normal' : 'F2L',
    //   onClick: () => setShowModeChooser(true),
    // },
    {
      text: 'Show Cube',
      onClick: () => setShowCube(!showCube),
    },
    {
      text: 'Show Stats',
      onClick: () => setShowStats(true),
    },
    {
      text: 'Past Scrambles',
      onClick: () => setShowRecords(true),
    },
    {
      text: 'Clear Records',
      onClick: () => {
        if (window.confirm('Are you sure you want to clear all records?')) {
          setRecords({})
        }
      },
      variant: 'danger',
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
      }}
      className="bg-gray-800 m-0"
    >
      <div className="container bg-gray-800 p-3">
        <h1 className="text-center">Rubik's Timer</h1>
        <ShowCubeModal
          cube={cube}
          setCube={setCube}
          scramble={scramble}
          show={showCube}
          handleClose={() => setShowCube(false)}
        />
        <p className="text-center">
          To perform a scramble, hold the solved cube with the yellow side facing up and the blue
          side facing you (the F side)
        </p>
        <div>
          <p className="text-center my-4 fs-3 text-white move-display bg-primary">
            {scramble.map((move, index) => (
              <span className="p-2" key={index}>
                {move}{' '}
              </span>
            ))}
          </p>
        </div>

        <div className="text-center my-4"></div>
        <div className="row align-items-center">
          <div className="col-12 col-md-3 text-center align-content-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (timerIsActive) return
                const moves = getRandomMoves(numMoves)
                setScramble(moves)
              }}
              disabled={timerIsActive}
            >
              Create New Scramble
            </button>
          </div>
          <div className="col-12 col-md-6">
            <Timer
              isActive={timerIsActive}
              setIsActive={setTimerIsActive}
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
                const newRecords = addRecord(records, scramble, elapsedTime, { mode })
                setRecords(newRecords)
                setCurrentTimeSaved(true)
              }}
              timeSaved={currentTimeSaved}
            />
          </div>

          <div className="col-12 col-md-3">
            <div className="text-center row justify-content-center my-4">
              <RenderFace face={cube.F} />
            </div>
          </div>
        </div>

        <DisplayRecentStats records={records} />
        {/* <div className="row justify-content-center"></div> */}

        {!timerIsActive && (
          <>
            <DisplayStats
              records={records}
              handleClose={() => setShowStats(false)}
              show={showStats}
            />

            <div className="text-center my-4 row justify-content-around">
              {bottomButtons.map(({ text, onClick, variant }, i) => {
                return (
                  <button
                    key={`btn-bottom-${i}`}
                    className={joinClassNames([
                      'btn btn-primary col-6 col-md-2 m-2',
                      variant ? `btn-${variant}` : null,
                    ])}
                    onClick={onClick}
                  >
                    {text}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
      <ModeChooser
        show={showModeChooser}
        handleClose={() => setShowModeChooser(false)}
        setMode={setMode}
      />
      <RecordsModal
        show={showRecords}
        handleClose={() => setShowRecords(false)}
        records={records}
        setRecords={setRecords}
        setScramble={setScramble}
        currentScramble={scramble}
      />
    </div>
  )
}

export default App
