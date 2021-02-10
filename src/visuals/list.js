import React from 'react';
import {Link} from "react-router-dom";

const formatUsers = users => users.map(user => (
    <p key={user.displayName}>{user.displayName}</p>
));

export default class UsersPage extends React.Component {
    constructor(props) {
        super(props);
    }
    // redirect(username){
    //     props.history.push({
    //         pathname: "/chat",
    //         state: {user2: username}
    //     });
    // }
    render() {
        const {username, email, unread} = this.props;
        if(unread>0){
            return (
                <div className="row">
                    <div className="list-user">
                        <h2>{ username }</h2>
                        <br/>
                        <p className="unread">{ unread } unread messages</p>
                    </div>
                    <Link className="btn btn-submit px-5 float-right" to={{
                        pathname: "/chat",
                        state: {user2: username}
                    }}>
                        Chat
                    </Link>
                    {/*<button type="submit" className="btn btn-submit px-5 mt-4" onClick={() => this.redirect(username)}>Chat</button>*/}
                </div>
            );
        }
        else{
            return (
                <div className="row">
                    <div className="list-user">
                        <h2>{ username }</h2>

                    </div>
                    <Link className="btn btn-submit px-5 mt-4 float-right" to={{
                        pathname: "/chat",
                        state: {user2: username}
                    }}>
                        Chat
                    </Link>
                </div>
            );
        }

    }
}
