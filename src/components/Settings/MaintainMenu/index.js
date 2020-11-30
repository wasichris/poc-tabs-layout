import React, { useState } from 'react';
import { TreeSelect, Tree, Card, Col, Input, Form, Row, Typography, Select, Button, message, Transfer, Modal } from 'antd';


import { FolderOutlined, ProfileOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Paragraph, Link } = Typography;
const { Option } = Select;

const authOptions = (key, isIncludeAuth) => isIncludeAuth ? [
  { title: '新增', key: `${key}-C`, selectable: false },
  { title: '查詢', key: `${key}-R`, selectable: false },
  { title: '修改', key: `${key}-U`, selectable: false },
  { title: '刪除', key: `${key}-D`, selectable: false },
] : []


const MaintainMenu = () => {


  // React useState changes my constant initial state
  // https://stackoverflow.com/questions/63123314/react-usestate-changes-my-constant-initial-state
  // so move the const inside of MaintainMenu
  // sample: https://codesandbox.io/s/suspicious-boyd-iehbc?file=/src/Panel.js
  const treeData = isIncludeAuth => [
    {
      title: '製造車間控制與管理系統',
      key: '0',
      icon: <FolderOutlined />,
      children: [
        {
          title: '專案 0-0',
          key: '0-0',
          icon: <FolderOutlined />,
          children: [
            { title: '頁面 0', key: '0-0-0', icon: <ProfileOutlined />, children: authOptions('0-0-0', isIncludeAuth) },
            { title: '頁面 1', key: '0-0-1', icon: <ProfileOutlined />, children: authOptions('0-0-1', isIncludeAuth) },
            { title: '頁面 2', key: '0-0-2', icon: <ProfileOutlined />, children: authOptions('0-0-2', isIncludeAuth) },
          ],
        },
        {
          title: '專案 0-1',
          key: '0-1',
          icon: <FolderOutlined />,
          children: [
            { title: '頁面 0', key: '0-1-0', icon: <ProfileOutlined />, children: authOptions('0-1-0', isIncludeAuth) },
          ],
        },
        {
          title: '專案 0-2',
          key: '0-2',
          icon: <FolderOutlined />,
          children: [
            { title: '頁面 0', key: '0-2-0', icon: <ProfileOutlined />, children: authOptions('0-2-0', isIncludeAuth) },
            { title: '頁面 1', key: '0-2-1', icon: <ProfileOutlined />, children: authOptions('0-2-1', isIncludeAuth) },
          ],
        },
      ],
    },
    {
      title: '鐵管車間控制與管理系統',
      key: '1',
      icon: <FolderOutlined />,
      children: [
        {
          title: '專案 1-0',
          key: '1-0',
          icon: <FolderOutlined />,
          children: [
            { title: '頁面 0', key: '1-0-0', icon: <ProfileOutlined />, children: authOptions('1-0-0', isIncludeAuth) },
            { title: '頁面 1', key: '1-0-1', icon: <ProfileOutlined />, children: authOptions('1-0-1', isIncludeAuth) },
          ],
        },
      ],
    },
  ];

  const [menu, setMenu] = useState(treeData(false))
  const [menuWithAuth, setMenuWithAuth] = useState(treeData(true))
  const [showLine, setShowLine] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [showLeafIcon, setShowLeafIcon] = useState(true);
  const [checkedKeys, setCheckedKeys] = useState(["0-0-1", "0-2-0"]);
  const [selectedMenuKey, setSelectedMenuKey] = useState(null)
  const [selectedMenu, setSelectedMenu] = useState(null)


  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const onSetLeafIcon = checked => {
    setShowLeafIcon(checked);
    setShowLine({ showLeafIcon: checked });
  };

  const onSetShowLine = checked => {
    if (checked) {
      showLeafIcon ? setShowLine(checked) : setShowLine({ showLeafIcon });
    } else {
      setShowLine(checked);
    }
  };

  //==================================================================================

  const onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    setCheckedKeys(checkedKeys);
  };


  //==================================================================================

  const onDragEnter = info => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  const onDrop = info => {
    console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...menu];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setMenu(data)

  };


  //==================================================================================
  const [selectedKeys, setSelectedKeys] = useState([])
  const [targetKeys, setTargetKeys] = useState([]);

  const mockData = [];
  for (let i = 0; i < 3; i++) {
    mockData.push({
      key: i.toString(),
      title: `role${i + 1}`,
      description: `description of content${i + 1}`,
      disabled: false//i % 3 < 1,
    });
  }

  const handleTransferChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);

    console.log('targetKeys: ', nextTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  };

  const handleTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };


  //==================================================================================

  const options = ['a', 'b', 'c', 'd', 'e'].map(value => ({ value, disabled: false, label: 'role-' + value }));

  function handleSelectRoleChange(value) {
    console.log(`selected ${value}`);
  }

  //==================================================================================

  const [isCreateRoleModalVisible, setIsCreateRoleModalVisible] = useState(false);

  const showCreateMenuModal = () => {
    setIsCreateRoleModalVisible(true)
  };

  const showEditMenuModal = () => {
    // setIsCreateRoleModalVisible(true)
  };

  const showDeleteMenuModal = () => {
    Modal.confirm({
      title: '刪除菜單',
      content: '是否要刪除此菜單?',
      okText: '刪除',
      cancel: '取消',
      onOk: () => {
        return new Promise((resolve, reject) => {
          setSelectedMenuKey(null)
          setSelectedMenu(null)
          message.success('Role deleted!')
          resolve()
        }).catch(() => console.log('Oops errors!'));
      }
    })
  };

  const handleCreateMenuModalOk = e => {
    console.log(e);
    setIsCreateRoleModalVisible(false)
    message.success('Menu saved!')
  };

  const handleCreateMenuModalCancel = e => {
    console.log(e);
    setIsCreateRoleModalVisible(false)
  };

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };


  // const findTargetInTree = (arr, children, match) => {
  //   return arr.find(a => {
  //     if (children(a) && children(a).length > 0) {
  //       return match(a) ? true : findTargetInTree(children(a), children, match)
  //     } else {
  //       return match(a)
  //     }
  //   })
  // }


  const findTargetInTree = (array, getChildren, match) => {

    for (let index = 0; index < array.length; index++) {
      
      // 物件是否符合，符合實質接回傳
      const element = array[index];
      if (match(element)) return element;

      // 物件不符合，往子陣列繼續找尋
      const children = getChildren(element)
      if (children && children.length > 0) {
        const target = findTargetInTree(children, getChildren, match)
        if (target) return target
      }
    }

    return null
  }

  const findTarget = (array, key) => findTargetInTree(array, m => m.children, m => m.key === key)

  const handleSelectedMenuChnage = menuKey => {
    setSelectedMenuKey(menuKey)
    console.log(`%c menuKey `, 'background-color: #3A88AE; color: white;font-size: 14px; font-weight: bold;', menuKey)
    

    /* 要依據 selectedMenuKey 從原始 menu 資料取出該 menu 資料(包含其他附加資訊)。 */
    const targetMenu = findTarget(menu, menuKey)
    setSelectedMenu(targetMenu)
    console.log(`%c targetMenu `, 'background-color: #3A88AE; color: white;font-size: 14px; font-weight: bold;', targetMenu)

  }

  

  return (
    <div>
      <Title level={2}> 菜單維護 </Title>


      {/* {JSON.stringify(selectedMenuKey)} */}
      {/* {JSON.stringify(targetMenu)} */}

      <TreeSelect
        showSearch
        filterTreeNode={(searchValue, node) => node.title.indexOf(searchValue) !== -1}
        style={{ width: '500px' }}
        value={selectedMenuKey}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={menu}
        placeholder="請選擇需要維護的菜單"
        treeDefaultExpandAll
        onChange={handleSelectedMenuChnage}
      />

      <Button icon={<EditOutlined />} disabled={!selectedMenuKey} onClick={showEditMenuModal}>編輯菜單</Button>
      <Button icon={<DeleteOutlined />} disabled={!selectedMenuKey} onClick={showDeleteMenuModal}>刪除菜單</Button>
      <Button icon={<PlusCircleOutlined />} onClick={showCreateMenuModal}>新增菜單</Button>


      <br />
      <br />

      {/* 要依據 selectedMenuKey 從原始 menu 資料取出該 menu 是不是頁面，因為頁面才會有授權。目前只是示意而已，僅使用有無子menu來判斷。 */}
      {selectedMenu && selectedMenu.children.length ===0 && <Row gutter={16}>
        <Col span={12}>

          <Card className="app-card" title="角色" bordered={true} extra={<a href="#" onClick={() => message.success('Role saved!')}>Save</a>} >

            新增人員角色
            <Select
              // labelInValue
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Please select"
              // defaultValue={['a10', 'c12']}
              onChange={handleSelectRoleChange}
              options={options}
            />
            <br />
            <br />

            移除人員角色
            <Transfer
              className="role-user-list"
              dataSource={mockData}
              titles={['人員角色', '移除角色']}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={handleTransferChange}
              onSelectChange={handleTransferSelectChange}
              // onScroll={handleScroll}
              render={item => item.title}
              // disabled={disabled}
              oneWay
              showSelectAll={false}
              showSearch
            // style={{ height: '400px' }}
            />


          </Card>
        </Col>
        {/* <Col span={12}>
          <Card title="權限(唯讀)" bordered={true} >


            <Tree
              className='menu__tree'
              showLine={showLine}
              showIcon={showIcon}

              // defaultExpandedKeys={['0-0']}
              defaultExpandedKeys={checkedKeys}
              // autoExpandParent={true}
              // blockNode={true}

              onSelect={onSelect}
              treeData={menuWithAuth}

              draggable
              onDragEnter={onDragEnter}
              onDrop={onDrop}

              checkable
              checkedKeys={checkedKeys}
              onCheck={onCheck}

              disabled
            />

          </Card>
        </Col> */}

      </Row>
      }


      <Modal
        title="新增菜單"
        visible={isCreateRoleModalVisible}
        onOk={handleCreateMenuModalOk}
        onCancel={handleCreateMenuModalCancel}
        okText="新增"
        cancelText="取消"
      >

        <Form {...layout} name="basic"  >

          <Form.Item label="菜單名稱" name="rolename" rules={[{ required: true, message: '請輸入菜單名稱!', },]}>
            <Input />
          </Form.Item>

          <Form.Item label="菜單描述" name="roledesc">
            <Input />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};


export default MaintainMenu