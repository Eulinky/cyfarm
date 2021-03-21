import React from 'react'
import { func, shape, string, object } from 'prop-types'
import { withUAL, UALContext } from 'ual-reactjs-renderer'

import { generateDonateTransaction, transactionConfig } from 'utils/transaction'
import { getUserInfo } from 'utils/chain'

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
        setUserInfo: func.isRequired
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
                
                console.log(transaction)

                await activeUser.signTransaction(transaction, transactionConfig)

                this.setState({ donated: true })
                setUserInfo(accountName);
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
            let bondTokens = userInfo.bondTokens.find(t => t.id == project.id)
            if (bondTokens) {
                text = "You donated " + bondTokens.amount.match(/(\d+)/)[0] + " EOS to this project."
            }
        }

        return (
            <p className="donate__p">{ text }</p>
        )
    }

    renderBondText() {
        const { project, userInfo } = this.props

        let text = "You don't own any CYFAR bonds from this project, yet!" // <a href="#">View transaction</a>

        if(userInfo) 
        {
            let bondTokens = userInfo.bondTokens.find(t => t.id == project.id)
            if (bondTokens) {
                text = "You own " + bondTokens.amount + " bonds from this project."
            }
        }

        return (
            <p className="donate__p">{ text }</p>
        )
    }

    renderRedemption() {
        const { project, userInfo } = this.props
        
        if(!project.redeemableCompTokens) {
            return (
                <div className="donate__wrap">
                    <p>The project does not offer any compensation at the moment.</p>
                </div>
            )
        }

        const userBondTokens = userInfo.bondTokens.find(t => t.id == project.id)

        // if project has comp tokens on offer and user owns bond tokens
        if(userBondTokens) {
            return (
                <div>
                    <h3>You can redeem your bond tokens for these offers:</h3>
                    {
                        project.redeemableCompTokens.map(t => 
                            <div>
                                <p>{t.dgood_ids.length} vouchers for {t.amount} each. Redeem!</p>
                            </div>
                        )
                    }
                </div>
            )
        }
        
    }

    render() {

        const { donation } = this.state

        return (
            <div className="row__1200">
                <div className="donate">

                    <h2>Support Zazib with her project:</h2>

                    {this.renderDonationText()}
                    {this.renderBondText()}

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
                    {this.renderRedemption() }
                </div>
            </div>
        )
    }
}

export default withUAL(DonationTile)
