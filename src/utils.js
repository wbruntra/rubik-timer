import _ from 'lodash'
import { produce } from 'immer'

export const splitKeyString = (input) => {
  return input.match(/[A-Za-z][^A-Za-z]*/g) || []
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

// get mean and median of an array of numbers
export const getStats = (numbers) => {
  const mean = _.mean(numbers)
  const median = getMedian(numbers)
  return { mean, median }
}

export const recordsToLogs = (records) => {
  const logs = []
  for (const [scramble, times] of Object.entries(records)) {
    for (const time of times) {
      logs.push({
        ...time,
        mode: time.mode || 'normal',
        scramble: splitKeyString(scramble),
      })
    }
  }
  return logs
}

export const renderTime = (timeInSeconds) => {
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

// random move operations
export const getOppositeMove = (move) => {
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

const createMove = (basicMoves, modifiers, mostRecentMove) => {
  const validMoves = mostRecentMove
    ? basicMoves.filter((move) => move !== mostRecentMove[0])
    : basicMoves

  const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
  const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)]
  return randomMove + randomModifier
}

const getRandomMovev2 = (moves) => {
  const basicMoves = ['L', 'F', 'R', 'B', 'U', 'D']
  const modifiers = ['', '', '', "'", "'", "'", '2']

  if (moves.length === 0) {
    return createMove(basicMoves, modifiers)
  }

  const mostRecentMove = moves[moves.length - 1]

  let newMoveValid = false
  let newMove

  while (!newMoveValid) {
    newMove = createMove(basicMoves, modifiers, mostRecentMove)

    newMoveValid = newMove !== mostRecentMove && !movesCancel(mostRecentMove, newMove)
  }

  return newMove
}

const getRandomMove = (moves) => {
  const basicMoves = ['L', 'F', 'R', 'B', 'U', 'D']
  const modifiers = ['', '', '', "'", "'", "'", '2']

  if (moves.length === 0) {
    return createMove(basicMoves, modifiers)
  }

  const mostRecentMove = moves[moves.length - 1]
  let possibleStartingMoves = getCrossMoveOptions(mostRecentMove)

  // if the final move in `moves` has length > 1 and ends with a 2,
  // only allow moves that start with a different letter
  if (mostRecentMove.length > 1 && mostRecentMove[1] === '2') {
    possibleStartingMoves = possibleStartingMoves.filter((move) => move[0] !== mostRecentMove[0])
  }

  let newMoveValid = false
  let newMove

  while (!newMoveValid) {
    newMove = createMove(possibleStartingMoves, modifiers, mostRecentMove)
    newMoveValid = newMove !== mostRecentMove && !movesCancel(mostRecentMove, newMove)
  }

  return newMove
}

export const getRandomMoves = (numMoves = 18) => {
  // const basicMoves = ['F', 'R', 'U', 'L', 'B', 'D']

  // const randomMove = () => {
  //   return moves[Math.floor(Math.random() * moves.length)]
  // }

  let moves = []
  for (let i = 0; moves.length < numMoves; i++) {
    const nextMove = getRandomMove(moves)
    moves.push(nextMove)
    moves = simplifyMoves(moves)
  }

  return moves
}

export const addRecord = (records, scramble, time, { mode = 'normal' } = {}) => {
  const scrambleKey = scramble.join('')

  const newRecord = {
    time: Math.floor(time * 10),
    created_at: Date.now() / 1000,
    mode: mode !== 'normal' ? mode : undefined,
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

// Get all times from records, as an array
export const getAllTimes = (records) => {
  const allTimes = []
  Object.keys(records).forEach((scrambleKey) => {
    const keyArray = splitKeyString(scrambleKey)
    records[scrambleKey].forEach((record) => {
      allTimes.push({
        time: record.time / 10,
        created_at: record.created_at * 1000,
        scrambleKey: keyArray,
      })
    })
  })
  return _.orderBy(allTimes, 'created_at', 'desc')
}

/**
 * Joins an array of class names or any number of class name strings into a single string,
 *    with each class name separated by a space.
 *
 * @param {...(string|null|undefined|string[])} classNames - Either an array of class names or
 *    any number of class name strings, which can include null or undefined values.
 * @returns {string} - A string containing all the class names joined together with a space delimiter.
 */ export const joinClassNames = (...classNames) => {
  if (classNames.length === 1 && Array.isArray(classNames[0])) {
    classNames = classNames[0] // handle the case where a single array argument is passed
  }
  return classNames.filter((className) => !!className).join(' ')
}
