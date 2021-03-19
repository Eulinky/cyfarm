import React from 'react'
import { func, shape, string, number } from 'prop-types'
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
        displayError: func.isRequired
    }

    state = {
        donation: '5.0000 EOS',
        loading: false,
        donated: false
    };

    async componentDidMount() {
        this._isMounted = true
        const { activeUser } = this.context
        if (activeUser) {
            const accountName = await activeUser.getAccountName()
            await this.setUserInfo(accountName)
        }
    }

    async setUserInfo(accountName) {
        // get user info from chain
          const userInfo = await getUserInfo(accountName)
    
          if (this._isMounted) {
            this.setState({ userInfo })
          }
    }
    
    onDonate = async () => {
        const { login, displayError, project } = this.props
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
                this.setUserInfo(accountName);
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
        const { userInfo } = this.state
        const { project } = this.props

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
        const { userInfo } = this.state
        const { project } = this.props

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
                </div>
            </div>
        )
    }
}

export default withUAL(DonationTile)
