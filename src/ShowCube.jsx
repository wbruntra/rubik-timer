import { useState, useEffect } from 'react'
import { generateCube, performMove } from './cube-utils'
import { getOppositeMove } from './utils'
import Modal from 'react-bootstrap/Modal'
import ShowFace from './RenderFace'

const performMoveSequence = (moves) => {
  let cube = generateCube()
  moves.forEach((move) => {
    cube = performMove(move, cube)
  })
  return cube
}

function ShowCubeModal({ show, handleClose, scramble, cube, setCube }) {
  const [moveIndex, setMoveIndex] = useState(0)

  const basicMoves = ['L', 'F', 'R', 'B', 'U', 'D']

  useEffect(() => {
    let newCube = generateCube()

    // Since performMove is synchronous, moves will run in order
    scramble.forEach((move) => {
      newCube = performMove(move, newCube)
    })
    setMoveIndex(scramble.length)
    setCube(newCube)
  }, [scramble, setCube])

  useEffect(() => {
    // listen for keyboard forward and back arrows
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setMoveIndex((prevMoveIndex) => {
          if (prevMoveIndex > 0) {
            setCube(performMove(getOppositeMove(scramble[prevMoveIndex - 1]), cube))
            return prevMoveIndex - 1
          }
          return prevMoveIndex
        })
      } else if (e.key === 'ArrowRight') {
        setMoveIndex((prevMoveIndex) => {
          if (prevMoveIndex < scramble.length) {
            setCube(performMove(scramble[prevMoveIndex], cube))
            return prevMoveIndex + 1
          }
          return prevMoveIndex
        })
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [setCube, cube, scramble])

  return (
    <Modal size="xl" show={show} onHide={handleClose}>
      <Modal.Header className="bg-gray-600" closeButton>
        <Modal.Title className="text-white">Cube Appearance</Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-gray-600 text-black">
        <div className="container">
          <div>
            <p className="text-center my-4 fs-2 text-white move-display bg-primary">
              {scramble.map((move, index) => (
                <span
                  style={{
                    cursor: 'pointer',
                  }}
                  className={`selectable ${moveIndex - 1 === index ? 'fw-bold' : ''} p-2`}
                  onClick={() => {
                    const moveSequence = scramble.slice(0, index + 1)
                    setCube(performMoveSequence(moveSequence))
                    setMoveIndex(index + 1)
                  }}
                  key={index}
                >
                  {move}{' '}
                </span>
              ))}
            </p>
          </div>

          <div className="row">
            <div className="col-3">.</div>

            {['U'].map((faceSymbol, i) => {
              const face = cube[faceSymbol]
              return (
                <div className="col-3" key={i}>
                  <ShowFace face={face} />
                </div>
              )
            })}
          </div>
          <div className="row">
            {['L', 'F', 'R', 'B'].map((faceSymbol, i) => {
              const face = cube[faceSymbol]
              return (
                <div className="col-3" key={i}>
                  <ShowFace face={face} />
                </div>
              )
            })}
          </div>
          <div className="text-center row">
            <div className="col-3">.</div>

            {['D'].map((faceSymbol, i) => {
              const face = cube[faceSymbol]
              return (
                <div className="col-3" key={i}>
                  <ShowFace face={face} />
                </div>
              )
            })}
          </div>
          <hr />
          <div className="row mt-2">
            <div className="col-2 mt-3">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setCube(generateCube())
                  setMoveIndex(0)
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ShowCubeModal
