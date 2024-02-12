/* eslint-disable @next/next/no-img-element */

import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Categories',
            items: [
                {label: 'Categories List', icon: 'pi pi-fw pi-list', to: '/categories'},
                    {label: 'Add Category', icon: 'pi pi-fw pi-plus', to: '/categories/create'}
            ]
        },
        {
            label: 'Media',
            items: [
                {label: 'SubCategories List', icon: 'pi pi-fw pi-list', to: '/subcategories'},
                {label: 'Add SubCategory', icon: 'pi pi-fw pi-plus', to: '/subcategories/create'}
            ]
        },
        {
            label: 'Settings',
            items: [
                {
                    label: 'LogOut', icon: 'pi pi-sign-out', to: '/login', command: () => {
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
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
