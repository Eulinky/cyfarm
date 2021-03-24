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

  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.registerAccount = this.registerAccount.bind(this);

    const { userInfo } = this.props

    this.state = { accountExists: userInfo.accountExists }
  }

  renderBondTokenInfo() {
    const { userInfo } = this.props

    return (
      <div>
        <div style={{fontWeight: 'bold'}}>Bond Tokens</div>
        { userInfo.bondTokens.length == 0 ? <div>No Bond Tokens</div> : 
          userInfo.bondTokens.map(bt => (
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
    const goodNames = Object.getOwnPropertyNames(goodsByName)

    return (
      <div>
        <div style={{fontWeight: 'bold'}}>Vouchers</div>
        { goodNames.length == 0 ? <div>No Vouchers</div> : 
          goodNames.map(goodName => (
          <div key={goodName}>
            {goodsByName[goodName].length} x {goodName}
          </div>
        ))}
      </div>
    )
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      manualKey: true
    });
  }

  async registerAccount(key) {
    const { userInfo, setUserInfo } = this.props
    const { activeUser } = this.context

    const payload = {
      accountName: userInfo.accountName,
      ownerKey: key || this.state.ownerKey,
      activeKey: key || this.state.activeKey
    }

    const resp = await fetch('/api/account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  
    const result = await resp.json()
    
    if (!result.status || result.status !== 'ok') {
      let message = result.message ? result.message : 'Create Account failed';
      throw new Error(message)
    }

    this.setState({ accountExists: true })
    setUserInfo(activeUser)
  }

  renderKeyCreate(keys) {
    return keys.map(key => (
      <div key={key}>
        <div className="publicKey">{key}</div>
        <button onClick={() => this.registerAccount(key)}>Create Account</button>
      </div>
    ))
  }

  renderManualCreation() {
    return (
      <div>
        <input name="ownerKey" placeholder="Public Owner Key" type="text" onChange={this.handleInputChange} />
        <input name="activeKey" placeholder="Public Active Key" type="text" onChange={this.handleInputChange} />
        <button onClick={this.registerAccount}>Create Account</button>
      </div>
    )
  }

  renderRegistration() {
    const { userInfo } = this.props
    const { accountExists } = this.state

    return accountExists ? <div></div> :
            
            <div className="registrationForm">
              <div style={{fontWeight: 'bold'}}>Registration</div>
              { userInfo.keys ? 
                  this.renderKeyCreate(userInfo.keys) : 
                  this.renderManualCreation() }
            </div>    
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
        { this.renderRegistration() }
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
