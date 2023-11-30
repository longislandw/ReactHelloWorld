import {NavLink, Outlet} from "react-router-dom";
import * as React from "react";
import {ConfigProvider, Layout, Menu} from "antd";
import {HomeOutlined, BugOutlined} from "@ant-design/icons";

const { Header,Sider, Footer, Content } = Layout;

const headerStyle: React.CSSProperties = {
    // display: 'flex',
    textAlign: 'left',
    backgroundColor:'rgba(255,255,255,0.75)',
    height: 70,
    // padding: 0,
    // paddingInline: 50,
    lineHeight: '64px',
    // backgroundColor: '#7dbcea',
};

const menuStyle: React.CSSProperties = {

    textAlign: 'center',
    // lineHeight: '120px',
    color: '#2c0101',
    // fontSize: 30,
    // fontWeight: "bold",
    backgroundColor: 'rgba(255,255,255,0.75)',
};

const contentStyle: React.CSSProperties = {
    padding: 24,
    margin: '24px 16px',
    minHeight: 700,
    // width: "100%",
    // textAlign: 'center',
    // minHeight: 120,
    // lineHeight: '120px',
    // color: '#fff',
    backgroundColor: '#ffffff',
};

const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    // backgroundColor: '#3ba0e9',
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    // backgroundColor: '#7dbcea',
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
                            icon: <BugOutlined />,
                            label: <NavLink to="/bar">Bar/TestPage</NavLink>,
                        },
                    ]}
                >
                </Menu>
            </Header>
            <Layout hasSider>
                <Sider style={siderStyle}>Sider</Sider>
                <Content style={contentStyle}>
                    {/*Content*/}
                    <Outlet/>
                </Content>
            </Layout>
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