import React from 'react'
import { func, shape, instanceOf } from 'prop-types'
import { withUAL } from 'ual-reactjs-renderer'
import 'App.scss'

import NotificationBar from 'components/notification/NotificationBar'
import LandingPage from 'components/landing/LandingPage'
import ProjectPage from 'components/donation/ProjectPage'
import Header from 'components/landing/Header'

class App extends React.Component {
  static propTypes = {
    ual: shape({
      error: instanceOf(Error),
      logout: func,
      showModal: func.isRequired,
      hideModal: func.isRequired,
    }),
  }

  static defaultProps = {
    ual: {
      error: null,
      logout: () => {},
    },
  }

  state = {
    showProject: false,
    showNotificationBar: true,
    error: null
  }

  componentDidUpdate(prevProps) {
    const { ual: { error } } = this.props
    const { ual: { error: prevError } } = prevProps
    if (error && (prevError ? error.message !== prevError.message : true)) {
      console.error('UAL Error', JSON.parse(JSON.stringify(error)))
    }
  }

  componentDidMount() {
    $(".tilt-img").tilt({
      maxTilt: 15,
      perspective: 1400,
      easing: "cubic-bezier(.03,.98,.52,.99)",
      speed: 1200,
      glare: true,
      maxGlare: 0.2,
      scale: 1.04
    });
  }

  displayProject = (display, project) => this.setState({ showProject: display, displayProject: project })

  displayNotificationBar = display => this.setState({ showNotificationBar: display })

  displayLoginModal = (display) => {
    const { ual: { showModal, hideModal } } = this.props
    if (display) {
      showModal()
    } else {
      hideModal()
    }
  }

  displayError = (error) => {
    if (error.source) {
      console.error('UAL Error', JSON.parse(JSON.stringify(error)))
    }
    this.setState({ error })
    this.displayNotificationBar(true)
  }

  clearError = () => {
    this.setState({ error: null })
    this.displayNotificationBar(false)
  }

  render() {
    const login = () => this.displayLoginModal(true)
    const routeToLanding = () => this.displayProject(false)
    const routeToProject = (project) => this.displayProject(true, project)
    const hideNotificationBar = () => this.clearError()
    const { showProject, displayProject, showNotificationBar, error } = this.state

    return (
      <div className='app-container'>
        { showNotificationBar && <NotificationBar hideNotificationBar={hideNotificationBar} error={error} /> }
        <Header routeToLanding={routeToLanding} login={login} />
        { showProject ?
          (
            <ProjectPage
              routeToLanding={routeToLanding}
              routeToProject={routeToProject}
              login={login}
              displayError={this.displayError}
              displayProject={displayProject}
            />
          )
          : <LandingPage
              routeToLanding={routeToLanding}
              routeToProject={routeToProject}
              login={login}
              displayError={this.displayError}
            />
        }         
      </div>
    )
  }
}

// Passes down the context via props to the wrapped component
export default withUAL(App)
