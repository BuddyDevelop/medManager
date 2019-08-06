import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import axios from "axios";

//Redux
import { connect } from "react-redux";
import store from "../redux/store";
import PropTypes from "prop-types";
import { SET_ERRORS, CLEAR_ERRORS } from "../redux/types";

//date library
import dayjs from "dayjs";

//MUI and devexpress
import Paper from "@material-ui/core/Paper";
import CirularProgress from "@material-ui/core/CircularProgress";
import {
    EditingState,
    PagingState,
    IntegratedPaging,
    FilteringState,
    IntegratedFiltering
} from "@devexpress/dx-react-grid";
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
    PagingPanel,
    TableFilterRow
} from "@devexpress/dx-react-grid-material-ui";

import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

const getRowId = row => row.id.toString();

const HiddenButtonsCell = props => {
    return (
        <Table.Cell
            {...props}
            style={{
                visibility: "hidden",
                padding: 0
            }}
        />
    );
};

class Medications extends Component {
    constructor() {
        super();

        this.state = {
            columns: [
                { name: "name", title: "Name" },
                { name: "doseUnit", title: "Dose unit" },
                { name: "dose", title: "Dose" },
                { name: "start", title: "Medication start" },
                { name: "ends", title: "Medication ends" },
                { name: "doctor", title: "Added by" }
            ],
            editingStateColumnExtensions: [{ columnName: "doctor", editingEnabled: false }],
            rows: [],
            totalCount: 0,
            pageSize: 10,
            currentPage: 0,
            errors: {},
            loading: true,
            //
            editingRowIds: [],
            addedRows: [],
            rowChanges: {},
            execute: () => {},
            dialogVisiblility: false,
            commandButtonId: ""
        };

        this.changeCurrentPage = currentPage => this.setState({ currentPage });
        this.commitChanges = this.commitChanges.bind(this);

        this.hideDialog = this.hideDialog.bind(this);
        this.command = this.command.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.changeAddedRows = this.changeAddedRows.bind(this);
    }

