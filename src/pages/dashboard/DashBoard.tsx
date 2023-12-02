import {NavLink, Outlet} from "react-router-dom";
import * as React from "react";
import {ConfigProvider, Layout, Menu} from "antd";
import {HomeOutlined, AreaChartOutlined, BugOutlined} from "@ant-design/icons";
import {headerStyle, footerStyle} from "../../assets/LayoutStyles";

// const { Header,Sider, Footer, Content } = Layout;
const { Header, Footer} = Layout;

export const menuStyle: React.CSSProperties = {

    textAlign: 'center',
    // lineHeight: '120px',
    color: '#2c0101',
    // fontSize: 30,
    // fontWeight: "bold",
    backgroundColor: 'rgba(255,255,255,0.75)',
};

const DashBoard:React.FC = () =>{
    return(
        <Layout style={{minHeight: "100vh", width: "100%"}}>
            <ConfigProvider
                theme={{
                    components:{
                        Menu:{
                            // itemSelectedColor:'#ef0b0b',
                            // darkItemSelectedBg: '#ef0b0b',
                            horizontalItemHoverColor: '#efd10b',
                            horizontalItemSelectedColor: '#e00000',
                            // horizontalItemSelectedBg: '#ef0b0b',
                        }
                    },
                }}>
            <Header style={headerStyle}>
                <Menu
                    style={menuStyle}
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <HomeOutlined />,
                            label: <NavLink to="/">Home</NavLink>,
                        },
                        {
                            key: '2',
                            icon: <AreaChartOutlined />,
                            label: <NavLink to="/boards">Tables/Charts</NavLink>,
                        },
                        {
                            key: '3',
                            icon: <BugOutlined />,
                            label: <NavLink to="/bar">Bar/TestPage</NavLink>,
                        },
                    ]}
                >
                </Menu>
            </Header>
            <Outlet/>
            {/*<Layout hasSider>*/}
            {/*    <Sider style={siderStyle}>Sider</Sider>*/}
            {/*    <Content style={contentStyle}>*/}
            {/*        <Outlet/>*/}
            {/*    </Content>*/}
            {/*</Layout>*/}
            <Footer style={footerStyle}/>
            </ConfigProvider>
        </Layout>
        // <div>
        //
        //     <nav>
        //         <NavLink to='/'>Home</NavLink>
        //         <NavLink to='/bar'>Bar</NavLink>
        //     </nav>
        //     <main>
        //         <Outlet></Outlet>
        //     </main>
        // </div>
    )
}

export default DashBoard;