import React, {useEffect, useState} from 'react';
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import Header from "../visuals/head";
import {Link} from "react-router-dom";
import {auth, db} from '../database/firebase';
import { useHistory } from "react-router-dom";

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
function getLocation(){
    var users2 = [];
    db.collection("users").where("name","==", auth().currentUser.displayName)
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                users2.push(doc.id);
                console.log(doc.id)
            });
        });
    navigator.geolocation.getCurrentPosition(
        function(position) {
            db.collection("users").doc(users2[0]).update({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
                .then(() => {
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
        },
        function(error) {
            db.collection("users").doc(users2[0]).update({
                latitude: 0,
                longitude: 0
            }).then(() => {
                console.log("Document successfully updated!");
            })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
        }
    )
}



function Map() {
    useEffect(()=>{
        getUsersList();
        getLocation();
    }, [])
    const [viewport, setViewport] = useState({
        latitude: 42.007670,
        longitude: -88.071560,
        width: "100vw",
        height: "100vh",
        zoom: 12
    });
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <div>
            <Header/>
            <ReactMapGL {...viewport}
                        mapboxApiAccessToken={"pk.eyJ1IjoiYWl0ZWdpbiIsImEiOiJja2t5dGxtaXIwYWF5Mm90NHZvYXRoc3kzIn0.09oe7122cr8McIKipfM8xA"}
                        mapStyle="mapbox://styles/aitegin/ckkyun5160ak917rv231eee7y"
                        onViewportChange={viewport => {
                            setViewport(viewport);
                        }}>
                {users.map(user => (
                <Marker
                    key={user["name"]}
                    latitude={parseFloat(user["latitude"])}
                    longitude={parseFloat(user["longitude"])}
                >
                    <button
                        className="marker-btn"
                        onClick={e => {
                            e.preventDefault();
                            setSelectedChat(user);
                        }}
                    >
                        <img src="/chat3.svg"/>
                    </button>
                </Marker>
                ))}

                {selectedChat ? (
                    <Popup
                        latitude={parseFloat(selectedChat["latitude"])}
                        longitude={parseFloat(selectedChat["longitude"])}
                        onClose={() => {
                            setSelectedChat(null);
                        }}
                    >
                        <div>
                            <Link to={{
                                pathname: "/chat",
                                state: {user2: selectedChat["name"]}
                            }}>
                                Chat with {selectedChat["name"]}
                            </Link>
                        </div>
                    </Popup>
                ) : null}
            </ReactMapGL>
        </div>

    );
}

export default Map;
