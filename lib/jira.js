import base64 from 'base-64';
import fetch from 'isomorphic-unfetch';
import sampleGraph from './sample-issues-graph';

const offlineTest = true;

const issueFields = {
    storyPoint: 'customfield_11213',
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

    function issuesOfSprint(sprint)
    {
        const url = `${proto}://${host}/rest/api/2/search`;

        console.log('fetching ' + sprint);
        return post(url, {
            jql: `project=HUDC AND sprint="${sprint}"`,
            maxResults: 1000,
        }).then(resp => {
            return resp.issues || [];
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

    function mkGraph(issues)
    {
        const graph = {issues: [], links: []};
        issues.forEach(issue => {
        });
    }

    function issuesGraph(sprint, cb)
    {
        if (offlineTest)
            cb(null, sampleGraph);
        else
            issuesOfSprint(sprint).then(issues => {
                const waits = issues.map(i => loadIssue(i.key));
                Promise.all(waits).then(issues => {
                    cb(null, issues);
                }).catch(err => {
                    console.error(err);
                });
            }).catch(cb);
    }

    return {
        issuesGraph,
    };
}

export default jira;
