import userEvent from '@testing-library/user-event';
import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';
import stores from './store';
const user = stores.user;

const App = React.lazy(() => import(/* webpackChunkName: "Home" */ "./pages/home/App"));
const Qr = React.lazy(() => import("./pages/qrCode/index"));
const Scancode = React.lazy(() => import("./pages/scancode"));
const CreateTicket = React.lazy(() => import("./pages/createTicket"));
const ConnectWallet = React.lazy(() => import("./pages/connectWallet"));
const WaitingTicken = React.lazy(() => import("./pages/waitingTicken"));
const GetTicken = React.lazy(() => import("./pages/getTicken"));
const List = React.lazy(() => import("./pages/list"));
const TickenDetail = React.lazy(() => import("./pages/tickenDetail"));

const Invite = React.lazy(() => import("./pages/invite"));
interface RouterConfig {
    path: string;
    title: string;
    component: React.LazyExoticComponent<() => JSX.Element>;
    children?: RouterConfig[]
}
// 主路由
export const mainRouteConfig = [
    {
        path: "/", title: "TokenDance 2022", component: App,
        children: []
    },
    {
        path: "/qrcode", title: "二维码展示", component: Qr,
        children: []
    },
    {
        path: '/scancode', title: "二维码扫描", component: Scancode,
    },
    {
        path: 'createticket', title: "新门票", component: CreateTicket,
    }, {
        path: "/connect", title: "链接钱包", component: ConnectWallet,
        children: []
    }, {
        path: "/waitingticken", title: "等待ticken", component: WaitingTicken,
        children: []
    }, {
        path: "/getticken", title: "邀请函弹窗", component: GetTicken,
        children: []
    },{
        path: "/list", title: "个人页", component: List,
        children: []
    },{
        path: "/detail", title: "点开票", component: TickenDetail,
        children: [],
    },{
        path: '/invite', title: '邀请', component: Invite,
        children: [],
    }
];

const renderRouter = (routerList: RouterConfig[]) => {
    return routerList.map((item) => {
        const { path, children } = item;
        // 补一个鉴权，未登录转到首页
        return <Route
            key={path}
            path={path}
            element={<item.component />}
        >
            {!!children && children.map(i => {
                return <Route
                    key={i.path}
                    path={i.path}
                    element={<i.component />}
                />
            })}
        </Route >;
    })
    
    // @ts-ignore
    if (user.userInfo.address) {
        console.log("11111");
        return routerList.map((item) => {
            const { path, children } = item;
            // 补一个鉴权，未登录转到首页
            return <Route
                key={path}
                path={path}
                element={<item.component />}
            >
                {!!children && children.map(i => {
                    return <Route
                        key={i.path}
                        path={i.path}
                        element={<i.component />}
                    />
                })}
            </Route >;
        })
    } else {
        console.log("2222");
        return <Route
            key="/connect"
            path="/connect"
            element={<ConnectWallet />}
        >
        </Route >;
    }
};




const Routers = () => {
    return (
        <React.Suspense>
            <Routes>
                {renderRouter(mainRouteConfig)}
            </Routes>
        </React.Suspense>
    )
}

export default Routers