import logo from './logo.svg';
import React from 'react';
import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Button, DatePicker, Layout, Menu, Tabs, message } from 'antd';
import {
  HomeOutlined,
  TableOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  AreaChartOutlined,
  StarOutlined,
  EyeOutlined,
  SettingOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons';
import Report from './components/Report/index.js'
import Welcome from './components/Welcome/index.js'
import Chart from './components/Chart/index.js'
import Register from './components/Register/index.js'
import Favorite from './components/Favorite/index.js'
import Factory from './components/Factory/index.js'
import MaintainRole from './components/Settings/MaintainRole/index.js'
import MaintainUser from './components/Settings/MaintainUser/index.js'
import MaintainMenu from './components/Settings/MaintainMenu/index.js'
import MaintainReport from './components/Settings/MaintainReport/index.js'

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
      case 'user':
        addTab('Maintain User', (addTab) => <MaintainUser addTab={addTab} />)
        break
      case 'menu':
        addTab('Maintain Menu', (addTab) => <MaintainMenu addTab={addTab} />)
        break
      case 'report':
        addTab('Maintain Report', (addTab) => <MaintainReport addTab={addTab} />)
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

  //============== fullscreen ==============================================================

  const [isFullScreen, setIsFullScreen] = React.useState(false)

  const escape = (event) => {
    if (event.key === "Escape") {
      setIsFullScreen(false)
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [])

  const toggleFullScreen = () => {

    setIsFullScreen(isFullScreen => {
      if (!isFullScreen) {
        message.info('已進入全螢幕模式，按下 Esc 可離開此模式。', 1)
      }
      return !isFullScreen
    })
  }

  // 不好的寫法(*)
  // const operations = isFullScreen ? <FullscreenExitOutlined style={{ marginRight: '10px' }} onClick={toggleFullScreen} />
  //   : <FullscreenOutlined style={{ marginRight: '10px' }} onClick={toggleFullScreen} />

  // 較好的寫法(*)
  const operations = React.createElement(isFullScreen ? FullscreenExitOutlined : FullscreenOutlined, {
    style: { marginRight: '10px' },
    onClick: toggleFullScreen,
  })

  return (
    <div className="App">
      <Layout style={{ minHeight: '100vh' }}>


        <Sider trigger={null} collapsible collapsed={collapsed}
          className={(isFullScreen ? 'ant-layout-sider--hide' : '')}
        >

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
              <Menu.Item key="51" onClick={() => addTab('Maintain User', () => <MaintainUser />)}>User</Menu.Item>
              <Menu.Item key="52" onClick={() => addTab('Maintain Menu', () => <MaintainMenu />)}>Menu</Menu.Item>
              <Menu.Item key="53" onClick={() => addTab('Maintain Report', () => <MaintainReport />)}>Report</Menu.Item>
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

          <Header style={{ padding: 0 }}
            className={"site-layout-background " + (isFullScreen ? 'ant-layout-header--hide' : '')}
          >

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
              tabBarExtraContent={operations}
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
