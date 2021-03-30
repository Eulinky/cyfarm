import React from 'react'
import { func, shape, string, object } from 'prop-types'
import { withUAL, UALContext } from 'ual-reactjs-renderer'

import { generateListRedeemTransaction, transactionConfig } from 'utils/transaction'
import { amountOf } from 'utils/chain'
import { groupTokenByName } from 'utils/helpers'

class CompensationTile  extends React.Component {

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
        compPrice: '5 CYFAR',
        loading: false,
        tokensByName: {}
    }

    componentDidMount() {
        const { project } = this.props

        const tokensByName = groupTokenByName(project.existingCompTokens)
        this.setState({tokensByName})
    }

    handlePriceChange = (event) => {
        this.setState({compPrice: event.target.value})
    }

    onCreateCompensation = async () => {
        const { tokensByName } = this.state
        const { project, projectChanged, userInfo } = this.props

        let token_name = "voucher" + (Object.getOwnPropertyNames(tokensByName).length + 1)

        const payload = {
            accountName: userInfo.accountName,
            projectId: project.id,
            token_name,
            count: 75
        }

        const resp = await fetch('/api/compToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        
        const result = await resp.json()
        if (!result.status || result.status !== 'ok') {
            let message = result.message ? result.message : 'Create Token failed';
            throw new Error(message)
        }

        projectChanged(project)
    }

    onOfferToken = async (tokenName) => {

        const { login, displayError, project, setUserInfo, projectChanged } = this.props
        const { activeUser } = this.context
        const { compPrice, tokensByName } = this.state

        if (activeUser) {
            this.setState({ loading: true })

            // get next available dgood_id
            let dgood_id = tokensByName[tokenName][0].id

            try {
                const accountName = await activeUser.getAccountName()
                const transaction = generateListRedeemTransaction(accountName, dgood_id, compPrice)

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

    renderOfferTokenList() {
        const { compPrice, tokensByName } = this.state

        return <div className="stats_box">
                    <div className="stats_header">Offerable Compensations</div>

                     {Object.getOwnPropertyNames(tokensByName).map(tokenName => {
                         return (
                            <div className="availableCompBox" key={tokenName}>
                                <div className="stats_text">{ tokensByName[tokenName].length } x {tokenName}</div>
                                <div className="stats_details">{ tokensByName[tokenName][0].voucher.title }</div>
                                <div className="comp__wrap">
                                    <select className="comp__dropdown" value={compPrice} onChange={this.handlePriceChange}>
                                        <option value="5 CYFAR">5 CYFAR</option>
                                        <option value="10 CYFAR">10 CYFAR</option>
                                        <option value="20 CYFAR">20 CYFAR</option>
                                        <option value="50 CYFAR">50 CYFAR</option>
                                        <option value="100 CYFAR">100 CYFAR</option>
                                        <option value="200 CYFAR">200 CYFAR</option>
                                        <option value="500 CYFAR">500 CYFAR</option>
                                    </select>
                                    <button className="comp__button" onClick={() => this.onOfferToken(tokenName)}>
                                        Offer 
                                    </button>
                                </div>
                            </div>)
                    })}
                           
                    <button className="btn btn--primary" onClick={this.onCreateCompensation}>
                        New Compensation 
                    </button>
                    
                </div>
    }

    render() {
        const { project } = this.props
        const receivedDonations = project.bondTokenInfo ? amountOf(project.bondTokenInfo.issued_supply) - amountOf(project.bondTokenInfo.available_supply) : "0"
        const requiredDonations = project.bondTokenInfo ? amountOf(project.bondTokenInfo.issued_supply) : "0"
        const missingCompAmount = project.requiredAmount - amountOf(project.redeemedAmount)

        return (
            <div className="row__1200">
                <div className="donate">

                    <h2>Your Project Status</h2>
                    <div className="donate__wrap">
                        <div className="stats_box">
                            <p className="stats_header">You have collected</p>
                            <p className="stats_text">{ receivedDonations } / { requiredDonations } EOS</p>
                        </div>

                        <div className="stats_box">
                            <p className="stats_header">Compensations on Offer</p>
                            <p className="stats_text">
                            { project.redeemableCompTokens.reduce((count, token) => count + token.dgood_ids.length, 0) } 
                            &nbsp;vouchers for&nbsp;
                            { project.redeemableCompTokens.reduce((price, token) => price + amountOf(token.amount), 0) }
                            &nbsp;EOS
                            </p>
                        </div>
                    </div>
                    <div className="donate__wrap">
                        <div className="stats_box">
                            <p className="stats_header">Compensated</p>
                            <p className="stats_text">{ amountOf(project.redeemedAmount) } EOS</p>
                        </div>
                        <div className="stats_box">
                            <p className="stats_header">Compensations On Offer</p>
                            <p className="stats_text">{ project.redeemableAmount } EOS</p>
                        </div>
                        <div className="stats_box">
                            <p className="stats_header">Compensations Missing</p>
                            <p className="stats_text">{ missingCompAmount } EOS</p>
                        </div>
                    </div>

                    <div className="donate__wrap">

                        { this.renderOfferTokenList(project.existingCompTokens) }
                        
                    </div>
                        
                    

                    <div className="donate__wrap">
                        
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default withUAL(CompensationTile)
