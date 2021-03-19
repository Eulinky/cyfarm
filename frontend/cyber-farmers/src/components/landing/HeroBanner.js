import React from 'react'
import { string, bool } from 'prop-types'

const HeroBanner = ({headerText1, headerText2, showHeroButtons}) => (
  <div className="hero-banner">
    <div className="hero-banner__inner">
      <div className="hero-banner__video-bg">
        <video autoPlay muted loop>
                <source src="img/banner/farm1_2.mp4" type="video/mp4" />
                <source src="img/banner/farm1.webm" type="video/webm" />
                <source src="img/banner/video/farm1.wmv" type="video/wmv" /> 
                  Your browser does not support the video tag.
        </video>
      </div>

      <div className="hero-banner__card">
          <h1 className="eksell">
            <span>{headerText1}</span> 
            <br />
            <span>{headerText2}</span>
          </h1>

           { showHeroButtons ? (
            <div>
              <a href="#aboutus" className="btn btn--ghost">Learn more</a>
              <a href="#projects" className="btn btn--primary">View projects</a>
            </div>
            ) : <div />
           }
      </div>  

    </div>

    <div className="hero-banner-footer">
      <div className="hero-banner-footer__arrow">
        <a href="#aboutus" className="animateanchor">
          <img src="img/banner/banner-scroller/mouse-scroll.gif" />
        </a>
        </div>
      <br />
    </div>

  </div>
)

HeroBanner.propTypes = {
  headerText1: string.isRequired,
  headerText2: string.isRequired,
  showHeroButtons: bool.isRequired
}

export default HeroBanner
