import React, { Component } from "react";

import axios from "axios";
import User from "../components/User";

//MUI
import { GridList } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
    gridList: {
        justifyContent: "center"
    }
};

class users extends Component {
    state = {
        users: null,
        errors: null
    };

    componentDidMount() {
        //if token does not exist, doctor has to log in to see users
        if (!localStorage.FBToken) {
            this.setState({
                errors: "You are unauthorized, please log in."
            });
            return;
        }

        const firebaseToken = localStorage.FBToken;
        axios.defaults.headers.common["Authorization"] = firebaseToken;
        axios
            .get("/Users")
            .then(res => {
                // console.log(res.data);
                this.setState({
                    users: res.data
                });
            })
            .catch(err => {
                this.setState({
                    errors: err
                });
                console.log(err.code);
            });
    }

    render() {
        const { errors } = this.state;
        const { classes } = this.props;

        let usersData = this.state.users ? (
            Object.keys(this.state.users).map(key => (
                // <p key={key}>{this.state.users[key].email}</p>)
                <User key={key} user={this.state.users[key]} />
            ))
        ) : errors === null ? (
            <p>Loading...</p>
        ) : (
            // Object.entries(errors).map(([key, value]) => <p key={key}>{value}</p>)
            <p>Error, please log in again.</p>
        );

        return (
            <GridList cols={5} cellHeight={"auto"} className={classes.gridList}>
                {usersData}
            </GridList>
        );
    }
}

export default withStyles(styles)(users);
