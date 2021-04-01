import React from 'react'
import { func, array, object } from 'prop-types'
import HeroBanner from './HeroBanner'
import AboutUs from './AboutUs'
import ProjectList from './ProjectList'
import Contact from './Contact'

const LandingPage = ({ login, displayError, routeToProject, projects, userInfo }) => {
  
  return (
    <div id="scroll-to-top">
      <HeroBanner headerText1="We Help Farmers" headerText2="and their Community" showHeroButtons={true} />
      <AboutUs />
      <ProjectList login={login} displayError={displayError} routeToProject={routeToProject} projects={projects} userInfo={userInfo} />
      <Contact />
    </div>
  )
} 
  
LandingPage.propTypes = {
    login: func.isRequired,
    displayError: func.isRequired,
    routeToLanding: func.isRequired,
    routeToProject: func.isRequired,
    projects: array.isRequired,
    userInfo: object.isRequired
}

export default LandingPage
