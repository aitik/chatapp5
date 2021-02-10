import React, { Component } from 'react';
import Header from '../visuals/head';
import Footer from '../visuals/bot';
import { Link } from 'react-router-dom';
import List from "../visuals/list"
import { auth, db } from "../database/firebase";
var users = [];
function getUsersList(){
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

export default class HomePage extends Component {
    render() {
        if(auth().currentUser){
            getUsersList();
            return (
                <div className="home">
                    <Header/>
                    {/*<List username={users["name"]}/>*/}
                    {users.map(function(user){
                        return(<List key={user["name"]} username={user["name"]}/>)
                        // return (<li key={d["name"]}>{d["name"]}</li>)
                    })}
                    <Footer/>
                </div>
            )
        }
        else{
            return (
                <div className="home">
                    <Header></Header>
                    <section>
                        <div className="jumbotron jumbotron-fluid py-5">
                            <div className="container text-center py-5">
                                <div className="mt-4">
                                    <Link className="btn btn-primary px-5 mr-3" to="/signup">Create New Account</Link>
                                    <Link className="btn px-5" to="/login">Login to Your Account</Link>
                                </div>
                            </div>
                        </div>
                    </section>
                    <Footer></Footer>
                </div>
            )
        }

    }
}
