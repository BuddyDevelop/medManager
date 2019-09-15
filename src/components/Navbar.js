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

//translations
import { Translation } from "react-i18next";

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
                            <Translation>{(t, { i18n }) => <p>{t("Login")}</p>}</Translation>
                        </Button>
                    )}
                    {this.props.user.authenticated === false && (
                        <Button color="inherit" component={Link} to="/signup">
                            <Translation>{(t, { i18n }) => <p>{t("Signup")}</p>}</Translation>
                        </Button>
                    )}
                    {this.props.user.authenticated && (
                        <Button color="inherit" component={Link} to="/profile">
                            <Translation>{(t, { i18n }) => <p>{t("Profile")}</p>}</Translation>
                        </Button>
                    )}
                    {this.props.user.authenticated && (
                        <Button color="inherit" component={Link} to="/users">
                            <Translation>{(t, { i18n }) => <p>{t("Users")}</p>}</Translation>
                        </Button>
                    )}
                    {this.props.user.authenticated && (
                        <Button color="inherit" onClick={this.handleLogout}>
                            <Translation>{(t, { i18n }) => <p>{t("Logout")}</p>}</Translation>
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
