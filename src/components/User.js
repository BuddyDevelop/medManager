import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

// Material UI stuff
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const styles = {
    card: {
        display: "flex",
        marginBottom: 20
    },
    image: {
        minWidth: 150,
        height: 168
    },
    content: {
        padding: 15,
        objectFit: "cover"
    },
    cardActions: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "16px"
    }
};

class User extends Component {
    render() {
        //const classes = this.props.classes;
        const {
            classes,
            user: { name, email, pesel }
        } = this.props;
        let profileImage =
            "https://firebasestorage.googleapis.com/v0/b/med-reminders.appspot.com/o/profileImage.jpg?alt=media&token=442a4587-723f-4258-9a18-0092d947a91b";

        return (
            <Card className={classes.card}>
                <CardMedia image={profileImage} title="Profile image" className={classes.image} />
                <CardContent className={classes.content}>
                    <Typography variant="h5" color="secondary">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {email}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {pesel}
                    </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <Button>Medications</Button>
                    <Button>Receipts</Button>
                </CardActions>
            </Card>
        );
    }
}

export default withStyles(styles)(User);
