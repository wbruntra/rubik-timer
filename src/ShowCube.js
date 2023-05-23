import React, { useState, useEffect } from 'react'
import _ from 'lodash'

const ShowFace = ({ face }) => {
  console.log('face', face)
  return (
    <div className="face col-4 my-3">
      {face.map((row, i) => {
        return (
          <div className="d-flex flex-row" key={i}>
            {row.map((color, j) => {
              console.log(color)
              return (
                <div className="square" key={`color-${j}`} style={{ backgroundColor: color }}>
                  {color}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function ShowCube() {
  const face = [
    ['R', 'R', 'W'],
    ['G', 'C', 'W'],
    ['G', 'B', 'B'],
  ]

  const cube = {
    F: [
      ['R', 'R', 'R'],
      ['R', 'R', 'R'],
      ['R', 'R', 'R'],
    ],
    B: [
      ['O', 'O', 'O'],
      ['O', 'O', 'O'],
      ['O', 'O', 'O'],
    ],
    U: [
      ['W', 'W', 'W'],
      ['W', 'W', 'W'],
      ['W', 'W', 'W'],
    ],
    D: [
      ['Y', 'Y', 'Y'],
      ['Y', 'Y', 'Y'],
      ['Y', 'Y', 'Y'],
    ],
    L: [
      ['G', 'G', 'G'],
      ['G', 'G', 'G'],
      ['G', 'G', 'G'],
    ],
    R: [
      ['B', 'B', 'B'],
      ['B', 'B', 'B'],
      ['B', 'B', 'B'],
    ],
  }

  const performMove = (move, cube) => {
    const cubeCopy = _.cloneDeep(cube)
    if (move === 'R') {
      cubeCopy.F = [
        [cube.F[0][0], cube.F[0][1], cube.D[0][2]],
        [cube.F[1][0], cube.F[1][1], cube.D[1][2]],
        [cube.F[2][0], cube.F[2][1], cube.D[2][2]],
      ]
      cubeCopy.D = [
        [cube.D[0][0], cube.D[0][1], cube.B[2][0]],
        [cube.D[1][0], cube.D[1][1], cube.B[1][0]],
        [cube.D[2][0], cube.D[2][1], cube.B[0][0]],
      ]
      cubeCopy.B = [
        [cube.U[2][2], cube.B[0][1], cube.B[0][2]],
        [cube.U[1][2], cube.B[1][1], cube.B[1][2]],
        [cube.U[0][2], cube.B[2][1], cube.B[2][2]],
      ]
      cubeCopy.U = [
        [cube.U[0][0], cube.U[0][1], cube.F[0][2]],
        [cube.U[1][0], cube.U[1][1], cube.F[1][2]],
        [cube.U[2][0], cube.U[2][1], cube.F[2][2]],
      ]
      cubeCopy.R = [
        [cube.R[2][0], cube.R[1][0], cube.R[0][0]],
        [cube.R[2][1], cube.R[1][1], cube.R[0][1]],
        [cube.R[2][2], cube.R[1][2], cube.R[0][2]],
      ]
    }
  }

  return (
    <div className="text-center row">
        {Object.values(cube).map((face, i) => {
          return <ShowFace face={face} key={i} />
        })}
    </div>
  )
}

export default ShowCube
