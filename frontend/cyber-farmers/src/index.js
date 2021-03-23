import React from 'react'
import ReactDOM from 'react-dom'

import { JsonRpc } from 'eosjs';

// UAL Required Imports
import { UALProvider } from 'ual-reactjs-renderer'

// Authenticator Imports
import { Anchor } from 'ual-anchor';
import { Scatter } from 'ual-scatter'

import 'focus-visible/dist/focus-visible.min.js'
import 'index.scss'
import 'assets/styles/constants.scss'

import App from './App'

import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();

const appName = 'CyberFarmers'

// Chains
const chain = {
  chainId: process.env.REACT_APP_CHAIN_ID,
  rpcEndpoints: [
    {
      protocol: process.env.REACT_APP_RPC_PROTOCOL,
      host: process.env.REACT_APP_RPC_HOST,
      port: process.env.REACT_APP_RPC_PORT,
    },
  ],
}

// Authenticators
const anchor = new Anchor([chain], {
  appName,
  rpc: new JsonRpc(`${process.env.REACT_APP_RPC_PROTOCOL}://${process.env.REACT_APP_RPC_HOST}:${process.env.REACT_APP_RPC_PORT}`),
  service: 'https://cb.anchor.link',
  disableGreymassFuel: false,
  requestStatus: false
});
const scatter = new Scatter([chain], { appName })

const supportedChains = [chain]
const supportedAuthenticators = [anchor, scatter]

ReactDOM.render(
  <UALProvider chains={supportedChains} authenticators={supportedAuthenticators} appName={appName}>
    <App />
  </UALProvider>,
  document.getElementById('root'),
)