    //load user medications
    componentDidMount() {
        const userPesel = this.props.location.state.pesel;

        axios
            .get(`/medications/${userPesel}`)
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) this.setState({ errors: nextProps.UI.errors });
    }

    command({ onExecute, id, ...restProps }) {
        if (id === "commit") {
            return (
                <TableEditColumn.Command
                    onExecute={() => {
                        this.setState({ dialogVisiblility: true, execute: onExecute });
                    }}
                    id={id}
                    {...restProps}
                />
            );
        } else if (id === "delete") {
            return (
                <TableEditColumn.Command
                    onExecute={e => {
                        this.setState({
                            commandButtonId: id,
                            dialogVisiblility: true,
                            execute: onExecute
                        });
                    }}
                    id={id}
                    {...restProps}
                />
            );
        }
        return (
            <TableEditColumn.Command
                onExecute={e => {
                    this.setState({ commandButtonId: id }); //add/edit actions
                    onExecute(e);
                }}
                id={id}
                {...restProps}
            />
        );
    }

    changeAddedRows(addedRows) {
        const initialized = addedRows.map(row =>
            Object.keys(row).length
                ? row
                : {
                      name: "Xyzal",
                      doseUnit: "tabl. powl. 5mg",
                      dose: "1x dziennie",
                      start: dayjs().format("YYYY/MM/DD"),
                      ends: dayjs()
                          .add(1, "month")
                          .format("YYYY/MM/DD"),
                      doctor: this.props.user.userData.email
                  }
        );
        this.setState({ addedRows: initialized });
    }

    saveChanges() {
        this.state.execute();
        this.setState({ dialogVisiblility: false, execute: () => {} });
    }

    //add, edit and delete actions
    commitChanges({ added, changed, deleted }) {
        var { rows } = this.state;

        if (added) {
            // //update table
            // const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
            // rows = [
            //     ...rows,
            //     ...added.map((row, index) => ({
            //         id: startingAddedId + index,
            //         ...row
            //     }))
            // ];

            //add doctor email to newly added row
            added[0].doctor = this.props.user.userData.email;

            // add to database
            axios
                .post(`/medications/${this.props.location.state.pesel}/`, added[0])
                .then(res => {
                    store.dispatch({ type: CLEAR_ERRORS });

                    added[0].id = res.data.id;
                    this.setState({
                        errors: res.data.success,
                        rows: [...rows, added[0]]
                    });
                })
                .catch(err => {
                    store.dispatch({ type: SET_ERRORS, payload: err.response.data });
                });
        }
        if (changed) {
            let medId = Object.keys(changed)[0];
            let medData = Object.values(changed)[0];

            if (!medData)
                this.setState({
                    errors: { nodata: "No data changed" }
                });
            else {
                //update table
                rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));

                axios
                    .patch(`/medications/${this.props.location.state.pesel}`, {
                        id: medId,
                        data: medData
                    })
                    .then(res => {
                        this.setState({
                            errors: res.data
                        });
                    })
                    .catch(err => {
                        store.dispatch({ type: SET_ERRORS, payload: err.response.data });
                    });
            }
        }
        if (deleted) {
            //update table view
            const deletedSet = new Set(deleted);
            rows = rows.filter(row => !deletedSet.has(row.id));

            // delete from database
            axios
                .delete(`/medications/${this.props.location.state.pesel}`, {
                    data: { id: deleted[0], email: this.props.user.userData.email }
                })
                .then(res => {
                    store.dispatch({ type: CLEAR_ERRORS });
                    this.setState({
                        errors: res.data
                    });
                })
                .catch(err => {
                    store.dispatch({ type: SET_ERRORS, payload: err.response.data });
                });
        }

        this.setState({ rows });
    }

    hideDialog() {
        this.setState({ dialogVisiblility: false });
    }

    //hide edit and delete button if
    hideActionButtons = props => {
        // if (props.row.doctor !== this.props.user.userData.email )
        if (!props.row.doctor || props.row.doctor === this.props.user.userData.email)
            return <TableEditColumn.Cell {...props} />;
        return <HiddenButtonsCell {...props} />;
    };

    render() {
        const {
            columns,
            rows,
            editingStateColumnExtensions,
            pageSize,
            currentPage,
            errors,
            loading,
            addedRows,
            //
            dialogVisiblility,
            commandButtonId
        } = this.state;

        return (
            <div style={{ textAlign: "center" }}>
                <h1>{this.props.location.state.name}</h1>
                {errors && (
                    <div style={{ textAlign: "center", padding: "10px" }}>
                        {typeof errors === "object" ? (
                            Object.entries(errors).map(([key, value]) => (
                                <Typography key={key} variant="h6" color="error">
                                    {value}
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="h6" color="secondary">
                                {errors}
                            </Typography>
                        )}
                    </div>
                )}
                <Paper style={{ position: "relative" }}>
                    <Grid rows={rows} columns={columns} getRowId={getRowId}>
                        <EditingState
                            onCommitChanges={this.commitChanges}
                            columnExtensions={editingStateColumnExtensions} //disable editing column
                            addedRows={addedRows}
                            onAddedRowsChange={this.changeAddedRows} //add default values on creating new row
                        />
                        <FilteringState defaultFilters={[]} />
                        <IntegratedFiltering />
                        <PagingState
                            currentPage={currentPage}
                            pageSize={pageSize}
                            onCurrentPageChange={this.changeCurrentPage}
                            onPageSizeChange={this.changePageSize}
                        />
                        <IntegratedPaging />
                        <Table />
                        <TableHeaderRow />
                        <TableFilterRow />
                        <TableEditRow />
                        <TableEditColumn
                            showAddCommand
                            cellComponent={this.hideActionButtons}
                            showEditCommand
                            showDeleteCommand
                            commandComponent={this.command}
                        />
                        <PagingPanel />
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)"
                            }}
                        >
                            {loading && <CirularProgress size={50} />}
                        </div>
                    </Grid>
                    <Dialog open={dialogVisiblility} onClose={this.cancelDelete}>
                        <DialogTitle>Save changes</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <strong>{commandButtonId} mode</strong>
                                <br />
                                Are you sure you want to save changes?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.hideDialog} color="primary" variant="outlined">
                                Cancel
                            </Button>
                            <Button onClick={this.saveChanges} color="secondary" variant="outlined">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </div>
        );
    }
}

Medications.propTypes = {
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.user,
    UI: state.UI
});

export default connect(
    mapStateToProps,
    {}
)(withRouter(Medications));
