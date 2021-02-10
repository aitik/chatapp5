import {auth, db} from "./firebase";
export function signup(email, password, name) {
    try {
        db.collection("users").add({
            email: email,
            name: name,
            password: password
        });
        console.log("User created")
    } catch (error) {
        this.setState({ writeError: error.message });
        console.log(error);
    }
    return auth().createUserWithEmailAndPassword(email, password);
}

export function signin(email, password) {
    return auth().signInWithEmailAndPassword(email, password);
}

export function signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    return auth().signInWithPopup(provider);
}
