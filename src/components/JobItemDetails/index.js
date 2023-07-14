import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdRoom} from 'react-icons/md'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      apiStatus: apiStatusConstants.initial,
      isLoading: false,
      jobDetails: {},
      similarJobs: [],
      showFetchError: false,
    }
  }

  componentDidMount() {
    this.fetchJobItemDetails()
  }

  fetchJobItemDetails = async () => {
    try {
      this.setState({isLoading: true, apiStatus: apiStatusConstants.inProgress})
      const jwtToken = Cookies.get('jwt_token')
      const {match} = this.props
      // console.log(match)
      const {id} = match.params
      const url = `https://apis.ccbp.in/jobs/${id}`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.status === 200) {
        // console.log('status success', data)
        const modifiedJobDetails = {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employementType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          companyDescripton: data.job_details.life_at_company.description,
          lifeAtCompanyImageUrl: data.job_details.life_at_company.image_url,
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          skills: data.job_details.skills,
          title: data.job_details.title,
        }
        const modifiedSimilarJobs = data?.similar_jobs?.map(job => ({
          similarCompanyLogoUrl: job.company_logo_url,
          similarCompanyEmployementType: job.employment_type,
          similarCompanyJobDescription: job.job_description,
          similarCompanyId: job.id,
          similarCompanyLocation: job.location,
          similarCompanyRating: job.rating,
          similarCompanyTitle: job.title,
        }))
        // console.log('job details', modifiedJobDetails, modifiedSimilarJobs)
        this.setState({
          jobDetails: {...modifiedJobDetails},
          similarJobs: [...modifiedSimilarJobs],
          isLoading: false,
          apiStatus: apiStatusConstants.success,
          showFetchError: false,
        })
      } else if (response.status === 400) {
        console.log('status failure')
        this.setState({
          apiStatus: apiStatusConstants.failure,
          showFetchError: true,
          isLoading: false,
        })
      }
    } catch (e) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
        showFetchError: true,
        isLoading: false,
      })
      console.log('fetch error profile details', e)
    } finally {
      this.setState({isLoading: false})
    }
  }

  renderJobItemDetails = () => {
    const {jobDetails} = this.state

    const skillsList = jobDetails?.skills?.map(skill => ({
      name: skill.name,
      imageUrl: skill.image_url,
    }))

    // console.log(skillsList)
    return (
      <div className="jobs-item-container job-item-details-container">
        <div className="job-item-header-section">
          <div className="job-item-logo-section-container">
            <img
              className="job-item-company-log"
              alt="job details company logo"
              src={jobDetails.companyLogoUrl}
            />
            <div className="job-item-title-container">
              <h1 className="job-item-title">{jobDetails.title}</h1>
              <div className="job-item-rating-container">
                <AiFillStar className="rating-star" />
                <p className="job-item-rating">{jobDetails.rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-location-type-package-container">
            <div className="job-item-location-type-container">
              <div className="jot-item-loacation-container">
                <MdRoom size="25px" />
                <p className="location-text">{jobDetails.location}</p>
              </div>
              <div className="jot-item-loacation-container">
                <BsBriefcaseFill size="20px" />
                <p className="location-text">{jobDetails.employementType}</p>
              </div>
            </div>
            <div className="jot-item-loacation-container">
              <p className="location-text">{jobDetails.packagePerAnnum}</p>
            </div>
          </div>
        </div>

        <hr className="horizonatal-rule job-item-sec-rule" />
        <div className="job-item-description-container">
          <div className="job-item-description-heading-container">
            <h1 className="job-item-description-heading">Description</h1>
            <a
              href={jobDetails.companyWebsiteUrl}
              target="_blank"
              className="visit-link"
              rel="noreferrer"
            >
              <span className="visit-link-text">Visit</span>
            </a>
          </div>
          <p className="job-item-description-text">
            {jobDetails.jobDescription}
          </p>
        </div>
        <div className="job-item-description-container">
          <h1 className="job-item-description-heading">Skills</h1>
          <ul className="skills-list-container">
            {skillsList?.map(skill => (
              <li className="skill-item-container" key={skill.name}>
                <img
                  className="skill-image"
                  alt={skill.name}
                  src={skill.imageUrl}
                />
                <p className="skill-name">{skill.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="life-at-company-container">
          <div className="life-at-company-left-section-container">
            <h1 className="job-item-description-heading">Life At Company</h1>
            <p className="life-at-company-description">
              {jobDetails.companyDescripton}
            </p>
          </div>
          <div className="life-at-company-image-container">
            <img
              className="life-at-company-image"
              alt="life at company"
              src={jobDetails.lifeAtCompanyImageUrl}
            />
          </div>
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state

    return (
      <div className="similar-jobs-bg-container">
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs?.map(job => (
            <Link
              to={`/jobs/${job.similarCompanyId}`}
              className="route-link-item"
              key={job.similarCompanyId}
            >
              <li className="jobs-item-container">
                <div className="job-item-header-section">
                  <div className="job-item-logo-section-container">
                    <img
                      className="job-item-company-log"
                      alt="similar job company logo"
                      src={job.similarCompanyLogoUrl}
                    />
                    <div className="job-item-title-container">
                      <h1 className="job-item-title">
                        {job.similarCompanyTitle}
                      </h1>
                      <div className="job-item-rating-container">
                        <AiFillStar className="rating-star" />
                        <p className="job-item-rating">
                          {job.similarCompanyRating}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="job-item-description-container">
                  <h1 className="job-item-description-heading">Description</h1>
                  <p className="job-item-description-text">
                    {job.similarCompanyJobDescription}
                  </p>
                </div>
                <div className="job-item-location-type-package-container">
                  <div className="job-item-location-type-container">
                    <div className="jot-item-loacation-container">
                      <MdRoom size="25px" />
                      <p className="location-text">
                        {job.similarCompanyLocation}
                      </p>
                    </div>
                    <div className="jot-item-loacation-container">
                      <BsBriefcaseFill size="20px" />
                      <p className="location-text">
                        {job.similarCompanyEmployementType}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => {
    const {isLoading} = this.state
    return (
      isLoading && (
        <div
          className="loader-container profile-error-container"
          data-testid="loader"
        >
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    )
  }

  renderSuccessView = () => (
    <>
      <Header />
      <div className="job-details-route-bg-container">
        {this.renderJobItemDetails()}
        {this.renderSimilarJobs()}
      </div>
    </>
  )

  renderFailurView = () => {
    const {showFetchError} = this.state
    return (
      showFetchError === true && (
        <>
          <Header />
          <div className="no-jobs-list-container">
            <img
              className="no-jobs-image"
              alt="failure view"
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            />
            <h1 className="no-jobs-found-heading">
              Oops! Something Went Wrong
            </h1>
            <p className="no-jobs-found-description">
              We cannot seem to find the page you are looking for.
            </p>
            <button
              type="button"
              className="logout-button button"
              onClick={this.fetchJobItemDetails}
            >
              Retry
            </button>
          </div>
        </>
      )
    )
  }

  renderProgressView = () => {
    const {isLoading} = this.state
    return (
      <>
        <Header />
        {isLoading && this.renderLoader()}
      </>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailurView()
      case apiStatusConstants.inProgress:
        return this.renderProgressView()
      default:
        return null
    }
  }
}

export default JobItemDetails
