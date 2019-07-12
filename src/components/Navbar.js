import React, { Component } from "react";
import { Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";
import { logout } from "../redux/actions/userActions";

import PropTypes from "prop-types";

// Material UI stuff
import AppBar from "@material-ui/core/Appbar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

class Navbar extends Component {
    handleLogout = () => {
        this.props.logout();
        window.location.href = "/login";
    };

    render() {
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {this.props.user.authenticated === false && (
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                    )}
                    {this.props.user.authenticated === false && (
                        <Button color="inherit" component={Link} to="/signup">
                            Signup
                        </Button>
                    )}
                    {this.props.user.authenticated && (
                        <Button color="inherit" component={Link} to="/profile">
                            Profile
                        </Button>
                    )}
                    {this.props.user.authenticated && (
                        <Button color="inherit" component={Link} to="/users">
                            Users
                        </Button>
                    )}
                    {this.props.user.authenticated && (
                        <Button color="inherit" onClick={this.handleLogout}>
                            Logout
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapActionsToProps = { logout };

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Navbar);
