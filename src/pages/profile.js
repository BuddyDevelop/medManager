import React, { Component } from "react";

//Redux
import { connect } from "react-redux";
import store from "../redux/store";
import PropTypes from "prop-types";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";

const styles = {
    userDataTitle: {
        marginLeft: "-24px"
    },
    userData: {
        textAlign: "center",
        margin: "10px auto 10px auto"
    },
    containerStyles: {
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
            user: store.getState().user.userData
        });
    }

    render() {
        const { classes } = this.props;
        const dateFormat = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

        // let profileData = this.state.user ? "asd" : <p>Loading...</p>;
        return (
            <Grid container spacing={3}>
                <Grid item xs />
                <Grid item xs>
                    <Typography className={classes.userData} variant="h4">
                        Profile
                    </Typography>
                    <Divider />
                    <Container className={classes.containerStyles}>
                        <Typography className={classes.userDataTitle} variant="body2">
                            Name:
                        </Typography>
                        <Typography variant="h6" color="primary">
                            {this.state.user.name}
                        </Typography>
                    </Container>
                    <Divider />
                    <Container className={classes.containerStyles}>
                        <Typography className={classes.userDataTitle} variant="body2">
                            Surname:
                        </Typography>
                        <Typography variant="h6" color="primary">
                            {this.state.user.surname}
                        </Typography>
                    </Container>
                    <Divider />
                    <Container className={classes.containerStyles}>
                        <Typography className={classes.userDataTitle} variant="body2">
                            Email:
                        </Typography>
                        <Typography variant="h6" color="primary">
                            {this.state.user.email}
                        </Typography>
                    </Container>
                    <Divider />
                    <Container className={classes.containerStyles}>
                        <Typography className={classes.userDataTitle} variant="body2">
                            License number:
                        </Typography>
                        <Typography variant="h6" color="primary">
                            {this.state.user.licenseId}
                        </Typography>
                    </Container>
                    <Divider />
                    <Container className={classes.containerStyles}>
                        <Typography className={classes.userDataTitle} variant="body2">
                            Member since:
                        </Typography>
                        <Typography variant="h6" color="primary">
                            {this.state.user.createdAt
                                ? new Date(this.state.user.createdAt).toLocaleDateString(
                                      "en-US",
                                      dateFormat
                                  )
                                : ""}
                        </Typography>
                    </Container>
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
