import React from 'react'
import { bool, func, object } from 'prop-types'

import { UALContext } from 'ual-reactjs-renderer'

import { groupTokenByName } from 'utils/helpers'

import './UserDropdown.scss'
import logoutIcon from 'assets/images/leave.svg'

class UserDropdown extends React.Component {
  static propTypes = {
    logout: func.isRequired,
    userInfo: object
  }

  static contextType = UALContext

  renderBondTokenInfo() {
    const { userInfo } = this.props

    return (
      <div>
        <div style={{fontWeight: 'bold'}}>Bond Tokens</div>
        { userInfo.bondTokens.map(bt => (
          <div key={bt.id}>
            {bt.text}
          </div>
        ))}
      </div>
    )
  }

  renderGoods() {
    const { userInfo } = this.props

    const goodsByName = groupTokenByName(userInfo.goods)

    return (
      <div>
        <div style={{fontWeight: 'bold'}}>Vouchers</div>
        { Object.getOwnPropertyNames(goodsByName).map(goodName => (
          <div key={goodName}>
            {goodsByName[goodName].length} x {goodName}
          </div>
        ))}
      </div>
    )
  }

  render() {
    const { logout, userInfo } = this.props
    return (
      <div
        className='user-dropdown-container'
        tabIndex={0}
        role='menuitem'
      >
        { this.renderBondTokenInfo() }
        { this.renderGoods() }
        <ul>
          <li
            className='user-dropdown-item menu-item-with-icon'
            aria-label='Logout'
            onClick={logout}
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
