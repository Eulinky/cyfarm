import React from 'react'
import { func, shape, instanceOf } from 'prop-types'
import { withUAL } from 'ual-reactjs-renderer'
import 'App.scss'

import NotificationBar from 'components/notification/NotificationBar'
import LandingPage from 'components/landing/LandingPage'
import ProjectPage from 'components/donation/ProjectPage'
import Header from 'components/landing/Header'

import { getUserInfo } from 'utils/chain'

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
    error: null,
    userInfo: { accountName: '', eosBalance: '', bondTokens: [] },
    projects: []
  }

  async componentDidUpdate(prevProps) {
    const { ual: { error, activeUser } } = this.props
    const { ual: { error: prevError, activeUser: prevActiveUser } } = prevProps

    if (activeUser && !prevActiveUser) {
      const accountName = await activeUser.getAccountName()

      // get user info from chain
      await this.setUserInfo(accountName)
    }

    if (error && (prevError ? error.message !== prevError.message : true)) {
      console.error('UAL Error', JSON.parse(JSON.stringify(error)))
    }
  }

  async setProjects() {
    const resp = await fetch('/api/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
  
    const projects = await resp.json()
    this.setState({ projects })
  }

  async projectChanged(project) {

    const resp = await fetch('/api/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
  
    const projects = await resp.json()
    //this.setState({ projects })

    return projects.find(p => p.id == project.id)
  }

  async componentDidMount() {

    await this.setProjects()

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

  setUserInfo = async (accountName) => {
    // get user info from chain
    const userInfo = await getUserInfo(accountName)

    this.setState({ userInfo })
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
    const { projects, showProject, displayProject, showNotificationBar, error, userInfo } = this.state

    return (
      <div className='app-container'>
        { showNotificationBar && <NotificationBar hideNotificationBar={hideNotificationBar} error={error} /> }
        <Header routeToLanding={routeToLanding} login={login} userInfo={userInfo} />
        { showProject ?
          (
            <ProjectPage
              routeToLanding={routeToLanding}
              routeToProject={routeToProject}
              projectChanged={this.projectChanged}
              login={login}
              displayError={this.displayError}
              displayProject={displayProject}
              userInfo={userInfo}
              setUserInfo={this.setUserInfo}
            />
          )
          : <LandingPage
              projects={projects}
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
