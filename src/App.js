import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./util/theme";

import axios from "axios";

//Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { getUserData, logout } from "./redux/actions/userActions";

//library to decode token
import jwtDecode from "jwt-decode";

//pages
import users from "./pages/users";
import login from "./pages/login";
import signup from "./pages/signup";
import profile from "./pages/profile";
import medications from "./pages/medications";
import prescriptions from "./pages/prescriptions";

//componenet
import Navbar from "./components/Navbar";
import AuthRoute from "./util/AuthRoute.js";

//MUI
import Button from "@material-ui/core/Button";

//translation configuration file
// import i18n from "./i18n";
import { withTranslation } from "react-i18next";

//for deployment
axios.defaults.baseURL = "https://europe-west2-med-reminders.cloudfunctions.net/api";

const theme = createMuiTheme(themeFile);

//check expiration date of token and redirect if it expired already
const token = localStorage.FBToken;
if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
        store.dispatch(logout());
        window.location.href = "/login";
    } else {
        store.dispatch({ type: SET_AUTHENTICATED });
        axios.defaults.headers.common["Authorization"] = token;
        store.dispatch(getUserData());
    }
}

class App extends Component {
    render() {
        const { i18n } = this.props;

        //change language
        const changeLanguage = langCode => {
            i18n.changeLanguage(langCode);
        };

        return (
            <MuiThemeProvider theme={theme}>
                <Provider store={store}>
                    <div className="App">
                        <Router>
                            <Navbar />
                            <div className="container" style={{ margin: "75px auto 0 auto" }}>
                                <div style={{ textAlign: "end", marginBottom: "5px" }}>
                                    <Button color="inherit" onClick={() => changeLanguage("en")}>
                                        en
                                    </Button>
                                    <Button color="inherit" onClick={() => changeLanguage("pl")}>
                                        pl
                                    </Button>
                                </div>
                                <Switch>
                                    <Route exact path="/users" component={users} />
                                    <AuthRoute exact path="/login" component={login} />
                                    <AuthRoute exact path="/signup" component={signup} />
                                    <Route exact path="/profile" component={profile} />
                                    <Route
                                        exact
                                        path="/medications/:pesel"
                                        component={medications}
                                    />
                                    <Route
                                        exact
                                        path="/prescriptions/:pesel"
                                        component={prescriptions}
                                    />
                                </Switch>
                            </div>
                        </Router>
                    </div>
                </Provider>
            </MuiThemeProvider>
        );
    }
}

export default withTranslation()(App);
