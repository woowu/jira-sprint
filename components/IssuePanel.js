import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
      card: {
              minWidth: 275,
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
          width: '30em',
          wordWrap: 'word-wrap',
      },
});

function IssuePanel(props)
{
    console.log('in subcomponent', props.issue);
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <Card className={classes.card}>
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
                        As a developer, I want to see work-distribution
                        in a story more clearly so than I can have a
                        better and more instantly feeling of the progress
                        and objectivitie
                    </Typography>
                </div>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}

export default IssuePanel;
