import App, { Container } from 'next/app'
import Head from 'next/head'
import React from 'react'

export default class UDCSprint extends App {
    render() {
        const { Component, pageProps } = this.props

        return (
            <Container>
                <Head>
                    <link rel="shortcut icon" href="/static/favicon.png"/>
                    <link href="https://fonts.googleapis.com/css?family=Quicksand"
                        rel="stylesheet"
                    />
                    <link href="https://fonts.googleapis.com/css?family=Raleway"
                        rel="stylesheet"
                    />
                    <title>UDC Sprint</title>
                </Head>
                <Component {...pageProps} />
                <style jsx global>{`
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: 'Quicksand', sans-serif;
                        _xxbackground-color: #f1f3f4;
                        background-color: #1f1f1f;
                    }
                `}</style>
            </Container>
        )
    }
}
