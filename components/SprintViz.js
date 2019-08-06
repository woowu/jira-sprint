import {useState, useEffect} from 'react';
import * as d3 from 'd3';
import eventEmitter from 'events';
import extend from 'extend';
import jira from '../lib/jira';
import IssuePanel from './IssuePanel';

function SprintViz()
{
    const issuesGraphId = 'issuesgraph';
    const issuePanelId = 'issuepanel';

    /* provides a means that some operation
     * can force me redraw by resetting 'graph'
     * to null
     */
    var graph = null;

    const [issue, setIssue] = useState(null);
    const width = 800, height = 600;

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
        <div className='container'>
            <div id={issuesGraphId}>
            </div>
            {issue &&
                <div id={issuePanelId}>
                    <IssuePanel issue={issue} />
                </div>
            }
            <style jsx>{`
                .container {
                    padding-left: 5px;
                    padding-top: 5px;
                }
                #issuesgraph {
                    display: inline-block;
                    vertical-align: top;
                }
                #issuepanel {
                    display: inline-block;
                    vertical-align: top;
                    margin-left: 20px;
                }
            `}</style>
        </div>
    );

    function jiraConnParams()
    {
        /* Currently I have to use an agent for the CORS
         * issue.
         */
        const useAgent = true;

        var host, proto, user, password;
        if (useAgent) {
            host = (process.browser ? window.location.hostname : 'localhost') + ':8001';
            proto = 'http';
        } else {
            host = 'acsjira.honeywell.com';
            user = 'h316896', password = 'HON567well';
            proto = 'https';
        }
        return {host, proto, user, password};
    }

    function loadGraph(cb)
    {
        const {host, proto, user, password} = jiraConnParams();
        console.log('jira host ' + host);
        const store = jira(host, {proto, user, password});
        store.sprintGraph('Sprint 11', cb);
    }

    function draw(graph, options, cb)
    {
        const width = options.width;
        const height = options.height;
        const margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 200,
        };
        const w = width - margin.left - margin.right;
        const h = height - margin.top - margin.bottom;

        const assigneeColorScale = d3.scaleOrdinal(d3.schemeBrBG[10])
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

        console.log('start drawing');

        const svg = d3.select(`#${issuesGraphId}`).append('svg')
            .attr('height', height)
            .attr('width', width);
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        d3.forceSimulation(graph.issues)
            .force('link', d3.forceLink(graph.links)
                .id(d => d.key)
                //.distance(l => distanceScale(l.distance))
                //.strength(2)
            )
            .force('X', d3.forceX(d => w/2))
            .force('Y', d3.forceY(d => h/2))
            .force('charge', d3.forceManyBody()
                .strength((d, index) => index == 0
                    ? -1 * radiusScale(d.work) * 20
                    : -issueRadius(d) * 20))
            .force('collide', d3.forceCollide().strength(.1)
                .radius(d => issueRadius(d) + 5)
                .iterations(3))
            .on('tick', ticked)
            .on('end', () => SprintViz.emit('end'));

        const link = g.selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .style('stroke', '#999');
        const node = g.selectAll("circle")
            .data(graph.issues)
            .enter().append("circle")
            .attr('cx', w/2)
            .attr('cy', h/2)
            .attr("r", issueRadius)
            .style("fill", d => assigneeColorScale(d.assignee.key))
            .style("stroke", d => d3.rgb(assigneeColorScale(d.assignee.key))
                .darker())
            .on('click', (d) => SprintViz.emit('issueSelected', d));

        assigneeLegend();

        function ticked()
        {
            node.attr("cx", d => d.x = Math.max(
                    issueRadius(d),
                    Math.min(w - issueRadius(d), d.x)))
                .attr("cy", d => d.y = Math.max(
                    issueRadius(d),
                    Math.min(h - issueRadius(d), d.y)));

            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
        }

        function issueRadius(i)
        {
            return radiusScale(Math.abs(i.work - i .workDelegated));
        }

        function getAssignees(issues)
        {
            const a = [];
            const k = new Set();
            issues.forEach(i => {
                if (! k.has(i.assignee.key)) {
                    k.add(i.assignee.key);
                    a.push(i.assignee);
                }
            });
            return a;
        }

        function assigneeLegend()
        {
            const leftMargin = 5, topMargin = 5, bottomMargin = 5;
            const barHeight = 18, barWidth = 20, borderWidth = 160;
            const assignees = getAssignees(graph.issues);
            const ly = d3.scaleBand().rangeRound([0, barHeight * assignees.length])
                .paddingInner(.15)
                .domain(assignees.map(a => a.key));
            const g = svg.append('g')
                .attr('transform', `translate(${leftMargin}, ${topMargin})`);

            svg.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', borderWidth)
                .attr('height', ly.range()[1] + topMargin + bottomMargin)
                .style('fill', 'none')
                .style('stroke', '#999');

            g.selectAll('.assignee').data(assignees)
                .enter().append('rect')
                    .attr('x', 0)
                    .attr('y', d => ly(d.key))
                    .attr('width', barWidth)
                    .attr('height', ly.bandwidth())
                    .style('fill', d => assigneeColorScale(d.key));
            g.selectAll('.assignee').data(assignees)
                .enter().append('text')
                    .attr('x', barWidth + 10)
                    .attr('y', d => ly(d.key) + 2)
                    .style('text-anchor', 'start')
                    .style('alignment-baseline', 'hanging')
                    .style('font-style', 'italic')
                    .style('font-weight', 'bold')
                    .style('font-size', '12px')
                    .text(d => d.displayName);
        }
    }
}

export default SprintViz;
