import Layout from '../components/Layout';
import SprintViz from '../components/SprintViz';
//import Jira from '../lib/jira';

function Index(props)
{
    return (
        <Layout>
            <SprintViz />
        </Layout>
    );
}

var loadLock = false;

Index.getInitialProps = async () => {
    if (loadLock) return {};
    loadLock = true;
    /*
    const jira = Jira('acsjira.honeywell.com', {
        user: 'h316896',
        password: 'HON567well',
    });
    const result = await jira.issuesGraph('Sprint 10');
    */
    loadLock = false;
    return {};
};

export default Index;
