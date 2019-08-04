import {useState, useEffect} from 'react';
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
const issuePanelId = 'issuepanel';

function SprintViz()
{
    /* provides a means that some operation
     * can force me redraw by resetting 'graph'
     * to null
     */
    var graph = null;

    const [issue, setIssue] = useState(null);
    const width = 800, height = 800;

    useEffect(() => {
        d3.select(`#${issuesGraphId} > *`).remove();
        loadGraph((err, g) => {
            graph = g;
            if (err) return console.error(err);
            draw(graph, {
                width,
                height,
            }, () => {
                console.log('** end drawing');
                setIssue('someIssue');
            });
        });
    }, [graph]);

    return (
        <div>
            <div id={issuesGraphId}>
            </div>
            {issue &&
                <div id={issuePanelId}>
                    <p>hello issue!</p>
                </div>
            }
            <style jsx>{`
                #issuesgraph {
                    display: inline-block;
                    width: 800px;
                    height: 600px;
                    vertical-align: top;
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

function draw(graph, options, cb)
{
    const width = options.width || 800;
    const height = options.height || 600;
    const fill = d3.scaleOrdinal(d3.schemeBrBG[10]);
    const radiusScale = d3.scaleSqrt()
        .range([2, 30])
        .domain(d3.extent(graph.issues, i => i.work));
    fill.domain(d3.extent(graph.issues, i => i.assignee.key));

    const issueRadius = i =>
        Math.abs(typeof i.workRemained == 'number' ? radiusScale(i.workRemained)
            : radiusScale(i.work));

    const svg = d3.select(`#${issuesGraphId}`).append('svg')
        .attr('height', height)
        .attr('width', width);
    /*
    graph.issues[0].fx = width/2;
    graph.issues[0].fy = height/2;
    */
    d3.forceSimulation(graph.issues)
        .force('gravity', d3.forceManyBody().strength(.05))
        .force('charge', d3.forceManyBody().strength(-240))
        .force('link', d3.forceLink(graph.links)
            .id(d => d.key)
            .distance(l => 60)
            .strength(2))
        .force('centerX', d3.forceX(d =>
                d.issueType == 'Sprint' ? width/2 : d.x))
        .force('centerY', d3.forceX(d =>
                d.issueType == 'Sprint' ? height/2 : d.y))
        .on('tick', ticked)
        .on('end', cb);

    const link = svg.selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .style('stroke', '#999');
    const node = svg.selectAll("circle")
        .data(graph.issues)
        .enter().append("circle")
        .attr("r", issueRadius)
        .style("fill", d => fill(d.assignee.key))
        .style("stroke", d => d3.rgb(fill(d.assignee.key)).darker());

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
