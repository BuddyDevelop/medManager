import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import axios from "axios";

// Material UI stuff
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CirularProgress from "@material-ui/core/CircularProgress";

const styles = {
    form: {
        textAlign: "center"
    },
    pageTitle: {
        margin: "10px auto 10px auto"
    },
    button: {
        marginTop: 20,
        position: "relative"
    },
    TextField: {
        margin: "10px auto 10px auto"
    },
    customError: {
        color: "red",
        fontSize: "0.8rem",
        marginTop: 5
    },
    progress: {
        position: "absolute"
    }
};

class signup extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            name: "",
            surname: "",
            licenseId: "",
            password: "",
            confirmPassword: "",
            loading: false,
            errors: {}
        };
    }

    handleSubmit = event => {
        //do not reload page
        event.preventDefault();

        this.setState({
            loading: true
        });
        const newUserData = {
            email: this.state.email,
            name: this.state.name,
            surname: this.state.surname,
            licenseId: this.state.licenseId,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        };

        axios
            .post("/signup", newUserData)
            .then(res => {
                this.setState({
                    loading: false
                });
                //redirect to home page
                this.props.history.push("/login");
            })
            .catch(err => {
                this.setState({
                    errors: err.response.data,
                    loading: false
                });
            });
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const { classes } = this.props;
        const { errors, loading } = this.state;

        return (
            <Grid container className={classes.form}>
                <Grid item sm />
                <Grid item sm>
                    <Typography variant="h4" className={classes.pageTitle}>
                        Signup
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField
                            className={classes.TextField}
                            helperText={errors.name}
                            error={errors.name ? true : false}
                            fullWidth
                            id="name"
                            name="name"
                            type="name"
                            label="Name"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                        <TextField
                            className={classes.TextField}
                            helperText={errors.surname}
                            error={errors.surname ? true : false}
                            fullWidth
                            id="surname"
                            name="surname"
                            type="surname"
                            label="Surname"
                            value={this.state.surname}
                            onChange={this.handleChange}
                        />
                        <TextField
                            className={classes.TextField}
                            helperText={errors.licenseId}
                            error={errors.licenseId ? true : false}
                            fullWidth
                            id="licenseId"
                            name="licenseId"
                            type="licenseId"
                            label="License number"
                            value={this.state.licenseId}
                            onChange={this.handleChange}
                        />
                        <TextField
                            className={classes.TextField}
                            helperText={errors.email}
                            error={errors.email ? true : false}
                            fullWidth
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                        <TextField
                            className={classes.TextField}
                            helperText={errors.password}
                            error={errors.password ? true : false}
                            fullWidth
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                        <TextField
                            className={classes.TextField}
                            helperText={errors.confirmPassword}
                            error={errors.confirmPassword ? true : false}
                            fullWidth
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            label="Confirm password"
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                        />
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button
                            className={classes.button}
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            Signup
                            {loading && <CirularProgress className={classes.progress} size={30} />}
                        </Button>
                    </form>
                    <br />
                    <small>
                        Already have an accout? Login <Link to="/login">here</Link>
                    </small>
                </Grid>
                <Grid item sm />
            </Grid>
        );
    }
}

signup.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(signup);
