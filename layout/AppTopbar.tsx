/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/assets/favicon.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>RETWEET</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button ml-auto" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
