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
        
            </div>
          </header>
        )
    }
}

export default withUAL(Header)
