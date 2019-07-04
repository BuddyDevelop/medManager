import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import User from "../components/User";

class home extends Component {
    state = {
        users: null
    };
    componentDidMount() {
        axios
            .get("/Users")
            .then(res => {
                // console.log(res.data);
                this.setState({
                    users: res.data
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        let usersData = this.state.users ? (
            Object.keys(this.state.users).map(key => (
                // <p key={key}>{this.state.users[key].email}</p>)
                <User key={key} user={this.state.users[key]} />
            ))
        ) : (
            <p>Loading...</p>
        );

        return (
            <Grid container spacing={10}>
                <Grid item sm />
                <Grid item sm={12}>
                    {usersData}
                </Grid>
                <Grid item sm />
            </Grid>
        );
    }
}

export default home;
