import logo from './logo.svg';
import React from 'react';
import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Button, DatePicker, Layout, Menu, Tabs } from 'antd';
import {
  HomeOutlined,
  TableOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  AreaChartOutlined,
  StarOutlined,
  EyeOutlined,
  SettingOutlined
} from '@ant-design/icons';
import Report from './components/Report/index.js'
import Welcome from './components/Welcome/index.js'
import Chart from './components/Chart/index.js'
import Register from './components/Register/index.js'
import Favorite from './components/Favorite/index.js'
import Factory from './components/Factory/index.js'
import MaintainRole from './components/Settings/MaintainRole/index.js'

const { TabPane } = Tabs;
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function App() {

  const [collapsed, setCollapsed] = React.useState(true)

  const toggle = () => {
    setCollapsed(!collapsed)
  };


  const [newTabIndex, setNewTabIndex] = React.useState(0)
  const [activeKey, setActiveKey] = React.useState('1')
  const [panes, setPanes] = React.useState([])


  const addTab = React.useCallback(
    (title, content) => {
      const sameTitleTabIndex = panes.findIndex(p => p.title === title)
      const hasSameTitleTab = sameTitleTabIndex > -1
      if (hasSameTitleTab) {
        setActiveKey(panes[sameTitleTabIndex].key)
      } else {
        const activeKey = `newTab${newTabIndex + 1}`;
        panes.push({ title: title, content: content, key: activeKey });
        setNewTabIndex(newTabIndex + 1)
        setPanes([...panes])
        setActiveKey(activeKey)
      }
    },
    [panes, newTabIndex],
  );

  // const addTab = (title, content) => {
  //   console.log(`%c addTab `, 'background-color: #3A88AE; color: white;font-size: 14px; font-weight: bold;')

  //   const sameTitleTabIndex = panes.findIndex(p=>p.title === title)
  //   const hasSameTitleTab = sameTitleTabIndex > -1
  //   if (hasSameTitleTab) {
  //     setActiveKey(panes[sameTitleTabIndex].key)
  //   } else {
  //     const activeKey = `newTab${newTabIndex + 1}`;
  //     panes.push({ title: title, content: content, key: activeKey });
  //     setNewTabIndex(newTabIndex + 1)
  //     setPanes([...panes])
  //     setActiveKey(activeKey)
  //   }

  // };

  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  React.useEffect(() => {
    const defaultTab = getUrlParameter('tab')
    switch (defaultTab) {
      case 'factory':
        addTab('Factory', (addTab) => <Factory addTab={addTab} />)
        break
      case 'role':
        addTab('Maintain Role', (addTab) => <MaintainRole addTab={addTab} />)
        break
      default:
        addTab('Welcome', (addTab) => <Welcome addTab={addTab} />)
        break
    }
  }, [])


  const onChange = activeKey => {
    setActiveKey(activeKey);
  };

  const onEdit = (targetKey, action) => {

    if (action === 'remove') {
      remove(targetKey)
    }
  };

  const remove = targetKey => {
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    let newactiveKey;
    const newpanes = panes.filter(pane => pane.key !== targetKey);
    if (newpanes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        newactiveKey = newpanes[lastIndex].key;
      } else {
        newactiveKey = newpanes[0].key;
      }
    }
    setPanes(newpanes)
    setActiveKey(newactiveKey)
  };


  return (
    <div className="App">
      <Layout style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>

          <div className="logo" >
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
          </div>

          <Menu selectable={false} theme="dark" mode="inline" defaultSelectedKeys={[]}>
            <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => addTab('Welcome', (addTab) => <Welcome addTab={addTab} />)}>
              Home
            </Menu.Item>

            <Menu.Item key="2" icon={<TableOutlined />} onClick={() => addTab('Report', () => <Report />)}>
              Report
            </Menu.Item>
            <Menu.Item key="3" icon={<AreaChartOutlined />} onClick={() => addTab('Chart', () => <Chart />)}>
              Chart
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />} onClick={() => addTab('Register', () => <Register />)}>
              Register
            </Menu.Item>
            <Menu.Item key="5" icon={<EyeOutlined />} onClick={() => addTab('Factory', () => <Factory />)}>
              Factory
            </Menu.Item>
            <Menu.Item key="6" icon={<StarOutlined />} onClick={() => addTab('Favorite', (addTab) => <Favorite addTab={addTab} />)}>
              Favorite
            </Menu.Item>

            <SubMenu key="sub2" icon={<SettingOutlined />} title="Settings">
              <Menu.Item key="5" onClick={() => addTab('Maintain Role', () => <MaintainRole />)}>Role</Menu.Item>
              <Menu.Item key="6">Project02</Menu.Item>

              <SubMenu key="sub3" title="Project03">
                <Menu.Item key="7">Page01</Menu.Item>
                <Menu.Item key="8">Page02</Menu.Item>
                <Menu.Item key="9">Page03</Menu.Item>
                <Menu.Item key="10">Page04</Menu.Item>
              </SubMenu>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggle,
            })}
          </Header>

          <Content
            className="site-layout-background"
            style={{
              margin: '10px',
              minHeight: 280,
            }}
          >

            <Tabs
              hideAdd
              onChange={onChange}
              activeKey={activeKey}
              type="editable-card"
              onEdit={onEdit}
            >
              {panes.map(pane => (
                <TabPane tab={pane.title} key={pane.key}>

                  <div style={{ padding: '0 10px 10px 10px', position: 'relative' }}>

                    {pane.content(addTab)}

                  </div>

                </TabPane>
              ))}
            </Tabs>

          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
