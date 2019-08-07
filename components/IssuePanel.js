import * as d3 from 'd3';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { red, green, blue } from '@material-ui/core/colors';

function IssuePanel(props)
{
    const issue = props.issue;
    const issueTypeChar = {
        'Sub-Task': 'ST',
        'Story': 'S',
        'Task': 'T',
        'Defect': 'D',
        'Epic': 'E',
    };
    var tc = issueTypeChar[issue.issuetype.name];
    if (! tc) tc = 'I';

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
        avatar: {
            backgroundColor: issue.color,
            color: reverseColor(issue.color),
        },
        requirement: {
            fontWeight: 'bold',
            fontStyle: 'italic',
            color: red[300],
        },
    });
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const summary = formatSummary(issue.summary);

    return (
        <Card className={classes.card} raised={true}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {tc}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={issue.status}
                subheader={issue.created.toLocaleString()}
            />
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {issue.issuetype.name}
                </Typography>
                <Typography variant="h5" component="h2">
                    {issue.key}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    {issue.workEst} {bull} {issue.remainedWork()} Points
                </Typography>
                <div className={classes.summary}>
                    <Typography variant="body2" component="p">
                        {summary[0]}{summary[1]}{summary[2]}
                    </Typography>
                </div>
            </CardContent>
            <CardActions>
                <Button size="small" href={issueLink(issue)} target='_blank'>
                    Learn More
                </Button>
            </CardActions>
        </Card>
    );

    function issueLink(issue)
    {
        const m = issue.self.match(/(http.?):\/\/([^/]+).*/);
        return m ? m[1] + '://' + m[2] + '/browse/' + issue.key : '';
    }
    function formatSummary(str)
    {
        var m;
        if (m = str.match(/\[.*\](.*)/))
            str = m[1].trim();
        if (m = str.match(/(.*I [^,]* to )([^,]+)(.*)/)) {
            return [
                m[1],
                <span className={classes.requirement}>{m[2]}</span>,
                m[3],
            ];
        } else
            return ['', str, ''];
    }
}

function reverseColor(color)
{
    const rgb = d3.rgb(color);
    const comp = d3.rgb(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
    return comp.hex();
}

export default IssuePanel;
