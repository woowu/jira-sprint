import base64 from 'base-64';
import fetch from 'isomorphic-unfetch'

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

    function loadUser(link)
    {
        const url = `${proto}://${host}${link.replace(/^.*:\/\/[^/]+/g, '')}`;
        console.log(url);
        return get(url).then(res => {
            return {
                key: res.key,
                name: res.name,
                displayName: res.displayName,
                self: res.self,
            };
        });
    }

    function loadIssue(issue)
    {
        console.log('fetching issue ' + issue.key);
        const url = `${proto}://${host}/rest/api/2/issue/${issue.key}`;
        return get(url).then(res => {
            issue = {};
            issue.id = res.id;
            issue.key = res.key;
            issue.self = res.self;
            issue.name = res.fields.summary;
            issue.type = res.fields.issuetype.name;
            issue.works = res.fields[issueFields.storyPoint];
            return loadUser(res.fields.assignee.self)
                .then(people => {
                    issue.assignee = people;
                    return issue;
                });
        });
    }

    function mkGraph(issues)
    {
        const graph = {issues: [], links: []};
        issues.forEach(issue => {
        });
    }

    function issuesGraph(sprint)
    {
        return issuesOfSprint(sprint).then(issues => {
            console.log('**001', issues);
            const waits = issues.map(i => loadIssue(i));
            return Promise.all(waits).then(issues => {
                return issues;
            }).catch(err => {
                console.error(err);
            });
        }).catch(err => {
            console.error(err);
            throw err;
        });
    }

    return {
        issuesGraph,
    };
}

export default jira;
