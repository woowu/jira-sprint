import base64 from 'base-64';
import fetch from 'isomorphic-unfetch'

function jira(host, options)
{
    const proto = options.proto || 'https';
    const port = options.port || 80;
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
        const agentPrefix = 'http://127.0.0.1:8001/';
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
        const url = `${proto}://${host}:${port}/rest/api/2/search`;

        console.log('fetching ' + sprint);
        return post(url, {
            jql: `project=HUDC AND sprint="${sprint}"`,
            maxResults: 1000,
        }).then(resp => {
            return resp.issues || [];
        });
    }

    function loadIssue(issue)
    {
        console.log('fetching issue ' + issue.key);
        const url = `${proto}://${host}:${port}/rest/api/2/issue/${issue.key}`;
        return get(url).then(resp => {
            return resp;
        });
    }

    function issuesGraph(sprint)
    {
        return issuesOfSprint(sprint).then(issues => {
            const waits = issues.map(i => loadIssue(i));
            return Promise.all(waits).then(issues => {
                issues.forEach(i => {
                    console.log(i.key, i.id, i.fields.issuetype.name,
                        i.fields.customfield_11213);
                });
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
