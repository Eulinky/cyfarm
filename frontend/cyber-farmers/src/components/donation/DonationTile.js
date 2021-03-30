import React from 'react'
import { func, shape, string, object } from 'prop-types'
import { withUAL, UALContext } from 'ual-reactjs-renderer'

import { generateDonateTransaction, transactionConfig } from 'utils/transaction'
import Redemption from './Redemption'

class DonationTile  extends React.Component {

    static contextType = UALContext

    static propTypes = {
        project: shape({
          id: string.isRequired,
          partner: string.isRequired,
          requiredAmount: string.isRequired
        }),
        login: func.isRequired,
        displayError: func.isRequired,
        userInfo: object.isRequired,
        setUserInfo: func.isRequired,
        projectChanged: func.isRequired
    }

    state = {
        donation: '5.0000 EOS',
        loading: false,
        donated: false
    };

    onDonate = async () => {
        const { login, displayError, project, setUserInfo } = this.props
        const { activeUser } = this.context
        const { donation } = this.state

        if (activeUser) {
            this.setState({ loading: true })
            try {
                const accountName = await activeUser.getAccountName()
                
                const transaction = generateDonateTransaction(
                    accountName,
                    project.id,
                    donation)
                

                await activeUser.signTransaction(transaction, transactionConfig)

                this.setState({ donated: true })
                setUserInfo(activeUser)
            } 
            catch (err) {
                displayError(err)
            }

            this.setState({ loading: false })
        } else {
            login()
        }
    }

    handleChange = (event) => {
        this.setState({donation: event.target.value})
    }

    renderDonationText() {
        const { project, userInfo } = this.props

        let text = "You haven't donated to this project, yet!" // <a href="#">View transaction</a>

        if(userInfo) 
        {
            let donations = userInfo.donations.find(d => d.category == project.id)
            if (donations) {
                text = "You donated " + donations.amount + " to this project."
            }
        }

        return (
            <p className="donate__p">{ text }</p>
        )
    }

    render() {

        const { donation } = this.state
        const { login, displayError, project, userInfo, setUserInfo, projectChanged } = this.props

        return (
            <div className="row__1200">
                <div className="donate">

                    <h2>{project.supportSlogan}</h2>

                    {this.renderDonationText()}

                    <div className="donate__wrap">

                        <select className="donate__dropdown" value={donation} onChange={this.handleChange}>
                            <option value="5.0000 EOS">5 EOS</option>
                            <option value="10.000 EOS">10 EOS</option>
                            <option value="20.0000 EOS">20 EOS</option>
                            <option value="50.0000 EOS">50 EOS</option>
                            <option value="100.0000 EOS">100 EOS</option>
                            <option value="200.0000 EOS">200 EOS</option>
                            <option value="500.0000 EOS">500 EOS</option>
                        </select>

                        <button className="donate__button" onClick={this.onDonate}>
                        Donate 
                        </button>

                    </div>
                    
                    <Redemption login={login} displayError={displayError} project={project} userInfo={userInfo} setUserInfo={setUserInfo} projectChanged={projectChanged}  />
                </div>
            </div>
        )
    }
}

export default withUAL(DonationTile)
