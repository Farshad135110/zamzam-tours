import React from 'react';
import Head from 'next/head';
import useTranslation from '../src/i18n/useTranslation';

export default function ErrorPage({ statusCode }: { statusCode?: number }) {
  const { t } = useTranslation();
  
  return (
    <>
      <Head>
        <title>{t('error.title')}</title>
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 720, textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>{t('error.heading')}</h1>
          <p style={{ color: '#666', marginBottom: 16 }}>
            {statusCode ? `Server returned status code ${statusCode}` : 'Unexpected error'}
          </p>
          <p style={{ color: '#444' }}>
            {t('error.message')}
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
