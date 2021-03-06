import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import PropTypes from "prop-types";

import axios from "axios";

import { connect } from "react-redux";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import CirularProgress from "@material-ui/core/CircularProgress";

//Devexpress UI
import {
    RowDetailState,
    SortingState,
    PagingState,
    SearchState,
    IntegratedFiltering,
    IntegratedPaging,
    IntegratedSorting
} from "@devexpress/dx-react-grid";
import {
    Grid,
    Table,
    TableHeaderRow,
    TableRowDetail,
    PagingPanel,
    Toolbar,
    SearchPanel
} from "@devexpress/dx-react-grid-material-ui";

//date picker UI
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

//date library
import DayjsUtils from "@date-io/dayjs";
import dayjs from "dayjs";

//Translations
import i18next from "i18next";

const styles = {
    container: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center"
    },
    textArea: {
        width: "60%"
    },
    textField: {
        width: "20%",
        minWidth: 100,
        marginLeft: 10,
        marginRight: 10
    },
    textCentered: {
        textAlign: "center"
    },
    margin: {
        margin: 10
    }
};

//detail row contains every medication in separate line
const RowDetail = ({ row: { medications } }) => {
    var elements = medications.map((elem, index) => {
        return (
            <div key={index}>
                {elem.medication} | {i18next.t("Payment")} {elem.payment}%
            </div>
        );
    });
    return <div>{elements}</div>;
};

class prescriptions extends Component {
    constructor() {
        super();

        this.initialFormState = {
            payment1: "100",
            payment2: "100",
            payment3: "100",
            payment4: "100",
            payment5: "100",
            med1: "",
            med2: "",
            med3: "",
            med4: "",
            med5: "",
            errors: null,
            dialogVisiblility: false
        };

        this.state = {
            realizeToDate: dayjs().add(1, "month"),
            columns: [
                { name: "created", title: i18next.t("Date of issue") },
                { name: "id", title: i18next.t("Prescription number") },
                { name: "doctorName", title: i18next.t("Doctor") },
                { name: "doctor", title: i18next.t("Doctor email") },
                { name: "realizeTo", title: i18next.t("Date of realization to") }
            ],
            rows: [],
            pageSize: 10,
            currentPage: 0,
            loading: true,
            success: "",
            searchPanelLabel: {
                searchPlaceholder: i18next.t("Search")
            },
            tableMessages: {
                noData: i18next.t("No data")
            },
            ...this.initialFormState
        };

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
        this.savePrescription = this.savePrescription.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
    }

