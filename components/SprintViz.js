import {useEffect} from 'react';
import * as d3 from 'd3';
import Jira from '../lib/jira';

const jiraHost = 'localhost:8001';
/*
const jiraHost = 'acsjira.honeywell.com';
const jiraUser = 'h316896', jiraPassword = 'HON567well';
*/
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
    const jira = Jira(jiraHost, {
        /*
        user: jiraUser,
        password: jiraPassword,
        proto: 'https',
        */
        proto: 'http',
    });
    jira.issuesGraph('Sprint 10').then(graph => {
        console.log('sprint loaded', graph);
    });
}

export default SprintViz;
