import React from 'react'
import { func } from 'prop-types'
import HeroBanner from './HeroBanner'
import AboutUs from './AboutUs'
import ProjectList from './ProjectList'
import Contact from './Contact'

const LandingPage = ({ login, displayError, routeToProject }) => {

  let [projects, setProjects] = React.useState([])

  React.useEffect(async () => {
    
    const resp = await fetch('/api/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
  
    const result = await resp.json()
    setProjects(result)
  }, [setProjects])

  return (
    <div id="scroll-to-top">
      <HeroBanner headerText1="We Help Farmers" headerText2="and their Community" showHeroButtons={true} />
      <AboutUs />
      <ProjectList login={login} displayError={displayError} routeToProject={routeToProject} projects={projects} />
      <Contact />
    </div>
  )
} 
  
LandingPage.propTypes = {
    login: func.isRequired,
    displayError: func.isRequired,
    routeToLanding: func.isRequired,
    routeToProject: func.isRequired
}

export default LandingPage
