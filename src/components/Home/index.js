import './index.css'

const Home = props => {
  const getFindJobs = () => {
    const {history} = props
    return history.push('/jobs')
  }

  return (
    <div className="jobby-app-home-bg-container">
      <div className="home-content-container">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential{' '}
        </p>
        <button
          className="button logout-button"
          type="button"
          onClick={getFindJobs}
        >
          Find Jobs
        </button>
      </div>
    </div>
  )
}

export default Home
