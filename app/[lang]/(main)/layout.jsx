import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import axios from 'axios';
import Layout from '../../../layout/layout';
import {getDictionary} from '../../dictionaries/dictionaries';


export const metadata = {
    title: 'RETWEET | DASHBOARD',
    description: 'Retweet is a platform where you can buy and sell what you want.',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    icons: {
        icon: '/assets/favicon.svg'
    }
};

export default async function AppLayout({ children, params: {lang} }) {

    // GET THE DICTIONARY
    const dictionary = await getDictionary(lang);

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

    return <Layout dictionary={dictionary} lang={lang}>{children}</Layout>;
}
