import {Component} from 'react';

function Layout(props)
{
    return (
        <div id='root'>
            <header className='appHeader'>
                <div id='icon' className='vertical-center'><img src='/static/sprint-trans.png'
                        width='60px' height='60px'/>
                </div>
                <div className='appTitle vertical-center'><p>Let's Sprint</p></div>
            </header>
            {props.children}
            <style jsx>{`
                .appHeader {
                    position: relative;
                    background-color: #a3a3a3;
                    padding: 10px;
                    color: #b24e00;
                    height: 85px;
                }
                #icon {
                    display: inline-block;
                }
                .appTitle {
                    display: inline-block;
                    font-size: 2em;
                    font-weight: bold;
                    left: 120px;
                }
                .vertical-center {
                  position: absolute;
                  margin: 0;
                  top: 50%;
                  -ms-transform: translateY(-50%);
                  transform: translateY(-50%);
                }
            `}</style>
        </div>
    );
}

export default Layout;
