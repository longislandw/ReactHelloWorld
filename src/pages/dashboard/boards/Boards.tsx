import React,{useState} from "react";
import ResizeObserver, {SizeInfo} from 'rc-resize-observer';
import {Layout, Menu, MenuProps, Tabs} from 'antd';
import type {TabsProps} from "antd";
import {siderStyle, contentStyle} from "assets/LayoutStyles";
import PageUserInfo from "./tables/PageUserInfo";

const {Sider, Content } = Layout;

const Board:React.FC = () =>{
    const [tableW, setTableW] = useState<number>(0)
    const [menuKey, setMenuKey] = useState<string>('table')

    function changeWindowWidth(size:SizeInfo){
        console.log(size.width, size.height);
        setTableW(size.width);
    }

    const menuItems: MenuProps['items']=[
        {
            key: 'table',
            label: 'Tables',
        },
        {
            key: 'chart',
            label: 'Charts',
        }
    ]

    const tableItems: TabsProps['items'] = [
        {
            key: '1',
            label: '使用者資料',
            children: <PageUserInfo tableW={tableW}/>,
        },
        {
            key: '2',
            label: '表二',
            // children: <LossInhouseTotal tableW={tableW}/>,
        },
        {
            key: '3',
            label: '表三',
            // children: <LossPDTotal tableW={tableW}/>,
        },
    ];

    const chartItems: TabsProps['items'] = [
        {
            key: '1',
            label: '圖表一',
            // children: </>,
        },
        {
            key: '2',
            label: '圖表二',
            // children: <LossInhouseTotal tableW={tableW}/>,
        },
    ];

    function switchRender(key:string){
        switch (key) {
            case 'table':
                return <Tabs defaultActiveKey="1" items={tableItems} />;
            case 'chart':
                return <Tabs defaultActiveKey="1" items={chartItems} />;
            default:
                return <div>Empty</div>
        }
    }

    return(
    <>
        <Layout hasSider>
            <Sider style={siderStyle}>
                <Menu theme={"dark"} items={menuItems} onSelect={(info)=>{setMenuKey(info.key)}}>
                </Menu>
            </Sider>
            <ResizeObserver onResize={ changeWindowWidth}>
            <Content style={contentStyle}>
                {(switchRender(menuKey))}
            </Content>
            </ResizeObserver>
        </Layout>
    </>
    )
}

export default Board