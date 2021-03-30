import React from 'react'
import { func, shape, string, object, array } from 'prop-types'
import { withUAL, UALContext } from 'ual-reactjs-renderer'

import { redeemVoucher, transactionConfig } from 'utils/transaction'
import { getUserInfo } from 'utils/chain'
import { groupTokenByName } from 'utils/helpers'

class Redemption extends React.Component {

    static contextType = UALContext

    static propTypes = {
        project: shape({
            id: string.isRequired,
            redeemableCompTokens: array.isRequired,
            requiredAmount: string.isRequired
          }),
        login: func.isRequired,
        displayError: func.isRequired,
        userInfo: object.isRequired,
        setUserInfo: func.isRequired,
        projectChanged: func.isRequired
    }

    state = {
        tokensByName: {}
    }

    componentDidMount() {
        const { project } = this.props

        const tokensByName = groupTokenByName(project.redeemableCompTokens)
        this.setState({tokensByName})
    }

    onRedeem = async (token) => {

        const { login, displayError, project, setUserInfo, projectChanged } = this.props
        const { activeUser } = this.context

        if (activeUser) {
            this.setState({ loading: true })
            try {
                const accountName = await activeUser.getAccountName()
                
                const transaction = redeemVoucher(accountName, token.batch_id, token.amount)

                await activeUser.signTransaction(transaction, transactionConfig)

                setUserInfo(activeUser)
                projectChanged(project)
            } 
            catch (err) {
                displayError(err)
            }

            this.setState({ loading: false })
        } else {
            login()
        }
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

    renderVoucher() {
        const { project, userInfo } = this.props
        const { tokensByName } = this.state

        const userBondTokens = userInfo.bondTokens.find(t => t.id == project.id)
        
        return (<div className="donate__wrap">
                    {Object.getOwnPropertyNames(tokensByName).length == 0 ?
                        <p>The project does not offer any compensation at the moment.</p>
                        : Object.getOwnPropertyNames(tokensByName).map(tokenName => 
                            <div className="voucher" key={tokenName}>
                                <div className="voucher_count">{tokensByName[tokenName].length}</div>
                                <div className="voucher_title">{tokensByName[tokenName][0].voucher.title}</div>
                                <div className="voucher_details">{tokensByName[tokenName][0].voucher.details}</div>
                                <div className="voucher_price">{tokensByName[tokenName][0].amount}</div>
                                <button className="btn btn--primary" onClick={() => this.onRedeem(tokensByName[tokenName][0])} disabled={userBondTokens == null}>
                                    Redeem
                                </button>
                            </div>
                        )
                    }
                </div>
        )
    }

    renderRedemption() {
        const { project, userInfo } = this.props
        const userBondTokens = userInfo.bondTokens.find(t => t.id == project.id)

        // if project has comp tokens on offer and user owns bond tokens
        return (
            <div className="redemption_box">
                <h3>You can redeem your bond tokens for these offers:</h3>
                {this.renderBondText()}
                {this.renderVoucher()}
            </div>
        )
        
        
    }

    render() {

        return (
            <div className="row__1200">
                <div className="donate">
                    {this.renderRedemption() }
                </div>
            </div>
        )
    }
}

export default withUAL(Redemption)
