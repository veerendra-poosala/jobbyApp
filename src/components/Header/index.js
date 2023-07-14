import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {RiLogoutBoxRLine} from 'react-icons/ri'

import './index.css'

const Header = props => {
  const logout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <div className="nav-content-small-device">
        <div className="logo-image-container">
          <Link to="/" style={{textDecoration: 'none'}}>
            <img
              className="logo-image-small-device"
              alt="website logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            />
          </Link>
        </div>
        <ul className="menu-options-list-small">
          <Link to="/">
            <li className="menu-option">
              <AiFillHome color="#fff" size="20" />
            </li>
          </Link>
          <Link to="/jobs">
            <li className="menu-option">
              <BsBriefcaseFill color="#fff" size="20" />
            </li>
          </Link>
          <li className="menu-option">
            <button
              className="logout-button-small button"
              type="button"
              onClick={logout}
            >
              <RiLogoutBoxRLine color="#fff" size="20" />
            </button>
          </li>
        </ul>
      </div>
      <div className="nav-content-large-device">
        <div className="logo-image-container">
          <Link to="/" style={{textDecoration: 'none'}}>
            <img
              className="logo-image-small-device"
              alt="website logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            />
          </Link>
        </div>
        <ul className="menu-options-list-small">
          <Link to="/" style={{textDecoration: 'none'}}>
            <li className="menu-option">
              <p className="menu-option-name">Home</p>
            </li>
          </Link>
          <Link to="/jobs" style={{textDecoration: 'none'}}>
            <li className="menu-option">
              <p className="menu-option-name">Jobs</p>
            </li>
          </Link>
          <li className="menu-option">
            <button
              className="logout-button button"
              type="button"
              onClick={logout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
