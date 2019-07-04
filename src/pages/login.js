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

//ui styles
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

class login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
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
        const userData = {
            email: this.state.email,
            password: this.state.password
        };

        axios
            .post("/login", userData)
            .then(res => {
                this.setState({
                    loading: false
                });
                //redirect to home page
                this.props.history.push("/");
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
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
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
                            Login
                            {loading && <CirularProgress className={classes.progress} size={30} />}
                        </Button>
                    </form>
                    <br />
                    <small>
                        Do not have accout? Sign up <Link to="/signup">here</Link>
                    </small>
                </Grid>
                <Grid item sm />
            </Grid>
        );
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(login);
