const issuesGraph = {
    issues: [
        {
            key: 'Sprint 10',
            id: '-1',
            storyPoints: 50,
            issueType: 'Sprint',
            assignee: {
                key: '_team',
                displayName: 'Team',
            },
        },
        {
            key: 'HUDC-123',
            id: '123',
            storyPoints: 3,
            issueType: 'Story',
            assignee: {
                key: 'h123223',
                displayName: 'Lulu Yang',
            },
        },
        {
            key: 'HUDC-632',
            id: '632',
            storyPoints: 13,
            issueType: 'Story',
            assignee: {
                key: 'h123225',
                displayName: 'Christian Ile',
            },
        },
        {
            key: 'HUDC-570',
            id: '32910',
            storyPoints: 8,
            issueType: 'Story',
            assignee: {
                key: 'h123226',
                displayName: 'Miche Bruce',
            },
        },
        {
            key: 'HUDC-35',
            id: '33987',
            storyPoints: 8,
            issueType: 'Story',
            assignee: {
                key: 'h123227',
                displayName: 'Junie Robertz',
            },
        },
        {
            key: 'HUDC-135',
            id: '273287',
            storyPoints: 8,
            issueType: 'Story',
            assignee: {
                key: 'h123227',
                displayName: 'Junie Robertz',
            },
        },
        {
            key: 'HUDC-225',
            id: '2732087',
            storyPoints: 1, 
            issueType: 'Sub-Task',
            assignee: {
                key: 'not-assigned',
                displayName: 'Not Assigned',
            },
        },
        {
            key: 'HUDC-226',
            id: '1130007',
            storyPoints: 0.5,
            issueType: 'Sub-Task',
            assignee: {
                key: 'h123227',
                displayName: 'Junie Robertz',
            },
        },
        {
            key: 'HUDC-227',
            id: '1022697',
            storyPoints: 2.5,
            issueType: 'Sub-Task',
            assignee: {
                key: 'h123227',
                displayName: 'Junie Robertz',
            },
        },
        {
            key: 'HUDC-228',
            id: '33323',
            storyPoints: 2,
            issueType: 'Sub-Task',
            assignee: {
                key: 'not-assigned',
                displayName: 'Not Assigned',
            },
        },
    ],
    links: [
        {source: 'HUDC-226', target: 'HUDC-123'},
        {source: 'HUDC-227', target: 'HUDC-632'},
        {source: 'HUDC-228', target: 'HUDC-632'},
        {source: 'HUDC-225', target: 'HUDC-135'},
        {source: 'HUDC-123', target: 'Sprint 10'},
        {source: 'HUDC-632', target: 'Sprint 10'},
        {source: 'HUDC-570', target: 'Sprint 10'},
        {source: 'HUDC-35', target: 'Sprint 10'},
        {source: 'HUDC-135', target: 'Sprint 10'},
    ],
};

export default issuesGraph;
