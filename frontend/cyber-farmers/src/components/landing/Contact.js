import React from 'react'
import { func, bool } from 'prop-types'

const Contact = () => (
    <div className="contact-wrapper" id="contact-me">
        <div className="contact-wrapper__inner row__1200">
            <p data-aos="fade-up" data-aos-duration="2000">Are you part of a non profit organization, a farmer or a donor?</p>
            <h2 className="eksell" data-aos="fade-up" data-aos-duration="1000">Talk to us!</h2>
            <ul className="contact-wrapper__ul">
                <li className="tilt-img" data-aos="fade-up" data-aos-duration="1000">
                    <h3>E-mail</h3>
                    <p className="honeypot-phone-number">
                        <a href="mailto:info@cyberfarmer.org">info@cyberfarmer.org</a>
                    </p>
                </li>

                <li className="tilt-img" data-aos="fade-up" data-aos-duration="2000">
                    <a href="#" onClick={ () => { smartsupp('chat:open'); return false;}}>
                        <h3>Chat</h3>
                        <p>Open chat</p>
                    </a>
                </li>
            </ul>
        </div>
    </div>
)
  
Contact.propTypes = {
    
}

export default Contact
