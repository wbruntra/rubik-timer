const getColor = (shortColor) => {
  switch (shortColor) {
    case 'R':
      return 'red'
    case 'O':
      return 'orange'
    case 'W':
      return 'white'
    case 'Y':
      return 'yellow'
    case 'G':
      return 'green'
    case 'B':
      return 'blue'
    default:
      return 'black'
  }
}

const ShowFace = ({ face }) => {
  return (
    <div className="face my-3 justify-content-center">
      {face.map((row, i) => {
        return (
          <div className="d-flex justify-content-center" key={i}>
            {row.map((color, j) => {
              return (
                <div className={`square square-${getColor(color)}`} key={`color-${j}`}>
                  {/* {color} */}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default ShowFace
