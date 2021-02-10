import React, { Component } from "react";
import { Link } from "react-router-dom";
import { signin, signInWithGoogle} from "../database/auth";
import {db} from "../database/firebase";
var users = [];
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            email: "",
            password: ""
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
        this.setState({ error: "" });
        try {
            await signin(this.state.email, this.state.password);
        } catch (error) {
            this.setState({ error: error.message });
        }
    }


    async getUsersList(){
        db.collection("users")
            .get()
            .then((querySnapshot) => {
                users = [];
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    users.push(doc.data());
                    console.log(doc.id, " => ", doc.data());
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }
    async googleSignIn() {
        try {
            await signInWithGoogle();
        } catch (error) {
            this.setState({ error: error.message });
        }

    }

    render() {
        return (
            <div>
                <form
                    autoComplete="off"
                    onSubmit={this.handleSubmit}
                >
                    <h1>
                        Login to
                    </h1>

                    <div>
                        <input
                            placeholder="Email"
                            name="email"
                            type="email"
                            onChange={this.handleChange}
                            value={this.state.email}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Password"
                            name="password"
                            onChange={this.handleChange}
                            value={this.state.password}
                            type="password"
                        />
                    </div>
                    <div>
                        {this.state.error ? (
                            <p>{this.state.error}</p>
                        ) : null}
                        <button type="submit">Login</button>
                    </div>
                    <button className="btn btn-danger mr-2" type="button" onClick={this.googleSignIn}>
                        Sign in with Google
                    </button>
                    <hr />
                    <p>
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </p>
                </form>
            </div>
        );
    }
}
