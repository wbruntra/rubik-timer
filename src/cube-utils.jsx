import _ from 'lodash'

export const generateCube = () => {
  const cube = {
    R: [
      ['R', 'R', 'R'],
      ['R', 'R', 'R'],
      ['R', 'R', 'R'],
    ],
    L: [
      ['O', 'O', 'O'],
      ['O', 'O', 'O'],
      ['O', 'O', 'O'],
    ],
    D: [
      ['W', 'W', 'W'],
      ['W', 'W', 'W'],
      ['W', 'W', 'W'],
    ],
    U: [
      ['Y', 'Y', 'Y'],
      ['Y', 'Y', 'Y'],
      ['Y', 'Y', 'Y'],
    ],
    B: [
      ['G', 'G', 'G'],
      ['G', 'G', 'G'],
      ['G', 'G', 'G'],
    ],
    F: [
      ['B', 'B', 'B'],
      ['B', 'B', 'B'],
      ['B', 'B', 'B'],
    ],
  }
  return cube
}

const getRotatedFace = (face, direction = 'clockwise') => {
  if (direction === 'clockwise') {
    return [
      [face[2][0], face[1][0], face[0][0]],
      [face[2][1], face[1][1], face[0][1]],
      [face[2][2], face[1][2], face[0][2]],
    ]
  } else {
    return [
      [face[0][2], face[1][2], face[2][2]],
      [face[0][1], face[1][1], face[2][1]],
      [face[0][0], face[1][0], face[2][0]],
    ]
  }
}

const replaceRow = (face, rowIndex, newRow) => {
  const result = []
  for (let i = 0; i < 3; i++) {
    if (i === rowIndex) {
      result.push(newRow)
    } else {
      result.push(face[i])
    }
  }
  return result
}

const replaceColumn = (face, columnIndex, newColumn) => {
  const newFace = []
  for (let i = 0; i < 3; i++) {
    const oldRow = face[i]
    const newRow = oldRow.map((square, index) => {
      // if the column index is the same as the column to replace
      // use the value from `newColumn`
      if (index === columnIndex) {
        return newColumn[i]
      } else {
        return square
      }
    })
    newFace.push(newRow)
  }
  return newFace
}

const verifyCubeColorIntegrity = (cube) => {
  const faceColors = Object.values(cube).map((face) => {
    return face.map((row) => {
      return row.map((color) => {
        return color
      })
    })
  })
  const flattened = _.flattenDeep(faceColors)
  const result = _.countBy(flattened)
  // console.log('result', result)
  return Object.keys(result).every((color) => {
    return result[color] === 9
  })
}

const getColumn = (face, columnIndex, { reverse = false } = {}) => {
  let column = []
  face.forEach((row) => {
    column.push(row[columnIndex])
  })
  if (reverse) {
    return _.reverse(column)
  }
  return [...column]
}

