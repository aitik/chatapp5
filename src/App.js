import './App.css';
import React, { Component } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Map from "./pages/Map";
import { auth } from './database/firebase';
import mapboxgl from 'mapbox-gl';
//dfgg
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
      <Route
          {...rest}
          render={(props) => authenticated === true
              ? <Component {...props} />
              : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
      />
  )
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
      <Route
          {...rest}
          render={(props) => authenticated === false
              ? <Component {...props} />
              : <Redirect to='' />}
      />
  )
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      loading: true
    };
  }

  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false
        });
      }
    });
  }

  render() {
    return this.state.loading === true ? (
        <div className="spinner-border text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div>
    ) : (
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute
                path="/chat"
                authenticated={this.state.authenticated}
                component={Chat}
            />
            <PublicRoute
                path="/signup"
                authenticated={this.state.authenticated}
                component={Signup}
            />
            <PublicRoute
                path="/login"
                authenticated={this.state.authenticated}
                component={Login}
            />
            <PrivateRoute
                path="/map"
                authenticated={this.state.authenticated}
                component={Map}
            />
          </Switch>
        </Router>
    );
  }
}


export default App;
