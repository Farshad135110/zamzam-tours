import React from 'react';
import Head from 'next/head';

export default function ErrorPage({ statusCode }: { statusCode?: number }) {
  return (
    <>
      <Head>
        <title>Something went wrong</title>
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 720, textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>An error occurred</h1>
          <p style={{ color: '#666', marginBottom: 16 }}>
            {statusCode ? `Server returned status code ${statusCode}` : 'Unexpected error'}
          </p>
          <p style={{ color: '#444' }}>
            Try refreshing the page. If the problem persists, check the dev server terminal for the full stack trace.
          </p>
        </div>
      </div>
    </>
  );
}

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