const performBasicMove = (move, cube) => {
  const cubeCopy = _.cloneDeep(cube)
  if (move === 'R') {
    cubeCopy.F = replaceColumn(cube.F, 2, getColumn(cube.D, 2))
    cubeCopy.D = replaceColumn(cube.D, 2, getColumn(cube.B, 0, { reverse: true }))
    cubeCopy.B = replaceColumn(cube.B, 0, getColumn(cube.U, 2, { reverse: true }))
    cubeCopy.U = replaceColumn(cube.U, 2, getColumn(cube.F, 2))
    cubeCopy.R = getRotatedFace(cube.R, 'clockwise')
  }
  if (move === 'L') {
    cubeCopy.F = replaceColumn(cube.F, 0, getColumn(cube.U, 0))
    cubeCopy.D = replaceColumn(cube.D, 0, getColumn(cube.F, 0))
    cubeCopy.U = replaceColumn(cube.U, 0, getColumn(cube.B, 2, { reverse: true }))
    cubeCopy.B = replaceColumn(cube.B, 2, getColumn(cube.D, 0, { reverse: true }))
    cubeCopy.L = getRotatedFace(cube.L, 'clockwise')
  }
  if (move === 'U') {
    cubeCopy.U = getRotatedFace(cube.U, 'clockwise')
    cubeCopy.F = replaceRow(cube.F, 0, cube.R[0])
    cubeCopy.L = replaceRow(cube.L, 0, cube.F[0])
    cubeCopy.B = replaceRow(cube.B, 0, cube.L[0])
    cubeCopy.R = replaceRow(cube.R, 0, cube.B[0])
  }
  if (move === 'D') {
    cubeCopy.D = getRotatedFace(cube.D, 'clockwise')
    cubeCopy.F = replaceRow(cube.F, 2, cube.L[2])
    cubeCopy.L = replaceRow(cube.L, 2, cube.B[2])
    cubeCopy.B = replaceRow(cube.B, 2, cube.R[2])
    cubeCopy.R = replaceRow(cube.R, 2, cube.F[2])
  }
  if (move === 'F') {
    cubeCopy.F = getRotatedFace(cube.F, 'clockwise')
    cubeCopy.U = replaceRow(cube.U, 2, getColumn(cube.L, 2, { reverse: true }))
    cubeCopy.L = replaceColumn(cube.L, 2, [...cube.D[0]])
    cubeCopy.D = replaceRow(cube.D, 0, getColumn(cube.R, 0, { reverse: true }))
    cubeCopy.R = replaceColumn(cube.R, 0, [...cube.U[2]])
  }
  if (move === 'B') {
    cubeCopy.B = getRotatedFace(cube.B, 'clockwise')
    cubeCopy.U = replaceRow(cube.U, 0, getColumn(cube.R, 2))
    cubeCopy.R = replaceColumn(cube.R, 2, [...cube.D[2]].reverse())
    cubeCopy.D = replaceRow(cube.D, 2, getColumn(cube.L, 0))
    cubeCopy.L = replaceColumn(cube.L, 0, [...cube.U[0]].reverse())
  }
  if (move === 'M') {
    cubeCopy.F = replaceColumn(cube.F, 1, getColumn(cube.U, 1))
    cubeCopy.D = replaceColumn(cube.D, 1, getColumn(cube.F, 1))
    cubeCopy.B = replaceColumn(cube.B, 1, getColumn(cube.D, 1, { reverse: true }))
    cubeCopy.U = replaceColumn(cube.U, 1, getColumn(cube.B, 1, { reverse: true }))
  }
  if (move === 'x') {
    // Entire cube rotates in direction of 'R' move
    cubeCopy.R = getRotatedFace(cube.R, 'clockwise')
    cubeCopy.L = getRotatedFace(cube.L, 'counterclockwise')
    cubeCopy.F = cube.D
    cubeCopy.D = cube.B
    cubeCopy.B = cube.U
    cubeCopy.U = cube.F
  }

  return cubeCopy
}

const performPrimeMove = (move, cube) => {
  const basicMove = move[0]
  let result = _.cloneDeep(cube)
  for (let i = 0; i < 3; i++) {
    result = performBasicMove(basicMove, result)
  }
  return result
}

const performDoubleMove = (move, cube) => {
  const basicMove = move[0]
  let result = _.cloneDeep(cube)
  for (let i = 0; i < 2; i++) {
    result = performBasicMove(basicMove, result)
  }
  return result
}

export const performMove = (move, cube) => {
  const basicMove = move[0]

  if (move.length === 1) return performBasicMove(move[0], cube)

  if (move[1] === "'") return performPrimeMove(move[0], cube)

  if (move[1] === '2') return performDoubleMove(move[0], cube)
}

// const tests = () => {
//   const moves = ['R', 'L', 'U', 'D', 'F', 'B', 'M']

//   for (const move of moves) {
//     const cube = generateCube()
//     console.log(move)
//     const newCube = performBasicMove(move, cube)
//     // console.log('newCube', newCube)

//     const verified = verifyCubeColorIntegrity(newCube)
//     console.log('verified', verified)
//   }
// }

// if (require.main === module) {
//   tests()
// }
