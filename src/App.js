import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import WorkerPool from './workerPool2';

class App extends Component {

  constructor(props) {
    super(props);
    this.wp = new WorkerPool(2);
  }

  success = e => console.log(e)

  failure = e => console.log('random failure:', e.message)

  meh = () => { 
    this.wp.queueJob('meh', [ 'who cares?' ]).then(this.success).catch(this.failure) 
  }

  hello = () => { 
    this.wp.queueJob('hello', [ 'i love you' ]).then(this.success).catch(this.failure) 
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          Demonstration of React-ready web worker pool
        </p>
        <p>
          <button onClick={this.meh}>try printing 'meh' to console</button>
        </p>
        <p>
          <button onClick={this.hello}>try printing 'hello' to console</button>
        </p>
      </div>
    );
  }
}

export default App;
