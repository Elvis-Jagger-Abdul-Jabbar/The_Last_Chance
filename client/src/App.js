import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
    // constructor to initialise default state
    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
    }
    // Method to fetch data from API and store response
    callAPI() {
        fetch("http://localhost:9000/testAPI")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }
    // Method to execute callAPI 
    componentDidMount() {
        this.callAPI();
    }
    // Display API response
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome</h1>
                </header>
                
                <p className="App-intro">{this.state.apiResponse}</p>
            </div>
        );
    }
}

export default App;