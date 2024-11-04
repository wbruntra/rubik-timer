import { getStats, renderTime, getAllTimes } from './utils'

export default function DisplayRecentStats({ records }) {
  const allTimesOrdered = getAllTimes(records)

  return (
    <div className="container">
      <div className="my-4">
        <ul className="list-group-flush">
          {[
            {
              n: 1,
              description: 'Most Recent',
            },
            {
              n: 5,
              description: 'Avg, Last 5',
            },
            {
              n: 10,
              description: 'Avg, Last 10',
            },
          ].map(({ n, description }) => {
            const times = allTimesOrdered.slice(0, n)
            const { mean, median } = getStats(times.map((record) => record.time))
            return (
              <li className="fs-4 list-group-item my-3" key={n}>
                <div className="row justify-content-center">
                  <div className="fw-bold col-6 col-md-4">{description}: </div>
                  <div className="col-6 col-md-4"> {renderTime(mean)}</div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

