import React from 'react'
import { func } from 'prop-types'

const LoginButton = ({ login }) => (
  <span
    className='login-button-container'
    tabIndex={0}
    role='tab'
    onClick={login}
  >
    Login
  </span>
)

LoginButton.propTypes = {
  login: func.isRequired,
}

export default LoginButton
