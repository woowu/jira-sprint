import {useEffect} from 'react';
import * as d3 from 'd3';
import jira from '../lib/jira';

/* Currently I have to use an agent for the CORS
 * issue.
 */
const useAgent = true;

var jiraHost, jiraUser, jiraPassword;
if (useAgent)
    jiraHost = 'localhost:8001';
else {
    jiraHost = 'acsjira.honeywell.com';
    jiraUser = 'h316896', jiraPassword = 'HON567well';
}
const issuesGraphId = 'issuesgraph';

function SprintViz()
{
    useEffect(() => {
        d3.select(`#${issuesGraphId} > *`).remove();
        loadGraph((err, graph) => {
            if (err)
                console.error(err);
            else
                draw(graph);
        });
    });
    return (
        <div id={issuesGraphId}>
        </div>
    );
}

function loadGraph(cb)
{
    var store;
    if (useAgent)
        store = jira(jiraHost, {
            proto: 'http',
        });
    else
        store = jira(jiraHost, {
            user: jiraUser,
            password: jiraPassword,
            proto: 'https',
        });
    store.issuesGraph('Sprint 10', cb);
}

function draw(graph)
{
    console.log('** drawing', graph.issues);
    const width = 800;
    const height = 600;
    const fill = d3.scaleOrdinal(d3.schemeBrBG[11]);
    const radius = 6;
    /*
    const radius = d3.scaleSqrt()
        .range([5, 35])
        .domain(d3.extent(graph.issues, i => i.storyPoints));
    */
    fill.domain(d3.extent(graph.issues, i => i.assignee.key));

    const svg = d3.select(`#${issuesGraphId}`).append('svg')
        .attr('height', height)
        .attr('width', width);
    const simulation = d3.forceSimulation(graph.issues)
        .force('gravity', d3.forceManyBody().strength(.05))
        .force('charge', d3.forceManyBody().strength(-240))
        .force('link', d3.forceLink(graph.links)
            .id(d => d.key)
            .distance(l => 50)
            .strength(2))
        .on('tick', ticked);

    const link = svg.selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .style('stroke', '#999');
    const node = svg.selectAll("circle")
        .data(graph.issues)
        .enter().append("circle")
        .attr("r", d => {
            return radius;
            /*
            console.log(radius(d.storyPoints));
            return radius(d.storyPoints);
            */
        })
        .style("fill", d => fill(d.assignee.key))
        .style("stroke", d => d3.rgb(fill(d.assignee.key)).darker());

    function ticked()
    {
        node.attr("cx", d => d.x = Math.max(
                radius, Math.min(width - radius, d.x)))
            .attr("cy", d => d.y = Math.max(
                radius, Math.min(height - radius, d.y)));

        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    }
}

export default SprintViz;
