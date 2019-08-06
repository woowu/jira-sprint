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

    function getIssueByKey(issues, key)
    {
        for (var i = 0; i < issues.length; ++i)
            if (issues[i].key == key)
                return issues[i];
        return null;
    }

    function mkIssuesGraph(issues, root)
    {
        const graph = {issues: [], links: []};
        const links = [];

        root = {
            id: '-1',
            key: root.key,
            issuetype: root.type,
            work: 0,
            workDelegated: 0,
            assignee: teamAssignee,
        };
        graph.issues.push(root);

        for (var i = 0; i < issues.length; ++i) {
            const issue = {
                id: issues[i].id,
                key: issues[i].key,
                self: issues[i].self,
                work: issues[i].fields[issueFields.storyPoint],
                issuetype: issues[i].fields.issuetype, 
                assignee: issues[i].fields.assignee ?
                    issues[i].fields.assignee : teamAssignee,
            };
            if (issue.issuetype.subtask && typeof issue.work != 'number')
                issue.work = 0;
            if (! issue.issuetype.subtask && ! issue.work)
                continue;
            issue.workDelegated = 0;
            if (! issue.issuetype.subtask)
                root.work += issue.work;

            const link = {
                source: issue.key,
                target: issue.issuetype.subtask ? issues[i].fields.parent.key : root.key,
            };
            links.push(link);
            graph.issues.push(issue);
        }

        links.forEach(l => {
            const source = getIssueByKey(graph.issues, l.source);
            const target = getIssueByKey(graph.issues, l.target);
            if (target) {
                target.workDelegated += source.work;
                graph.links.push(l);
            }
        });

        console.log(graph);
        return graph;
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
