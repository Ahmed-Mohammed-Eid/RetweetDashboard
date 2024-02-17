import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import axios from 'axios';
import Layout from '../../layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'RETWEET | DASHBOARD',
    description: 'Retweet is a platform where you can buy and sell what you want.',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    icons: {
        icon: '/favicon.svg'
    }
};

export default async function AppLayout({ children }: AppLayoutProps) {

    // SEND A REQUEST TO CHECK IF THE TOKEN IS VALID
    // GET THE TOKEN FROM THE COOKIE
    const token = cookies().get("token");
    const role = cookies().get("role");

    if (!token || !role || role.value !== "admin") {
        // REDIRECT TO THE LOGIN PAGE
        redirect("/login");
    }

    // CHECK IF THE TOKEN IS VALID
    await axios.get(`${process.env.API_URL}/get/verify/token`, {
        params: {
            token: token.value
        }
    }).then((response) => {
        if(!response.data.success) {
            redirect("/login");
        }
    }).catch(() => {
        redirect("/login");
    });

    return <Layout>{children}</Layout>;
}
