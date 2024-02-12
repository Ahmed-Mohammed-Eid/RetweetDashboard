'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import { Toaster } from 'react-hot-toast';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/globals.scss';

interface RootLayoutProps {
    children: React.ReactNode;
}


export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider>
                    <LayoutProvider>
                        {children}
                        <Toaster
                            position="bottom-right"
                        />
                    </LayoutProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
