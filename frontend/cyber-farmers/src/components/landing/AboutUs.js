import React from 'react'

class AboutUs  extends React.Component {

  

  render() {
    return (
      <React.Fragment>
        <div className="intro" id="aboutus">
          <div className="intro__inner row__1200">

            <div className="intro__content" data-aos="fade-up" >
              <h2 className="eksell">Why is it cool?</h2>
              <p>
                Cyber Farmer is a fundraising platform where the community can support local businesses in emergency situations like the Covid crisis.
              </p>
              <p>
                Unlike existing donation platforms, we require a strong commitment from companies seeking help to honor a donation in the future, once the crisis has been overcome. In return, all donors receive symbolic bonds for their donations, entitling them to some kind of future compensation.
              </p>
              <p>
              We believe it's time to take the donation process to a new level. 

              CYFAR bond tokens create a more sustainable relationship between donors and donation receivers, building a vibrant foundation for local community engagement and the awareness of existential dynamics in today's society.
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
                  <p>Your donate to a project, the money goes straight to the farmer. You receive CYFAR bond tokens which act as a receipt or claim for future compensation.</p>
                </a>
              </li>
            
              <li className="home-skills__li tilt-img" data-aos="fade-left" data-aos-duration="800">
                <a href="#projects" className="animateanchor">
                  <h2 className="eksell">2 - The Farmer invests <span className="arrow-pointer"></span></h2>
                  <p> Your donation will be put to the best use by the farmer. Companies themselves know best where the money will help, which is why we don't make any rules here. </p>
                </a>
              </li>
              
              <li className="home-skills__li tilt-img" data-aos="fade-right" data-aos-duration="800">
                <a href="#projects" className="animateanchor">
                  <h2 className="eksell">3 - Harvest time <span className="arrow-pointer"></span></h2>
                  <p>Once the farmer's business is better, he or she can offer compensations on our market, which are exclusively redeemable by their supporters using the CYFAR bond tokens.</p>
                </a>
              </li>
              
              <li className="home-skills__li tilt-img" data-aos="fade-left" data-aos-duration="800">
                <a href="#projects" className="animateanchor">
                  <h2 className="eksell">Everybody wins! <span className="arrow-pointer"></span></h2>
                  <p>CYFAR tokens lead to more community engagement, helping people and businesses alike. CYFAR tokens can be transferred between people at will, allowing more in the future than just redeeming some goods. </p>
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
