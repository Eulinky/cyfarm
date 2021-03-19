import React from 'react'

class AboutUs  extends React.Component {

  

  render() {
    return (
      <React.Fragment>
        <div className="intro" id="aboutus">
          <div className="intro__inner row__1200">

            <div className="intro__content" data-aos="fade-up" >
              <h2 className="eksell">How does it work?</h2>
              <p>
                We work with local Organizations to vet farmers in need and connected them with donors. Donors will receive a BOND token that will eventually be bought back by the farmer by spreading the good to other people in their community.

                <a href="about-us.html">Learn more</a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="home-skills">   
          <div className="home-skills__inner row__1200">
            <ul className="home-skills__ul tilt-img">
              <li className="home-skills__li tilt-img" data-aos="fade-right" data-aos-duration="800">
                <a href="#projects" className="animateanchor">
                  <h2 className="eksell">1 - You donate <span className="arrow-pointer"></span></h2>
                  <p>Your donate to a project and receive a BOND token. The BOND represent a social obligation for the farmer to pay back.</p>
                </a>
              </li>
            
              <li className="home-skills__li tilt-img" data-aos="fade-left" data-aos-duration="800">
                <a href="#projects" className="animateanchor">
                  <h2 className="eksell">2 - The Farmer invest <span className="arrow-pointer"></span></h2>
                  <p> Your donations will be used by farmers to invest in new equipment that will increase their production.</p>
                </a>
              </li>
              
              <li className="home-skills__li tilt-img" data-aos="fade-right" data-aos-duration="800">
                <a href="#projects" className="animateanchor">
                  <h2 className="eksell">3 - Harvest time <span className="arrow-pointer"></span></h2>
                  <p>The Farmer can either send a rewards to donors, or transfer the bond by helping someone in their community (Ex: by sharing part of the harvest).</p>
                </a>
              </li>
              
              <li className="home-skills__li tilt-img" data-aos="fade-left" data-aos-duration="800">
                <a href="#projects" className="animateanchor">
                  <h2 className="eksell">Everybody wins! <span className="arrow-pointer"></span></h2>
                  <p>Everyone wins! The donor receive a rewards and its initial bonds is transfered across the comunity many times while everyone help each other.</p>
                </a>
              </li>
            </ul>  
          </div>
        </div>
      </React.Fragment>  
    )
    }
  }

export default AboutUs
