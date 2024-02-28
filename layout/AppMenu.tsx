/* eslint-disable @next/next/no-img-element */

import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../types/types';

const AppMenu = ({lang, dictionary}: any) => {

    const model: AppMenuItem[] = [
        {
            label: dictionary.sidebar.home.title,
            items: [{ label: dictionary.sidebar.home.dashboard, icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: dictionary.sidebar.categories.title,
            items: [
                {label: dictionary.sidebar.categories.list, icon: 'pi pi-fw pi-list', to: '/categories'},
                    {label: dictionary.sidebar.categories.create, icon: 'pi pi-fw pi-plus', to: '/categories/create'}
            ]
        },
        {
            label: dictionary.sidebar.subcategories.title,
            items: [
                {label: dictionary.sidebar.subcategories.list, icon: 'pi pi-fw pi-list', to: '/subcategories'},
                {label: dictionary.sidebar.subcategories.create, icon: 'pi pi-fw pi-plus', to: '/subcategories/create'}
            ]
        },
        {
            label: dictionary.sidebar.items.title,
            items: [
                {label: dictionary.sidebar.items.create, icon: 'pi pi-fw pi-plus', to: '/items/create'}
            ]
        },
        {
            label: dictionary.sidebar.ads.title,
            items: [
                {label: dictionary.sidebar.ads.list, icon: 'pi pi-fw pi-list', to: '/ads'},
                {label: dictionary.sidebar.ads.carouselAds, icon: 'pi pi-fw pi-plus', to: '/ads/carousel'},
                {label: dictionary.sidebar.ads.create, icon: 'pi pi-fw pi-plus', to: '/ads/create'}
            ]
        },
        {
            label: dictionary.sidebar.settings.title,
            items: [
                {
                    label: dictionary.sidebar.settings.logout, icon: lang === 'en' ? 'pi pi-sign-out' : 'pi pi-sign-in', to: '/login', command: () => {
                        // Clear local storage
                        localStorage.clear();
                        // Clear Cookies
                        document.cookie.split(";").forEach((c) => {
                            document.cookie = c
                                .replace(/^ +/, "")
                                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                        });
                        // Redirect to login page
                        window.location.href = '/login';
                    },
                },
            ]
        }
    ];

    return (
        <MenuProvider dictionary={dictionary} lang={lang}>
            <ul className="layout-menu" dir={lang === "ar" ? 'rtl' : 'ltr'}>
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
