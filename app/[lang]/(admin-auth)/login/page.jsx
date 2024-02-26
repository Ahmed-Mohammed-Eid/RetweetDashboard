import LoginContent from '../components/LoginContent/LoginContent';

export const metadata = {
    title: 'RETWEET | LOGIN',
    description: 'Retweet is a platform where you can buy and sell what you want.',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    icons: {
        icon: '/favicon.svg'
    }
};
const LoginPage = () => {

    return (
        <LoginContent/>
    );
};

export default LoginPage;
