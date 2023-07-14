import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMsg: '',
      showErrorMsg: false,
      username: '',
      password: '',
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSuccessfulSubmission = token => {
    Cookies.set('jwt_token', token, {expires: 30})
    const {history} = this.props
    return history.replace('/')
  }

  onSubmitForm = async event => {
    event.preventDefault()
    try {
      const {username, password} = this.state
      const loginData = {
        username: username.trim(),
        password: password.trim(),
      }

      const url = 'https://apis.ccbp.in/login'
      const options = {
        method: 'POST',
        body: JSON.stringify(loginData),
      }
      const response = await fetch(url, options)
      const data = await response.json()
      console.log('data', data)
      if (data.status_code === 400) {
        this.setState({errorMsg: data.error_msg, showErrorMsg: true})
      }
      if (data?.jwt_token !== undefined) {
        this.setState({showErrorMsg: false})
        this.onSuccessfulSubmission(data?.jwt_token)
      }
    } catch (e) {
      console.log(('fetch error': e))
    }
  }

  renderUsername = () => {
    const {username} = this.state

    return (
      <>
        <label htmlFor="usernameInput" className="form-field-name">
          USERNAME
        </label>
        <input
          type="text"
          id="usernameInput"
          onChange={this.onChangeUsername}
          className="form-field-input"
          placeholder="Username"
          value={username}
        />
      </>
    )
  }

  renderPassword = () => {
    const {password} = this.state

    return (
      <>
        <label htmlFor="passwordInput" className="form-field-name">
          PASSWORD
        </label>
        <input
          type="password"
          id="passwordInput"
          onChange={this.onChangePassword}
          className="form-field-input password-input"
          placeholder="Password"
          value={password}
        />
      </>
    )
  }

  render() {
    const {errorMsg, showErrorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    // console.log('jwt token', jwtToken)
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="jobby-app-bg-container">
        <form className="login-form-container" onSubmit={this.onSubmitForm}>
          <div className="logo-image-container">
            <img
              className="jobby-app-image"
              alt="website logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            />
          </div>
          <div className="form-field-container">{this.renderUsername()}</div>
          <div className="form-field-container">{this.renderPassword()}</div>

          <div className="form-field-container">
            <button type="submit" className="submit-button">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
          </div>
        </form>
      </div>
    )
  }
}

export default Login
