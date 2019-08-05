function IssuePanel(props)
{
    console.log('in subcomponent', props.issue);
    return (
        <p>Hello Issue</p>
    );
}

export default IssuePanel;
