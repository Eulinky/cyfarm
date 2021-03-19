import React from 'react'
import { bool, func, object } from 'prop-types'

import { UALContext } from 'ual-reactjs-renderer'

import './UserDropdown.scss'
import logoutIcon from 'assets/images/leave.svg'

import { onKeyUpEnter } from 'utils/keyPress'

class UserDropdown extends React.Component {
  static propTypes = {
    logout: func.isRequired,
    userInfo: object
  }

  static contextType = UALContext

  render() {
    const { logout, userInfo } = this.props
    return (
      <div
        className='user-dropdown-container'
        tabIndex={0}
        role='menuitem'
      >
        <ul>
          { userInfo.bondTokens.map(bt => (
            <li className='user-dropdown-item' key={bt.id}>
              {bt.text}
            </li>
          ))}

          <li
            className='user-dropdown-item menu-item-with-icon'
            aria-label='Logout'
            onClick={logout}
            onKeyUp={event => onKeyUpEnter(event, logout)}
          >
            <img src={logoutIcon} className='menu-item-icon-left' alt='' />
            Logout
          </li>
        </ul>
      </div>
    )
  }
}

export default UserDropdown
