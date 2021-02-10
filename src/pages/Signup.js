import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../database/auth';
import { signin, signInWithGoogle } from "../database/auth";
import {db, auth} from "../database/firebase";

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            email: '',
            password: '',
            name: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async handleSubmit(event) {
        event.preventDefault();
        this.setState({ error: '' });
        try {
            await signup(this.state.email, this.state.password, this.state.name);
            auth().currentUser.updateProfile({
                displayName: this.state.name
            }).then(function() {
                // Update successful.
            }).catch(function(error) {
                // An error happened.
            });
        } catch (error) {
            this.setState({ error: error.message });
        }
    }
    async googleSignIn() {
        try {
            await signInWithGoogle();
            var currentuser = auth().currentUser;
            try {
                await db.collection("users").add({
                    email: currentuser.email,
                    name: currentuser.displayName,
                    password: ''
                });
                console.log("User created")
            } catch (error) {
                this.setState({ writeError: error.message });
                console.log(error);
            }
        } catch (error) {
            this.setState({ error: error.message });
        }
    }
    render() {

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <h1>
                        Sign Up
                    </h1>
                    <div className={"mt-2"}>
                        <input placeholder="Name" name="name" onChange={this.handleChange} value={this.state.name} type="name"/>
                    </div>
                    <div className={"mt-2"}>
                        <input placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}/>
                    </div>
                    <div className={"mt-2"}>
                        <input placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} type="password"/>
                    </div>

                    <div className={"mt-3"}>
                        {this.state.error ? <p>{this.state.error}</p> : null}
                        <button type="submit">Sign up</button>
                        <p className={"mt-3"}>Or</p>
                        <button onClick={this.googleSignIn} type="button">
                            Sign up with Google
                        </button>
                    </div>

                    <hr></hr>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        )
    }
}
