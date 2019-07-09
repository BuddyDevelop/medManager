import React, { Component } from "react";

//Redux
import { connect } from "react-redux";
import store from "../redux/store";
import PropTypes from "prop-types";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const styles = {
    userData: {
        textAlign: "center"
    },
    InputLabel: {
        margin: "10px auto 10px auto"
    }
};

class profile extends Component {
    constructor() {
        super();
        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        this.setState({
            user: store.getState().user
        });
    }

    render() {
        const { classes } = this.props;

        let profileData = this.state.user ? "asd" : <p>Loading...</p>;
        return (
            <Grid container spacing={3}>
                <Grid item xs />
                <Grid item xs className={classes.userData}>
                    <InputLabel>{this.state.user.name}</InputLabel>
                    <InputLabel>{this.state.user.surname}</InputLabel>
                    <InputLabel>{this.state.user.email}</InputLabel>
                </Grid>
                <Grid item xs />
            </Grid>
        );
    }
}

profile.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(profile));
