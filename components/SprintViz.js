import {useEffect} from 'react';
import * as d3 from 'd3';
import Jira from '../lib/jira';

//const jiraHost = 'acsjira.honeywell.com';
const jiraHost = 'localhost';
const jiraPort = 8001;
const jiraUser = 'h316896';
const jiraPassword = 'HON567well';
const containerId = 'sprintviz';

function SprintViz()
{
    useEffect(() => {
        d3.select(`#${containerId} > *`).remove();
        draw();
    });
    return (
        <div id={containerId}>
        </div>
    );
}

function draw()
{
    console.log('**001 draw');
    const jira = Jira(jiraHost, {
        /*
        user: jiraUser,
        password: jiraPassword,
        */
        proto: 'http',
        port: jiraPort,
    });
    jira.issuesGraph('Sprint 10').then(graph => {
        console.log('sprint loaded');
    });
}

export default SprintViz;
