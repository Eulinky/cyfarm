import React from 'react'
import { func, array } from 'prop-types'
import HeroBanner from './HeroBanner'
import AboutUs from './AboutUs'
import ProjectList from './ProjectList'
import Contact from './Contact'

const LandingPage = ({ login, displayError, routeToProject, projects }) => {
  
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
    routeToProject: func.isRequired,
    projects: array.isRequired
}

export default LandingPage
