import React from 'react'
import { func, instanceOf } from 'prop-types'
import './NotificationBar.scss'

const NotificationBar = ({ hideNotificationBar, error }) => (
  error ? (
  <div className={`notification-bar-container ${error ? 'notification-error' : ''}`}>
    <div className='notification-bar-content'>
      { error
        ? (
          <div className='notification-error-text'>
            Error:
            {' '}
            { error.message ? error.message : error.reason }
          </div>
        )
        : (
          <React.Fragment>
              Message
          </React.Fragment>
        )
      }
      <div
        className='notification-bar-close'
        onClick={hideNotificationBar}
        role='button'
        tabIndex={0}
      >
        &times;
      </div>
    </div>
  </div>) : <div />
)

NotificationBar.propTypes = {
  hideNotificationBar: func.isRequired,
  error: instanceOf(Error),
}

NotificationBar.defaultProps = {
  error: null,
}

export default NotificationBar
