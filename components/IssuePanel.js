import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    card: {
        minWidth: 300,
        backgroundColor: '#f2f1f1',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    summary: {
        width: '22em',
        wordWrap: 'word-wrap',
    },
});

function IssuePanel(props)
{
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <Card className={classes.card} raised={true}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {props.issue.issueType}
                </Typography>
                <Typography variant="h5" component="h2">
                    {props.issue.key}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    {props.issue.workRemained == undefined ?
                        props.issue.work : props.issue.workRemained} Points
                </Typography>
                <div className={classes.summary}>
                    <Typography variant="body2" component="p">
                        {props.issue.summary}
                    </Typography>
                </div>
            </CardContent>
            <CardActions>
                <Button size="small" href={issueLink(props.issue)} target='_blank'>
                    Learn More
                </Button>
            </CardActions>
        </Card>
    );

    function issueLink(issue)
    {
        const m = issue.self.match(/(http.?):\/\/([^/]+).*/);
        console.log(m ? m[1] + '://' + m[2] + '/browse/' + issue.key : '');
        return m ? m[1] + '://' + m[2] + '/browse/' + issue.key : '';
    }
}

export default IssuePanel;
