import React, { Component } from "react";
import { withRouter } from "react-router-dom";

//MUI and devexpress
import Paper from "@material-ui/core/Paper";
import { EditingState } from "@devexpress/dx-react-grid";
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn
} from "@devexpress/dx-react-grid-material-ui";

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
            ]
        };
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <h1>{this.props.location.state.name}</h1>
            </div>
        );
    }
}

export default withRouter(Medications);
