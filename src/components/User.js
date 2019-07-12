import React, { Component } from "react";
import { withRouter } from "react-router-dom";

// Material UI stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const styles = {
    card: {
        minWidth: 200,
        // display: "flex",
        margin: "5px 10px 5px 10px",
        textAlign: "center",
        marginBottom: 20
    },
    title: {
        padding: "12px 5px 12px 5px"
    },
    image: {
        minWidth: 100,
        height: 168,
        margin: "auto"
    },
    content: {
        padding: 15,
        objectFit: "cover"
    },
    email: {
        padding: 5
    },
    cardActions: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "10px"
    }
};

class User extends Component {
    handleMedicationOnClick = event => {
        event.preventDefault();

        this.props.history.push({
            pathname: `/medications/${this.props.user.pesel}`,
            // search: `${this.props.user.pesel}`,
            state: { pesel: this.props.user.pesel, name: this.props.user.name }
        });
    };

    handleReceiptsOnClick = event => {
        event.preventDefault();

        this.props.history.push({
            pathname: `/receipts/${this.props.user.pesel}`,
            // search: `${this.props.user.pesel}`,
            state: { pesel: this.props.user.pesel, name: this.props.user.name }
        });
    };

    render() {
        //set witdth of image
        let renderCardWithWidth = widthAsPixel => {
            return (
                <CardMedia
                    style={{ width: widthAsPixel }}
                    className={classes.image}
                    image="https://firebasestorage.googleapis.com/v0/b/med-reminders.appspot.com/o/profileImage.jpg?alt=media&token=442a4587-723f-4258-9a18-0092d947a91b"
                />
            );
        };

        //const classes = this.props.classes;
        const {
            classes,
            user: { name, email, pesel }
        } = this.props;

        // let width = window.screen.availWidth;
        return (
            <Card className={classes.card}>
                <Typography variant="h5" color="primary" className={classes.title}>
                    {name}
                </Typography>
                {/* <CardMedia image={profileImage} title="Profile image" className={classes.image} /> */}
                {/* {width < 720 ? renderCardWithWidth(110) : renderCardWithWidth(150)} */}
                {renderCardWithWidth(150)}
                <CardContent className={classes.content}>
                    <Typography variant="body2" color="textSecondary" className={classes.email}>
                        {email}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {pesel}
                    </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <Button onClick={this.handleMedicationOnClick} color="primary">
                        Medications
                    </Button>
                    <Button onClick={this.handleReceiptsOnClick} color="primary">
                        Receipts
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

export default withStyles(styles)(withRouter(User));
