import Layout from '../components/Layout';
import SprintViz from '../components/SprintViz';

function Index(props)
{
    var sprintInfoListener;

    function onSprintLoaded(sprintInfo)
    {
        if (sprintInfoListener)
            sprintInfoListener(sprintInfo);
    }

    function regSprintInfoListener(cb)
    {
        sprintInfoListener = cb;
    }

    return (
        <Layout regSprintInfoListener={regSprintInfoListener}>
            <SprintViz sprintName='Sprint 11' onSprintLoaded={onSprintLoaded}/>
        </Layout>
    );
}

export default Index;
