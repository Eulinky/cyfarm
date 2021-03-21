import React from 'react'
import { func, bool, object } from 'prop-types'
import HeroBanner from 'components/landing/HeroBanner'
import DonationTile from './DonationTile'
import CompensationTile from 'components/compensation/CompensationTile'

class ProjectPage extends React.Component {
    
    static propTypes = {
        login: func.isRequired,
        displayError: func.isRequired,
        routeToLanding: func.isRequired,
        userInfo: object,
        setUserInfo: func.isRequired
    }

    render() {
        const { routeToLanding, login, displayError, displayProject, userInfo, setUserInfo } = this.props

        return (
            <div id="scroll-to-top">
                
                <HeroBanner headerText1={displayProject.title} headerText2="" showHeroButtons={false} />

                <div className="intro-large">
                    <div className="intro-large__inner row__1200">
                        <div className="intro-large__title">

                        <br />
                            <br />
                            <a href="#" onClick={routeToLanding}>Back to projects</a>

                            <h2>{displayProject.details}</h2>
                        </div>
                    </div>
                </div>

                <DonationTile login={login} displayError={displayError} project={displayProject} userInfo={userInfo} setUserInfo={setUserInfo} />
                <br />
                <CompensationTile login={login} displayError={displayError} project={displayProject} userInfo={userInfo} />

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
            </div>)
    }

}

export default ProjectPage
