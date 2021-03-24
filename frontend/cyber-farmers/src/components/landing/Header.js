import React from 'react'
import { func, bool, shape, oneOfType, instanceOf, object } from 'prop-types'
import { withUAL } from 'ual-reactjs-renderer'
import { AnchorUser } from 'ual-anchor'
import { ScatterUser } from 'ual-scatter'
import UserInfo from 'components/navigation/UserInfo'
import LoginButton from 'components/navigation/LoginButton'


class Header extends React.Component {

    static propTypes = {
        ual: shape({
            activeUser: oneOfType([
                instanceOf(AnchorUser),
                instanceOf(ScatterUser)
            ]),
            }),
        routeToLanding: func.isRequired,
        login: func.isRequired,
        userInfo: object
    }

    componentDidMount() {
        $(".js-header-trigger").on('click', function() {
            $('.menu-panel').toggleClass('js-animate'); 
            $('.base-bg-menu').toggleClass('js-base-bg-menu--expanded');
            $('.hamburger-menu').toggleClass('js-animate');
            $('.header__blob').toggleClass('menu-is-active');    
        })
    }

    render() {
        const { ual: { activeUser }, routeToLanding, login, userInfo, setUserInfo } = this.props

       return (
            <header className="header">
            <div className="header__inner row__1300">
              
                <picture>
                    <img src="img/logo/bee.svg" style={{ maxHeight: "80px" }} alt="Cyberfarmer logo" onClick={routeToLanding}  />
                </picture>
        
                <div>
                { activeUser
                  ? <div className='user-info'><UserInfo userInfo={userInfo} setUserInfo={setUserInfo} /></div>
                  : <div className='login'><LoginButton login={login} /></div>
                }
                </div>
        
                <div className="js-header-trigger">        
                  <div className="header__blob">
                    <div className="menu-panel">
                        <div className="menu-panel-close-wrapper">
                            <div className="menu-panel__close">
                            <img src="img/menu-nav/close-menu--white.svg" />
                            </div>
                        </div>
                        <div className="menu-panel__inner">
                            <div className="menu-panel__card">
                                <ul>
                                <li className="menu-panel-card__item eksell">
                                    <a href="about-us.html" className="js-photo-item animateanchor">
                                    <img data-src="img/menu-nav/aboutus.jpg" className="lazyload" />
                                    About us</a>
                                </li>
                                <li className="menu-panel-card__item eksell">
                                    <a href="#projects" className="js-photo-item animateanchor">
                                    <img data-src="img/menu-nav/projects.jpg" className="lazyload" />
                                    Projects</a>
                                </li>
                                <li className="menu-panel-card__item eksell">
                                    <a href="#contact-me" className="js-photo-item animateanchor">
                                    <img data-src="img/menu-nav/contact.jpg" className="lazyload" />
                                    Contact</a>
                                </li>
                                </ul>
                            </div>
                        </div>
                    </div>
        
                    <div className="superblobber-menu hide-on-mobile">
                        <div className="superblobber-menu__inner">
        
                            <div className="base-bg-menu">
                                <br />
                            </div>
        
                            <div className="menu-wrapper">
                                <div className="styled-menu__trigger" style={{ marginTop: "-30px", marginLeft: "-25px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="51.639" viewBox="0 0 64 51.639"><g transform="translate(-400.5 -503.606)"><path d="M74.178-2606.361H12V-2619H75v12.639Zm-62.178-19V-2638H75v12.638Zm0-19V-2657H75v12.638H12Z" transform="translate(389 3161.106)" fill="#181c27" stroke="rgba(0,0,0,0)" strokeMiterlimit="10" strokeWidth="1"/></g></svg>
                                </div>
                            </div>
        
                        </div>
                 
                        <svg fill="white" filter="url(#goo)" height="300" id="organic-blob" width="300" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <filter id="goo">
                                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
                                    <feColorMatrix in="blur" mode="matrix" result="goo" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"></feColorMatrix>
                                    <feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>
                                </filter>
                            </defs>
                            <g>
                                <circle cx="150" cy="145" r="100">
                                <animateTransform attributeName="transform" attributeType="xml" dur="1s" from="0 145 150" repeatCount="indefinite" to="360 145 150" type="rotate"></animateTransform>
                                </circle>
                                <circle cx="150" cy="155" r="100">
                                <animateTransform attributeName="transform" attributeType="xml" dur="2s" from="360 155 150" repeatCount="indefinite" to="0 155 150" type="rotate"></animateTransform>
                                </circle>
                                <circle cx="145" cy="150" r="100">
                                <animateTransform attributeName="transform" attributeType="xml" dur="3s" from="0 150 145" repeatCount="indefinite" to="360 150 145" type="rotate"></animateTransform>
                                </circle>
                                <circle cx="155" cy="150" r="100">
                                <animateTransform attributeName="transform" attributeType="xml" dur="2.5s" from="360 150 155" repeatCount="indefinite" to="0 150 155" type="rotate"></animateTransform>
                                </circle>
                            </g>
                        </svg>
                    </div>     
        
                  </div>
                </div> 
              
            </div>
          </header>
        )
    }
}

export default withUAL(Header)
