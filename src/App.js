import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import Web3 from 'web3';
import { Chain,ORAPlugin, Models  } from '@ora-io/web3-plugin-ora';

const web3 = new Web3(window.ethereum);
web3.registerPlugin(new ORAPlugin(Chain.SEPOLIA)); // Replace SEPOLIA with your desired network


function App() {

  const [account, setAccount] = useState(null);
  const [fee, setFee] = useState(null);

  async function connectWallet() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);

  }

  async function getSentiment() {
    const prompt = `Calculate the sentiment around Ethereum in the past Week`;
    const estimatedFee = await web3.ora.estimateFee(Models.LLAMA2);
  
    setFee(estimatedFee);
    console.log(estimatedFee);
    const tx = await web3.ora.calculateAIResult(account, Models.LLAMA2, prompt, estimatedFee);
    console.log(tx);
    
  }
  async function getAIResult(model, prompt) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, 30000); // Adjust the timeout as needed
  
      web3.ora.getAIResult(model, prompt)
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={connectWallet} >Connect Wallet</button>
        <button onClick={getSentiment} >Get Estimate and Call AI function</button>
        <button onClick={getAIResult} >Get Sentiment</button>
        <p>{account}</p>
        <p>{fee}</p>
       
      </header>
    </div>
  );
}

export default App;
