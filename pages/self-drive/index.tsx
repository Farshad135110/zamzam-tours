import { GetServerSideProps } from 'next';

export default function SelfDriveRedirect() {
  // This page redirects to the new car-rental frontend
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/car-rental',
      permanent: false,
    },
  };
};
