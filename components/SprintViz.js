import {useState, useEffect} from 'react';
import * as d3 from 'd3';
import eventEmitter from 'events';
import extend from 'extend';
import jira from '../lib/jira';
import IssuePanel from './IssuePanel';

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
const issuePanelId = 'issuepanel';

function SprintViz()
{
    /* provides a means that some operation
     * can force me redraw by resetting 'graph'
     * to null
     */
    var graph = null;

    const [issue, setIssue] = useState(null);
    const width = 500, height = 500;

    extend(SprintViz, new eventEmitter());
    SprintViz.on('issueSelected', (issue) => {
        console.log('issue clicked');
        setIssue(issue);
    });
    SprintViz.on('end', () => {console.log('draw ended');});

    useEffect(() => {
        d3.select(`#${issuesGraphId} > *`).remove();
        loadGraph((err, g) => {
            graph = g;
            if (err) return console.error(err);
            draw(graph, {width, height});
        });
    }, [graph]);

    return (
        <div>
            <div id={issuesGraphId}>
            </div>
            {issue &&
                <div id={issuePanelId}>
                    <IssuePanel issue={issue} />
                </div>
            }
            <style jsx>{`
                #issuesgraph {
                    display: inline-block;
                    height: 500px;
                    vertical-align: top;
                    border: 2px solid #777;
                }
                #issuepanel {
                    display: inline-block;
                    width: 100;
                    vertical-align: top;
                }
            `}</style>
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

function calcLinkDistance(links)
{
    links.forEach(l => {
        l.distance = links.reduce((acc, curr) =>
            acc + (curr.target == l.target ? 1 : 0), 0);
    });
}

function draw(graph, options, cb)
{
    console.log('** start drawing');
    const width = options.width || 800;
    const height = options.height || 800;
    const fill = d3.scaleOrdinal(d3.schemeBrBG[10])
        .domain(d3.extent(graph.issues, i => i.assignee.key));
    const radiusScale = d3.scaleSqrt()
        .range([2, 80])
        .domain([0, graph.issues.reduce((max, value) =>
            value.work > max ? value.work : max, 0)]);
    /*
    const distanceScale = d3.scaleLinear()
        .range([20, 80])
        .domain(d3.extent(graph.links, l => l.distance));
    */

    const issueRadius = i =>
        Math.abs(typeof i.workRemained == 'number' ? radiusScale(i.workRemained)
            : radiusScale(i.work));

    const svg = d3.select(`#${issuesGraphId}`).append('svg')
        .attr('height', height)
        .attr('width', width);
    d3.forceSimulation(graph.issues)
        .force('link', d3.forceLink(graph.links)
            .id(d => d.key)
            //.distance(l => distanceScale(l.distance))
            //.strength(2)
        )
        .force('X', d3.forceX(d => width/2))
        .force('Y', d3.forceY(d => height/2))
        .force('charge', d3.forceManyBody()
            .strength((d, index) => index == 0
                ? -1 * radiusScale(d.work) * 20
                : -issueRadius(d) * 20))
        .force('collide', d3.forceCollide().strength(.1)
            .radius(d => issueRadius(d) + 5)
            .iterations(3))
        .on('tick', ticked)
        .on('end', () => SprintViz.emit('end'));

    const link = svg.selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .style('stroke', '#999');
    const node = svg.selectAll("circle")
        .data(graph.issues)
        .enter().append("circle")
        .attr('cx', width/2)
        .attr('cy', height/2)
        .attr("r", issueRadius)
        .style("fill", d => fill(d.assignee.key))
        .style("stroke", d => d3.rgb(fill(d.assignee.key)).darker())
        .on('click', (d) => SprintViz.emit('issueSelected', d));

    function ticked()
    {
        node.attr("cx", d => d.x = Math.max(
                issueRadius(d),
                Math.min(width - issueRadius(d), d.x)))
            .attr("cy", d => d.y = Math.max(
                issueRadius(d),
                Math.min(height - issueRadius(d), d.y)));

        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    }
}

export default SprintViz;