    //load user prescriptions
    componentDidMount() {
        const userPesel = this.props.location.state.pesel;

        axios
            .get(`/prescriptions/${userPesel}`)
            .then(res => {
                //add id to every row
                let tmp = Object.values(Object.values(res.data)[0]);
                tmp.map((elem, index) => {
                    return (elem.id = Object.getOwnPropertyNames(Object.values(res.data)[0])[
                        index
                    ]);
                });

                this.setState({
                    rows: tmp,
                    loading: false
                });
            })
            .catch(err => {
                this.setState({
                    loading: false
                });
                console.error(err);
            });
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    hideDialog() {
        this.setState({
            dialogVisiblility: false
        });
    }

    handleDateChange(date) {
        this.setState({
            realizeToDate: date
        });
    }

    savePrescription() {
        var paymentInputs = document.querySelectorAll('[name^="payment"]');
        var prescriptionMedicationsToSave = [];

        //loop through textarea fields, if any does not have value display error
        document.querySelectorAll('textarea[name^="med"]').forEach((elem, index) => {
            if (elem.value) {
                if (paymentInputs[index].value) {
                    //if value is number and is in range between 0 and 100
                    if (paymentInputs[index].value >= 0 && paymentInputs[index].value <= 100) {
                        prescriptionMedicationsToSave.push({
                            medication: elem.value,
                            payment: paymentInputs[index].value
                        });
                    }
                }
            }
        });

        if (prescriptionMedicationsToSave.length === 0) {
            this.setState({
                errors:
                    "At least one medication must be presented on prescription and payment has to be between 0 and 100."
            });
            return false;
        }

        if (!this.state.realizeToDate) {
            this.setState({
                errors: "Invalid date format."
            });
            return false;
        }

        let doctorFullName = this.props.user.userData.name + " " + this.props.user.userData.surname;

        //data wystawienia i data realizacji do, prescription jako id z push na serwerze
        const prescriptionData = {
            doctor: this.props.user.userData.email,
            doctorName: doctorFullName,
            created: dayjs().format("YYYY/MM/DD"),
            realizeTo: this.state.realizeToDate.format("YYYY/MM/DD"),
            medications: prescriptionMedicationsToSave
        };

        this.sendPrescription(prescriptionData);
    }

    sendPrescription = prescriptionData => {
        axios
            .post(`/prescriptions/${this.props.location.state.pesel}/`, prescriptionData)
            .then(res => {
                prescriptionData.id = res.data.id;

                this.setState({
                    ...this.initialFormState,
                    loading: false,
                    success: res.data.success,
                    rows: [...this.state.rows, prescriptionData]
                });
            })
            .catch(err => {
                this.setState({
                    errors: err.response.data,
                    success: ""
                });
            });
    };

    handleClickOpen() {
        this.setState({
            dialogVisiblility: true
        });
    }

    render() {
        const { classes } = this.props;
        const {
            rows,
            columns,
            pageSize,
            currentPage,
            dialogVisiblility,
            errors,
            loading,
            success,
            searchPanelLabel,
            tableMessages
        } = this.state;

        return (
            <div className={classes.textCentered}>
                <h1>{this.props.location.state.name}</h1>
                <Button
                    className={classes.margin}
                    variant="contained"
                    color="secondary"
                    onClick={this.handleClickOpen}
                >
                    {i18next.t("Add prescription")}
                </Button>
                <div>
                    {success && (
                        <Typography variant="h6" color="secondary">
                            {success}
                        </Typography>
                    )}
                </div>
                <Paper style={{ position: "relative" }}>
                    <Grid rows={rows} columns={columns}>
                        <RowDetailState />
                        <SearchState />
                        <SortingState
                            defaultSorting={[{ columnName: "realizeTo", direction: "desc" }]}
                        />
                        <PagingState
                            currentPage={currentPage}
                            pageSize={pageSize}
                            onCurrentPageChange={this.changeCurrentPage}
                        />
                        <IntegratedFiltering />
                        <IntegratedSorting />
                        <IntegratedPaging />
                        <Table messages={tableMessages} />
                        <TableHeaderRow showSortingControls />
                        <TableRowDetail contentComponent={RowDetail} />
                        <PagingPanel />
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 1500
                            }}
                        >
                            {loading && <CirularProgress size={50} />}
                        </div>
                        <Toolbar />
                        <SearchPanel messages={searchPanelLabel} />
                    </Grid>
                </Paper>
                <Dialog open={dialogVisiblility} onClose={this.cancelDialog}>
                    <DialogTitle className={classes.textCentered}>
                        {i18next.t("Create prescription")}
                    </DialogTitle>
                    {errors && typeof errors === "object" ? (
                        Object.entries(errors).map(([key, value]) => (
                            <Typography
                                className={classes.textCentered}
                                key={key}
                                variant="h6"
                                color="error"
                            >
                                {value}
                            </Typography>
                        ))
                    ) : (
                        <Typography className={classes.textCentered} variant="h6" color="error">
                            {errors}
                        </Typography>
                    )}
                    <DialogContent>
                        <form className={classes.container} onChange={this.handleChange} noValidate>
                            <MuiPickersUtilsProvider utils={DayjsUtils}>
                                <DatePicker
                                    autoOk
                                    invalidLabel="Wrong date"
                                    label={i18next.t("Realize to")}
                                    id="realizeToDate"
                                    name="realize-to-date"
                                    variant="inline"
                                    inputVariant="outlined"
                                    format="DD/MM/YYYY"
                                    value={this.state.realizeToDate}
                                    onChange={this.handleDateChange}
                                />
                            </MuiPickersUtilsProvider>
                            <TextField
                                className={classes.textArea}
                                value={this.state.med1}
                                id="med1"
                                name="med1"
                                multiline
                                rowsMax="5"
                                rows="5"
                                variant="outlined"
                                label={i18next.t("Medication informations")}
                                margin="normal"
                            />
                            <TextField
                                className={classes.textField}
                                value={this.state.payment1}
                                id="payment1"
                                name="payment1"
                                variant="outlined"
                                type="number"
                                min="0"
                                max="100"
                                label={i18next.t("Payment prescription label")}
                                margin="normal"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                                }}
                            />
                            <TextField
                                className={classes.textArea}
                                value={this.state.med2}
                                id="med2"
                                name="med2"
                                multiline
                                rowsMax="5"
                                rows="5"
                                variant="outlined"
                                label={i18next.t("Medication informations")}
                                margin="normal"
                            />
                            <TextField
                                className={classes.textField}
                                value={this.state.payment2}
                                id="payment2"
                                name="payment2"
                                variant="outlined"
                                label={i18next.t("Payment prescription label")}
                                margin="normal"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                                }}
                            />
                            <TextField
                                className={classes.textArea}
                                value={this.state.med3}
                                id="med3"
                                name="med3"
                                multiline
                                rowsMax="5"
                                rows="5"
                                variant="outlined"
                                label={i18next.t("Medication informations")}
                                margin="normal"
                            />
                            <TextField
                                className={classes.textField}
                                value={this.state.payment3}
                                id="payment3"
                                name="payment3"
                                variant="outlined"
                                label={i18next.t("Payment prescription label")}
                                margin="normal"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                                }}
                            />
                            <TextField
                                className={classes.textArea}
                                value={this.state.med4}
                                id="med4"
                                name="med4"
                                multiline
                                rowsMax="5"
                                rows="5"
                                variant="outlined"
                                label={i18next.t("Medication informations")}
                                margin="normal"
                            />
                            <TextField
                                className={classes.textField}
                                value={this.state.payment4}
                                id="payment4"
                                name="payment4"
                                variant="outlined"
                                label={i18next.t("Payment prescription label")}
                                margin="normal"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                                }}
                            />
                            <TextField
                                className={classes.textArea}
                                value={this.state.med5}
                                id="med5"
                                name="med5"
                                multiline
                                rowsMax="5"
                                rows="5"
                                variant="outlined"
                                label={i18next.t("Medication informations")}
                                margin="normal"
                            />
                            <TextField
                                className={classes.textField}
                                value={this.state.payment5}
                                id="payment5"
                                name="payment5"
                                variant="outlined"
                                label={i18next.t("Payment prescription label")}
                                margin="normal"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                                }}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.hideDialog} color="primary" variant="outlined">
                            {i18next.t("CancelButton")}
                        </Button>
                        <Button
                            onClick={this.savePrescription}
                            color="secondary"
                            variant="outlined"
                        >
                            {i18next.t("SaveMedicationBtn")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

prescriptions.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    {}
)(withRouter(withStyles(styles)(prescriptions)));
