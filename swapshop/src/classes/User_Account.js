import { communicator } from "../classes/Communicator.js"

// the User_Account class is used to store and manage and account of a user based on the details from 
// the database
// it has 5 parameters
//  | fname - the first name of the user (string)
//  | lname - the last name of the user (string)
//  | username - the chosen username of the user (string)
//  | email - the email address of the user (string)
//  | id - the id of the user account (integer)
export class User_Account {
    constructor() {
        this.fname ="";
        this.lname = "";
        this.username = "";
        this.email = "";
        this.tags = [];
        this.id =0;
    }

    // logUser is used to print the account item to the console
    logUser() {
        console.group("user");
        console.log("Name: "+this.fname+" "+this.lname);
        console.log("Username: "+this.username);
        console.log("Email: "+this.email);
        console.groupEnd();

        return this;
    }

    // setID is used to set the value of the id
    // takes in an integer
    // returns this
    setID(id) {
        this.id = id;
        return this;
    }

    // getID is used to get the value of the ID 
    getID() {
        return this.id;
    }

    // setFirstName is used to set the value of the first name
    // it takes in a string
    // and returns this
    setFisrtName(fname){
        this.fname = fname;
        return this;
    }

    // setLastName is used to set the value of the last name
    // it takes in a string
    // and returns this
    setLastName(lname) {
        this.lname = lname;
        return this;
    }

    // setFullName is used to split the full name taken in and set the first and last name
    // takes in a string (that must contain a space)
    // and returns this
    setFullName(fullName) {
        let names = fullName.split(" ");
        if (names.length != 2 || (names[0] == "" || names[1] == "")){
            throw Error(`0 can not set the full name of a user with ${names.length}, method requires 2 names (first and last)`);
        }

        console.log(names[0], names[1])
        this.fname = names[0];
        this.lname = names[1];

        return this;
    }

    // getFirstName is used to get the value of the first name
    getFirstName() {
        return this.fname;
    }

    // getLastName is used to get the value of the last name
    getLastName() {
        return this.lname;
    }

    // getFullName is used to combine the first and last name and return it
    getFullName() {
        return this.fname + " "+ this.lname;
    }

    // setUsername is used to set the value of the username
    // it takes in a string 
    // and returns this
    setUsername(user) {
        console.log(user);
        if (user.includes(' ')){
            throw Error("1 username can not contain spaces");
        }
        this.username = user;
        return this;
    }

    // getUsername is used to get the value of the username
    getUsername() {
        return this.username;
    }

    // setEmail is used to set the value of the email
    // it takes in a string
    setEmail(Email) {
        this.email =Email;
        return this;
    }

    // getEmail is used to get the value of the email
    getEmail() {
        return this.email;
    }

    setInterests(tags) {
        this.tags = tags
        return this; 
    }

    getInterests() {
        return this.tags;
    }
    
}

// the Login_user is a sub class of User_Account that is used to validate a user's input in order to try and
// log them into an existing account
export class Login_user extends User_Account {
    constructor() {
        super();
    }

    // Login is used to make a request to the server to check the user's details
    // it takes in a string for the password
    // and returns true if the user accoutn exists 
    // and false if the user accoutn does not exist
    async Login(password) {
        let response = await communicator.makeRequestByCommand("login_account", [this.username, password]);

        console.log(response);
        if (!response) {
            return false;
        }
        
        this.setID(response["id"])
        .setUsername(response["username"])
        .setFisrtName(response["fname"])
        .setLastName(response["lname"])
        .setEmail(response["email"])
        .setInterests(response["tags"]);

        return true;
    }

    async deleteAccount() {
        console.log("deleting the account with ID:",this.getID());
        params = [this.getID()];
        return await communicator.makeRequestByCommand("delete-account", params);
    }
        
}

// the Register User is a sub class of User_account responsible for creating and 
// posting new user accounts
export class Registering_User extends Login_user {
    constructor(fullName, username, email) {
        super();
        this.setFullName(fullName)
        .setUsername(username)
        .setEmail(email);

    }

    // register_Account is used to post the system while also validtaing the users details
    // it takes in a string for a password
    // and returns true id the accoutn was created successfully
    // and false if an error occurred
    async register_Account(password) {
        let response = await communicator.makeRequestByCommand("register_account", [this.getFirstName(), this.getLastName(), this.getUsername(), password, this.getEmail()]);
    
        if (!response) {
            return false;
        }
        this.setID(response["id"]);
        return true;       
    }

}
