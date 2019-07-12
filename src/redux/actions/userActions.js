import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_UNAUTHENTICATED } from "../types";
import axios from "axios";

export const loginUser = (userData, history) => dispatch => {
    dispatch({ type: LOADING_UI });

    axios
        .post("/login", userData)
        .then(res => {
            setAuthorizationHeader(res.data.token);

            // dispatch({ type: SET_AUTHENTICATED });
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            //redirect to home page
            history.push("/users");
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};

export const signupUser = (newUserData, history) => dispatch => {
    dispatch({ type: LOADING_UI });

    axios
        .post("/signup", newUserData)
        .then(res => {
            setAuthorizationHeader(res.data.token);

            //set doctor data
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            //redirect to home page
            history.push("/users");
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};

export const getUserData = () => dispatch => {
    axios
        .get("/doctor")
        .then(res => {
            dispatch({
                type: SET_USER,
                payload: res.data //data that we send to reducer
            });
        })
        .catch(err => {
            console.log(err);
        });
};

export const logout = () => dispatch => {
    localStorage.removeItem("FBToken");
    delete axios.defaults.headers.common["Authorization"];
    dispatch({ type: SET_UNAUTHENTICATED });
};

const setAuthorizationHeader = token => {
    const firebaseToken = `Bearer ${token}`;
    localStorage.setItem("FBToken", firebaseToken);
    axios.defaults.headers.common["Authorization"] = firebaseToken;
};
