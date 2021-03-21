import React from 'react'
import { func, shape, string, object } from 'prop-types'
import { withUAL, UALContext } from 'ual-reactjs-renderer'

import { generateDonateTransaction, transactionConfig } from 'utils/transaction'
import { amountOf } from 'utils/chain'

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
        userInfo: object.isRequired
    }

    state = {
        donation: '5.0000 EOS',
        loading: false,
        donated: false
    };

    onCreateCompensation = () => {

    }

    render() {

        const { routeToLanding, login, displayError, project, userInfo, setUserInfo } = this.props
        const receivedDonations = project.bondTokenInfo ? amountOf(project.bondTokenInfo.issued_supply) - amountOf(project.bondTokenInfo.available_supply) : "0"
        const requiredDonations = project.bondTokenInfo ? amountOf(project.bondTokenInfo.issued_supply) : "0"
        const missingCompAmount = project.requiredAmount - project.redeemedAmount

        return (
            <div className="row__1200">
                <div className="donate">

                    <h2>Your Project Status</h2>
                    <div className="donate__wrap">
                        <p>You have collected <br /> { receivedDonations } / { requiredDonations } EOS</p>
                    </div>
                    <div className="donate__wrap">
                        <p>Compensated <br /> { project.redeemedAmount } EOS</p>
                        <p>On Offer<br /> { project.redeemableAmount } EOS</p>
                        <p>Missing<br /> { missingCompAmount } EOS</p>
                    </div>

                    <div className="donate__wrap">
                        <p>Compensations on Offer</p>
                    </div>
                    <ul>
                        { project.redeemableCompTokens.map(t => <li>{t.dgood_ids.length} vouchers for {t.amount} each</li> )}
                    </ul>

                    <div className="donate__wrap">
                        <button className="btn btn--primary" onClick={this.onCreateCompensation}>
                            Create Compensation 
                        </button>
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default withUAL(CompensationTile)
