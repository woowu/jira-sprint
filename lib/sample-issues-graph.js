const issuesGraph = {
    issues: [
        {
            key: 'Sprint 10',
            id: '-1',
            work: 53,
            workRemained: 0,
            issueType: 'Sprint',
            assignee: {
                key: '_team',
                displayName: 'Team',
            },
        },
        {
            key: 'HUDC-123',
            id: '123',
            work: 3,
            workRemained: 2.5,
            issueType: 'Story',
            assignee: {
                key: 'h123223',
                displayName: 'Lulu Yang',
            },
        },
        {
            key: 'HUDC-632',
            id: '632',
            work: 13,
            workRemained: 9.5,
            issueType: 'Story',
            assignee: {
                key: 'h123225',
                displayName: 'Christian Ile',
            },
        },
        {
            key: 'HUDC-570',
            id: '32910',
            work: 8,
            workRemained: 8,
            issueType: 'Story',
            assignee: {
                key: 'h123226',
                displayName: 'Miche Bruce',
            },
        },
        {
            key: 'HUDC-35',
            id: '33987',
            work: 8,
            workRemained: 8,
            issueType: 'Story',
            assignee: {
                key: 'h123227',
                displayName: 'Junie Robertz',
            },
        },
        {
            key: 'HUDC-135',
            id: '273287',
            work: 5,
            workRemained: 4,
            issueType: 'Story',
            assignee: {
                key: 'h123227',
                displayName: 'Junie Robertz',
            },
        },
        {
            key: 'HUDC-139',
            id: '273287',
            work: 3,
            workRemained: 3,
            issueType: 'Story',
            assignee: {
                key: 'h123229',
                displayName: 'Junie Robertz',
            },
        },
        {
            key: 'HUDC-138',
            id: '273000',
            work: 13,
            workRemained: 13,
            issueType: 'Story',
            assignee: {
                key: 'h123226',
                displayName: 'Miche Bruce',
            },
        },
        {
            key: 'HUDC-225',
            id: '2732087',
            work: 1, 
            issueType: 'Sub-Task',
            assignee: {
                key: '_team',
                displayName: 'Not Assigned',
            },
        },
        {
            key: 'HUDC-226',
            id: '1130007',
            work: 0.5,
            issueType: 'Sub-Task',
            assignee: {
                key: 'h123227',
                displayName: 'Junie Robertz',
            },
        },
        {
            key: 'HUDC-227',
            id: '1022697',
            work: 2.5,
            issueType: 'Sub-Task',
            assignee: {
                key: 'h123227',
                displayName: 'Junie Robertz',
            },
        },
        {
            key: 'HUDC-228',
            id: '33323',
            work: 2,
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
        {source: 'HUDC-139', target: 'Sprint 10'},
        {source: 'HUDC-138', target: 'Sprint 10'},
        {source: 'HUDC-135', target: 'Sprint 10'},
    ],
};

export default issuesGraph;
