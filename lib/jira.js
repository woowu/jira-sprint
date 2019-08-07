import base64 from 'base-64';
import fetch from 'isomorphic-unfetch';
import sampleGraph from './sample-issues-graph';

const offlineTest = false;

const issueFields = {
    storyPoint: 'customfield_11213',
};

const teamAssignee = {
    displayName: 'Team',
    key: '_team_',
};

function jira(host, options)
{
    const proto = options.proto || 'https';
    const user = options.user;
    const password = options.password;
    const basicAuth = 'Basic ' + base64.encode(`${user}:${password}`);
    const httpHeaders = {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
    };

    function agent(url)
    {
        /*
        const agentPrefix = 'http://127.0.0.1:8002/';
        return agentPrefix + url;
        */
        return url;
    }

    function get(url)
    {
        return fetch(agent(url), {
            method: 'GET',
            headers: httpHeaders,
        }).then(resp => {
            return resp.json();
        });
    }

    function post(url, json)
    {
        return fetch(agent(url), {
            method: 'POST',
            headers: httpHeaders,
            body: JSON.stringify(json),
        }).then(resp => {
            return resp.json();
        });
    }

    function loadSprint(sprint)
    {
        const url = `${proto}://${host}/rest/api/2/search`;

        console.log('fetching ' + sprint);
        return post(url, {
            jql: `project=HUDC AND sprint="${sprint}"`,
            maxResults: 1000,
        });
    }

    /*
    function loadUser(key)
    {
        const url = `${proto}://${host}/rest/api/2/user?key=${key}`;
        return get(url).then(u => {
            return {
                key: u.key,
                name: u.name,
                displayName: u.displayName,
                self: u.self,
            };
        });
    }
    function loadIssue(key)
    {
        console.log('fetching issue ' + key);
        const url = `${proto}://${host}/rest/api/2/issue/${key}`;
        return get(url).then(raw => {
            const issue = {};
            issue.id = raw.id;
            issue.key = raw.key;
            issue.self = raw.self;
            issue.name = raw.fields.summary;
            issue.type = raw.fields.issuetype.name;
            issue.works = raw.fields[issueFields.storyPoint];
            return loadUser(raw.fields.assignee.key)
                .then(people => {
                    issue.assignee = people;
                    if (! raw.fields.subtasks || ! raw.fields.subtasks.length) {
                        issue.subtasks = [];
                        return issue;
                    }
                    console.log('** issue ' + raw.key + ' has subtasks');
                    const loadingSubtasks = raw.fields.subtasks.map(
                        task => loadIssue(task.key));
                    return Promise.all(loadingSubtasks).then(issues => {
                        issue.subtasks = issues;
                        console.log('** issue ' + issue.key + ' end loading subtasks');
                        return issue;
                    });
                });
        });
    }
    */

    function mkIssuesGraph(issues, root)
    {
        /* makining the graph as a set of issues and 
         * a set of links is the requirement from
         * D3js.
         */
        const graph = {issues: [], links: []};

        root = {
            id: '-1',
            key: root.key,
            issuetype: root.type,
            work: 0,
            assignee: teamAssignee,
            summary: '',
            self: '',
            size,
            workDelegated,
        };
        graph.issues.push(root);

        issues.forEach(i => {
            const issue = {
                id: i.id,
                key: i.key,
                self: i.self,
                work: i.fields[issueFields.storyPoint],
                issuetype: i.fields.issuetype, 
                assignee: i.fields.assignee ?
                    i.fields.assignee : teamAssignee,
                summary: i.fields.summary,
                size,
                workDelegated,
            };
            if (issue.issuetype.subtask && typeof issue.work != 'number')
                issue.work = 0;
            if (! issue.issuetype.subtask && issue.work > 0)
                root.work += issue.work;
            if (issue.issuetype.subtask || issue.work > 0)
                graph.issues.push(issue);
        });
        issues.forEach(i => {
            const srcKey = i.key;
            const targetKey = i.fields.issuetype.subtask
                ? i.fields.parent.key : root.key;
            const link = {
                source: srcKey,
                target: targetKey,
                s: getIssueByKey(srcKey),
                t: getIssueByKey(targetKey),
            };
            if (link.s && link.t)
                graph.links.push(link);
            else
                console.log('bad link', link);
        });

        console.log(graph);
        return graph;

        function getIssueByKey(key)
        {
            for (var i = 0; i < graph.issues.length; ++i)
                if (graph.issues[i].key == key)
                    return graph.issues[i];
            return null;
        }

        function workDelegated()
        {
            var d = 0;
            graph.links.forEach(l => {
                if (l.t.key == this.key)
                    d += l.s.work;
            });
            return d;
        }
        function size()
        {
            return this.work;
        }
    }

    function sprintGraph(sprintName, cb)
    {
        if (offlineTest)
            cb(null, sampleGraph);
        else
            loadSprint(sprintName).then(sprint => {
                cb(null, sprint.issues
                    ? mkIssuesGraph(sprint.issues,
                        {key: sprintName, type: 'sprint'})
                    : []);
            }).catch(cb);
    }

    return {
        sprintGraph,
    };
}

export default jira;
