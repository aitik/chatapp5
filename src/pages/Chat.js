import React, { Component } from "react";
import Header from "../visuals/head";
import { auth } from "../database/firebase";
import { db } from "../database/firebase"
export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth().currentUser,
            user2: '',
            messages: [],
            content: '',
            readError: null,
            writeError: null,
            loadingChats: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.myRef = React.createRef();

    }

    async componentDidMount() {
        this.setState({ readError: null });
        const chatArea = this.myRef.current;
        var messages = [];
        try {
            db.collection("messages").where("user1","==", this.state.user.displayName).where("user2", "==", this.props.location.state.user2)
                .onSnapshot((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        messages.push(doc.data());
                    });
                    messages.sort(function (a, b) { return a.time - b.time })
                    this.setState({ messages });
                    chatArea.scrollBy(0, chatArea.scrollHeight);
                    this.setState({ loadingChats: false });
                });
        } catch (error) {
            this.setState({ readError: error.message });
        }
        try {
            db.collection("messages").where("user1","==", this.props.location.state.user2).where("user2", "==", this.state.user.displayName)
                .onSnapshot((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        messages.push(doc.data());
                    });
                    messages.sort(function (a, b) { return a.time - b.time })
                    this.setState({ messages });
                    chatArea.scrollBy(0, chatArea.scrollHeight);
                    this.setState({ loadingChats: false });
                });
        } catch (error) {
            this.setState({ readError: error.message });
        }
    }
    handleChange(event) {
        this.setState({
            content: event.target.value
        });
    }
    async handleSubmit(event) {
        event.preventDefault();
        this.setState({ writeError: null });
        const chatArea = this.myRef.current;
        try {
            await db.collection("messages").add({
                message: this.state.content,
                time: Date.now(),
                user1: this.state.user.displayName,
                user2: this.props.location.state.user2
            });
            console.log("Sent successfully")
            this.setState({ content: '' });
            // chatArea.scrollBy(0, chatArea.scrollHeight);
        } catch (error) {
            this.setState({ writeError: error.message });
            console.log(error);
        }
    }
    formatTime(timestamp) {
        const d = new Date(timestamp);
        const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
        return time;
    }

    render() {
        return (
            <div>
                <Header />
                <div className="chat-area" ref={this.myRef}>
                    {/* loading indicator */}
                    {this.state.loadingChats ? <div className="spinner-border text-success" role="status">
                        <span className="sr-only">Loading...</span>
                    </div> : ""}
                    {/* chat area */}
                    {this.state.messages.map(message => {
                        if(message.user1===this.state.user.displayName){
                            return <p className={"chat-bubble2"}>
                                {message.user1}
                                <br/>
                                {message.message}
                                <br />
                                <span className="chat-time float-right">{this.formatTime(message.time)}</span>
                            </p>
                        }
                        else{
                            return <p className={"chat-bubble"}>
                                {message.user1}
                                <br/>
                                {message.message}
                                <br />
                                <span className="chat-time float-right">{this.formatTime(message.time)}</span>
                            </p>
                        }

                    })}
                </div>
                <form onSubmit={this.handleSubmit} className="mx-3">
                    <textarea className="form-control" name="content" onChange={this.handleChange} value={this.state.content}/>
                    {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
                    <button type="submit" className="btn btn-submit px-5 mt-4">Send</button>
                </form>
                <div className="py-3 mx-3">
                    Chat with <strong className="text-info">{this.props.location.state.user2}</strong>
                </div>
                <div className=" mx-3">
                    Login in as: <strong className="text-info">{this.state.user.displayName}</strong>
                </div>
            </div>
        );
    }
}
