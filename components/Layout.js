import {Component, useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';

const useStyles = makeStyles(theme => ({
    appHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#5a3d5c',
        padding: '10px',
    },
    sprint: {
        margin: theme.spacing(2),
    },
    icon: {
        marginRight: '10px',
    },
    logoArea: {
        display: 'flex',
        justifyContent: 'start',
        verticalAlign: 'middle',
    },
    appTitle: {
        marginRight: '60px',
        fontSize: '1.8em',
        fontWeight: 'bold',
        color: '#b24e00',
    },
    prjName: {
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#b7b7b7',
        verticalAlign: 'middle',
        marginTop: '25px',
    },
}));

function Layout(props)
{
    const [sprintInfo, setSprintInfo] = useState({prjName: '', sprintName: ''});

    function onSprintInfoLoaded(sprintInfo)
    {
        console.log(sprintInfo);
        setSprintInfo(sprintInfo);
    }

    props.regSprintInfoListener(onSprintInfoLoaded);

    var m, sprintNum = 0;
    if (m = sprintInfo.sprintName.match(/[^\d]*([0-9]+).*/))
        sprintNum = +m[1];

    const classes = useStyles();
    return (
        <div id='root'>
            <header className='appHeader'>
                <div className='logoArea'>
                    <div className='icon'><img src='/static/sprint-trans.png'
                            width='60px'/>
                    </div>
                    <div className='appTitle'>
                        <Badge className={classes.sprint} badgeContent={sprintNum} color="secondary">
                            Let's Sprint
                        </Badge>
                    </div>
                </div>
                <div className='prjName'>{sprintInfo.prjName}</div>
            </header>
            {props.children}
            <style jsx>{`
                .appHeader {
                    display: flex;
                    justify-content: space-between;
                    background-color: #5a3d5c;
                    padding: 10px;
                }
                .logoArea {
                    display: flex;
                    justify-content: start;
                }
                .prjName {
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #b7b7b7;
                    margin-top: 25px;
                }
                .icon {
                    margin-right: 10px;
                }
                .appTitle {
                    margin-right: 60px;
                    font-size: 1.8em;
                    font-weight: bold;
                    color: #b24e00;
                }
            `}</style>
        </div>
    );
}

export default Layout;
