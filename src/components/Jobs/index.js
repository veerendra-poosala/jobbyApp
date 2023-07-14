import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdRoom} from 'react-icons/md'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      apiStatus: apiStatusConstants.initial,
      isLoading: false,
      profileDetails: '',
      showProfileFetchError: false,
      employementType: [],
      minimumPackage: '',
      searchInput: '',
      jobsList: [],
    }
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onKeyDown = event => {
    if (event.key === 'Enter') {
      this.getJobsList()
    }
  }

  updateEmpTypeFilter = event => {
    const {employementType} = this.state
    const checkEmpTypeStatus = employementType.includes(event.target.id)

    if (event.target.checked === true && checkEmpTypeStatus === false) {
      this.setState(
        prev => ({
          employementType: [...prev.employementType, event.target.id],
        }),
        () => {
          this.getJobsList()
        },
      )
    }
    if (event.target.checked === false && checkEmpTypeStatus === true) {
      const updatedEmpType = employementType.filter(
        emp => emp !== event.target.id,
      )
      this.setState({employementType: [...updatedEmpType]}, () => {
        this.getJobsList()
      })
    }
  }

  updateMiniumSalaryFilter = event => {
    this.setState({minimumPackage: event.target.id}, () => {
      this.getJobsList()
    })
  }

  applySearchFilter = () => {
    this.getJobsList()
  }

  getProfileDetails = async () => {
    try {
      this.setState({isLoading: true})
      const jwtToken = Cookies.get('jwt_token')
      const url = 'https://apis.ccbp.in/profile'
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.status === 200) {
        const profileDetails = {
          name: data?.profile_details?.name,
          profileImageUrl: data?.profile_details?.profile_image_url,
          shortBio: data?.profile_details?.short_bio,
        }
        this.setState({
          showProfileFetchError: false,
          isLoading: false,
          profileDetails,
        })
      } else if (response.status === 400) {
        this.setState({showProfileFetchError: true, isLoading: false})
      }
    } catch (e) {
      this.setState({showProfileFetchError: true, isLoading: false})
      console.log('fetch error profile details', e)
    } finally {
      this.setState({isLoading: false})
    }
  }

  getJobsList = async () => {
    try {
      this.setState({isLoading: true, apiStatus: apiStatusConstants.inProgress})
      const jwtToken = Cookies.get('jwt_token')
      const {minimumPackage, employementType, searchInput} = this.state
      const employementTypeQuery = employementType.join(',')
      const url = `https://apis.ccbp.in/jobs?employment_type=${employementTypeQuery}&minimum_package=${minimumPackage}&search=${searchInput}`
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
        const modifiedJobsList = data?.jobs.map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employementType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          packagePerAnnum: eachJob.package_per_annum,
          rating: eachJob.rating,
          title: eachJob.title,
        }))
        this.setState({
          jobsList: [...modifiedJobsList],
          isLoading: false,
          apiStatus: apiStatusConstants.success,
        })
      } else if (response.status === 400) {
        // console.log('status failure')
        this.setState({apiStatus: apiStatusConstants.failure, isLoading: false})
      }
    } catch (e) {
      this.setState({apiStatus: apiStatusConstants.failure, isLoading: false})
      console.log('fetch error profile details', e)
    } finally {
      this.setState({isLoading: false})
    }
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

  renderProfileDetails = () => {
    const {profileDetails, showProfileFetchError, isLoading} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    if (showProfileFetchError === true) {
      return isLoading === true ? (
        this.renderLoader()
      ) : (
        <div className="profile-error-container">
          <button
            type="button"
            className="logout-button button"
            onClick={this.getProfileDetails}
          >
            Retry
          </button>
        </div>
      )
    }
    return isLoading === true ? (
      this.renderLoader()
    ) : (
      <div className="profile-container">
        <img className="profile-image" alt="" src={profileImageUrl} />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderSearchBar = () => {
    const {searchInput} = this.state

    return (
      <div className="search-input-container">
        <input
          type="search"
          value={searchInput}
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onKeyDown}
          className="search-input"
          placeholder="Search"
        />
        <button
          type="button"
          className="search-button"
          onClick={this.applySearchFilter}
        >
          <BsSearch color="#dfdfdf" size={38} />
        </button>
      </div>
    )
  }

  renderEmployementTypeFilter = () => {
    const {employementType} = this.state
    // console.log('employement type', employementType)
    return (
      <div className="filter-bg-container">
        <h1 className="filter-heading">Type Of Employement</h1>

        <ul className="filter-options-list">
          {employmentTypesList.map(eachEmpType => (
            <li key={eachEmpType.employmentTypeId} className="filter-option">
              <input
                type="checkbox"
                className="emp-filter-input"
                id={eachEmpType.employmentTypeId}
                onClick={this.updateEmpTypeFilter}
              />
              <label
                className="emp-filter-label"
                htmlFor={eachEmpType.employmentTypeId}
              >
                {eachEmpType.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderSalaryRangesFilter = () => {
    const {minimumPackage} = this.state
    // console.log('min package', minimumPackage)
    return (
      <div className="filter-bg-container">
        <h1 className="filter-heading">Salary Of Range</h1>

        <ul className="filter-options-list">
          {salaryRangesList?.map(eachSalRange => (
            <li key={eachSalRange?.salaryRangeId} className="filter-option">
              <input
                type="radio"
                name="salary-range"
                className="emp-filter-input"
                id={eachSalRange?.salaryRangeId}
                checked={eachSalRange.salaryRangeId === minimumPackage}
                onChange={this.updateMiniumSalaryFilter}
              />
              <label
                className="emp-filter-label"
                htmlFor={eachSalRange?.salaryRangeId}
              >
                {eachSalRange.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    // console.log(jobsList)
    return (
      <div className="jobs-list-bg-container">
        <ul className="jobs-list-items-container">
          {jobsList.map(job => (
            <Link
              to={`/jobs/${job.id}`}
              style={{textDecoration: 'none', width: '100%'}}
            >
              <li className="jobs-item-container">
                <div className="job-item-header-section">
                  <div className="job-item-logo-section-container">
                    <img
                      className="job-item-company-log"
                      alt="company logo"
                      src={job.companyLogoUrl}
                    />
                    <div className="job-item-title-container">
                      <h1 className="job-item-title">{job.title}</h1>
                      <div className="job-item-rating-container">
                        <AiFillStar className="rating-star" />
                        <p className="job-item-rating">{job.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="job-item-location-type-package-container">
                    <div className="job-item-location-type-container">
                      <div className="jot-item-loacation-container">
                        <MdRoom size="25px" />
                        <p className="location-text">{job.location}</p>
                      </div>
                      <div className="jot-item-loacation-container">
                        <BsBriefcaseFill size="20px" />
                        <p className="location-text">{job.employementType}</p>
                      </div>
                    </div>
                    <div className="jot-item-loacation-container">
                      <p className="location-text">{job.packagePerAnnum}</p>
                    </div>
                  </div>
                </div>

                <hr className="horizonatal-rule job-item-sec-rule" />
                <div className="job-item-description-container">
                  <h1 className="job-item-description-heading">Description</h1>
                  <p className="job-item-description-text">
                    {job.jobDescription}
                  </p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    // console.log(this.props)
    return (
      <div className="jobs-section-bg-container">
        <div className="side-nav-bar-section-container">
          <div className="show-search-input-small">
            {this.renderSearchBar()}
          </div>
          {this.renderProfileDetails()}

          <hr className="horizonatal-rule" />
          {this.renderEmployementTypeFilter()}
          <hr className="horizonatal-rule" />
          {this.renderSalaryRangesFilter()}
        </div>
        <div className="all-jobs-section">
          <div className="show-search-input-large">
            {this.renderSearchBar()}
          </div>
          {this.renderJobsList()}
        </div>
      </div>
    )
  }
}

export default Jobs
