import React from 'react'
import { UALContext } from 'ual-reactjs-renderer'
import './UserInfo.scss'

import UserDropdown from './UserDropdown'
import downArrow from 'assets/images/down-arrow.svg'
import upArrow from 'assets/images/up-arrow.svg'
import { onKeyUpEnter } from 'utils/keyPress'
import { getUserInfo } from 'utils/chain'

class UserInfo extends React.Component {
  _isMounted = false

  state = {
    showDropdown: false
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      showDropdown: !prevState.showDropdown,
    }))
  }

  static contextType = UALContext

  renderLogout = () => (
    <React.Fragment>
      <div
        className='user-info-dropdown-btn'
        tabIndex={0}
        role='button'
        onClick={this.toggleDropdown}
        onKeyUp={event => onKeyUpEnter(event, this.toggleDropdown)}
      >
        <img src={this.state.showDropdown ? upArrow : downArrow} alt='dropdown' />
      </div>
      { this.state.showDropdown && this.renderDropdown() }
    </React.Fragment>
  )

  renderDropdown = () => {
    const { logout } = this.context
    const { userInfo } = this.props

    return (
      <div className='user-info-dropdown-content'>
        <UserDropdown logout={logout} userInfo={userInfo} />
      </div>
    )
  }

  render() {
    const { logout, isAutoLogin } = this.context
    const { userInfo } = this.props

    const shouldDisplayLogout = logout
    return (
      <div className={`user-info-container ${shouldDisplayLogout ? '' : 'user-info-hide-dropdown'}`}>
        <span className='user-info-prefix'> Signed in as </span>
        <div className='user-info-name'>{userInfo.accountName}</div>
        <div className='user-info-name'>{userInfo.eosBalance}</div>
        { shouldDisplayLogout && this.renderLogout() }
      </div>
    )
  }
}

export default UserInfo
