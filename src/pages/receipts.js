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
                {elem.medication} | payment: {elem.payment}%
            </div>
        );
    });
    return <div>{elements}</div>;
};

class receipts extends Component {
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
                { name: "created", title: "Date of issue" },
                { name: "id", title: "Receipt number" },
                { name: "doctorName", title: "Doctor" },
                { name: "doctor", title: "Doctor email" },
                { name: "realizeTo", title: "Date of realization to" }
            ],
            rows: [],
            pageSize: 10,
            currentPage: 0,
            loading: true,
            ...this.initialFormState
        };

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
        this.saveReceipt = this.saveReceipt.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
    }

    //load user receipts
    componentDidMount() {
        const userPesel = this.props.location.state.pesel;

        axios
            .get(`/receipts/${userPesel}`)
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

    saveReceipt() {
        var paymentInputs = document.querySelectorAll('[name^="payment"]');
        var receiptMedicationsToSave = [];

        //loop through textarea fields, if any does not have value display error
        document.querySelectorAll('textarea[name^="med"]').forEach((elem, index) => {
            if (elem.value) {
                if (paymentInputs[index].value) {
                    //if value is number and is in range between 0 and 100
                    if (paymentInputs[index].value >= 0 && paymentInputs[index].value <= 100) {
                        receiptMedicationsToSave.push({
                            medication: elem.value,
                            payment: paymentInputs[index].value
                        });
                    }
                }
            }
        });

        if (receiptMedicationsToSave.length === 0) {
            this.setState({
                errors:
                    "At least one medication must be presented on receipt and payment has to be between 0 and 100."
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

        //data wystawienia i data realizacji do, receipt jako id z push na serwerze
        const receiptData = {
            doctor: this.props.user.userData.email,
            doctorName: doctorFullName,
            created: dayjs().format("YYYY/MM/DD"),
            realizeTo: this.state.realizeToDate.format("YYYY/MM/DD"),
            medications: receiptMedicationsToSave
        };

        this.sendReceipt(receiptData);
    }

    sendReceipt = receiptData => {
        axios
            .post(`/receipts/${this.props.location.state.pesel}/`, receiptData)
            .then(res => {
                receiptData.id = res.data.id;

                this.setState({
                    ...this.initialFormState,
                    loading: false,
                    rows: [...this.state.rows, receiptData]
                });
            })
            .catch(err => {
                this.setState({
                    errors: err.response.data
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
            loading
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
                    Add receipt
                </Button>
                <Paper>
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
                        <Table />
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
                        <SearchPanel />
                    </Grid>
                </Paper>
                <Dialog open={dialogVisiblility} onClose={this.cancelDialog}>
                    <DialogTitle className={classes.textCentered}>Create receipt</DialogTitle>
                    {errors && (
                        <Typography className={classes.textCentered} variant="body2" color="error">
                            {errors}
                        </Typography>
                    )}
                    <DialogContent>
                        <form className={classes.container} onChange={this.handleChange} noValidate>
                            <MuiPickersUtilsProvider utils={DayjsUtils}>
                                <DatePicker
                                    autoOk
                                    invalidLabel="Wrong date"
                                    label="Realize to"
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
                                label="Medication informations"
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
                                label="Payment"
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
                                label="Medication informations"
                                margin="normal"
                            />
                            <TextField
                                className={classes.textField}
                                value={this.state.payment2}
                                id="payment2"
                                name="payment2"
                                variant="outlined"
                                label="Payment"
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
                                label="Medication informations"
                                margin="normal"
                            />
                            <TextField
                                className={classes.textField}
                                value={this.state.payment3}
                                id="payment3"
                                name="payment3"
                                variant="outlined"
                                label="Payment"
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
                                label="Medication informations"
                                margin="normal"
                            />
                            <TextField
                                className={classes.textField}
                                value={this.state.payment4}
                                id="payment4"
                                name="payment4"
                                variant="outlined"
                                label="Payment"
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
                                label="Medication informations"
                                margin="normal"
                            />
                            <TextField
                                className={classes.textField}
                                value={this.state.payment5}
                                id="payment5"
                                name="payment5"
                                variant="outlined"
                                label="Payment"
                                margin="normal"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                                }}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.hideDialog} color="primary" variant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={this.saveReceipt} color="secondary" variant="outlined">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

receipts.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    {}
)(withRouter(withStyles(styles)(receipts)));
