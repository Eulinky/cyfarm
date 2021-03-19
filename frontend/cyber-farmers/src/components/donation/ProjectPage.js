import React from 'react'
import { func, bool } from 'prop-types'
import Header from 'components/landing/Header'
import HeroBanner from 'components/landing/HeroBanner'
import DonationTile from './DonationTile'

const ProjectPage = ({ routeToLanding, login, displayError, displayProject }) => (
    <div id="scroll-to-top">
        
        <HeroBanner headerText1={displayProject.title} headerText2="" showHeroButtons={false} />

        <div className="intro-large">
            <div className="intro-large__inner row__1200">
                <div className="intro-large__title">

                <br />
                    <br />
                    <a href="/#projects">Back to projects</a>

                    <h2>{displayProject.details}</h2>
                </div>
            </div>
        </div>

        <DonationTile login={login} displayError={displayError} project={displayProject} />

        <br />
        <div className="text--title">
            <div className="text--title__inner row__1200">
                <div className="text--title__title">
                <h3>
                    WHY DONATE?
                </h3>
                </div>
                <div className="text--title__content">
                <p>{displayProject.impact}</p>
                </div>
            </div>
        </div>
    </div>
)
  
ProjectPage.propTypes = {
    login: func.isRequired,
    displayError: func.isRequired,
    routeToLanding: func.isRequired
}

export default ProjectPage
