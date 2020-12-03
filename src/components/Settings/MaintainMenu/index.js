import React, { useState } from 'react';
import { Table, Radio, TreeSelect, Tree, Card, Col, Input, Form, Row, Typography, Select, Button, message, Transfer, Modal } from 'antd';

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
      title: '刪除選單',
      content: '是否要刪除此選單?',
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
      span: 5,
    },
    wrapperCol: {
      span: 19,
    },
  };

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

  //==================================================================================

  const [newMenuType, setNewMenuType] = useState(1);
  const onNewMenuTypeChange = e => {
    const menuType = e.target.value
    setNewMenuType(menuType)
    console.log(`%c menuType `, 'background-color: #3A88AE; color: white;font-size: 14px; font-weight: bold;', menuType)
  }

  //==================================================================================
  

  const [newMenuInsertType, setNewMenuInsertType] = useState(1);
  const onNewMenuInsertTypeChange = e => {
    const insertType = e.target.value
    setNewMenuInsertType(insertType)
    console.log(`%c insertType `, 'background-color: #3A88AE; color: white;font-size: 14px; font-weight: bold;', insertType)
  }

  const [newMenuLocationKey, setNewMenuLocationKey] = useState(null)
  const [newMenuLocation, setNewMenuLocation] = useState(null)

  const handleNewMenuLocationChange = m => {
    setNewMenuLocationKey(m)
    console.log(`%c m `, 'background-color: #3A88AE; color: white;font-size: 14px; font-weight: bold;', m)
  }

  let isNewMenuLocationIsFolder = false
  if (newMenuLocationKey) {
    isNewMenuLocationIsFolder = findTarget(menu, newMenuLocationKey).children.length > 0
  }

  //==================================================================================

  const dataSource = [
    { key: '1', rolename: 'Admin', isCreate: 'O', isRead: 'O', isUpdate: 'O', isDelete: 'O' },
    { key: '2', rolename: 'IT', isCreate: 'O', isRead: 'O', isUpdate: 'O', isDelete: '' },
    { key: '3', rolename: 'Sales', isCreate: '', isRead: 'O', isUpdate: '', isDelete: '' },
  ];
  
  const columns = [
    { title: '角色名稱', dataIndex: 'rolename', key: 'rolename' },
    { title: '新增', dataIndex: 'isCreate', key: 'isCreate' },
    { title: '查詢', dataIndex: 'isRead', key: 'isRead' },
    { title: '更新', dataIndex: 'isUpdate', key: 'isUpdate' },
    { title: '刪除', dataIndex: 'isDelete', key: 'isDelete' },
  ];

  return (
    <div>
      <Title level={2}> 選單維護 </Title>


      {/* {JSON.stringify(selectedMenuKey)} */}
      {/* {JSON.stringify(targetMenu)} */}

      <TreeSelect
        showSearch
        filterTreeNode={(searchValue, node) => node.title.indexOf(searchValue) !== -1}
        style={{ width: '500px' }}
        value={selectedMenuKey}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={menu}
        placeholder="請選擇需要維護的選單"
        treeDefaultExpandAll
        onChange={handleSelectedMenuChnage}
      />

      <Button icon={<EditOutlined />} disabled={!selectedMenuKey} onClick={showEditMenuModal}>編輯選單</Button>
      <Button icon={<DeleteOutlined />} disabled={!selectedMenuKey} onClick={showDeleteMenuModal}>刪除選單</Button>
      <Button icon={<PlusCircleOutlined />} onClick={showCreateMenuModal}>新增選單</Button>


      <br />
      <br />

      {/* 要依據 selectedMenuKey 從原始 menu 資料取出該 menu 是不是頁面，因為頁面才會有授權。目前只是示意而已，僅使用有無子menu來判斷。 */}
      {selectedMenu && selectedMenu.children.length === 0 && <Row gutter={16}>

        <Col span={24}>
          <Card className="app-card" title="關聯角色" bordered={true}  >
            {/* <Table bordered components={components} columns={my_columns} dataSource={roles} /> */}

            <Table dataSource={dataSource} columns={columns} pagination={false}/>

          </Card>
        </Col>

      </Row>
      }


      <Modal
        title="新增選單"
        visible={isCreateRoleModalVisible}
        onOk={handleCreateMenuModalOk}
        onCancel={handleCreateMenuModalCancel}
        okText="新增"
        cancelText="取消"
      >

        <Form {...layout} name="basic"  >

          <Form.Item label="選單名稱" name="menuName" rules={[{ required: true, message: '請輸入選單名稱!', },]}>
            <Input />
          </Form.Item>

          <Form.Item label="選單類型" name="menuType" rules={[{ required: true, message: '請輸入選單類型!', },]}>
            <Radio.Group onChange={onNewMenuTypeChange} defaultValue={newMenuType} value={newMenuType} >
              <Radio value={1}>容器</Radio>
              <Radio value={2}>頁面</Radio>
            </Radio.Group>
          </Form.Item>

          {newMenuType === 2 && <Form.Item label="頁面組件" name="menuComponent" rules={[{ required: true, message: '請輸入頁面組件名稱!', },]}>
            <Input />
          </Form.Item>}

          <Form.Item label="選單位置" name="menuLocation" rules={[{ required: true, message: '請輸入選單位置!', },]}>
            <TreeSelect
              showSearch
              filterTreeNode={(searchValue, node) => node.title.indexOf(searchValue) !== -1}
              style={{ width: '100%' }}
              value={newMenuLocationKey}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={menu}
              placeholder="請選擇新增選單顯示位置"
              treeDefaultExpandAll
              onChange={handleNewMenuLocationChange}
            />

            {/* {newMenuLocationKey && (isNewMenuLocationIsFolder ? '參考位置為容器' : '參考位置為頁面(無法加入子頁面)')} */}
          </Form.Item>


          {newMenuLocationKey && <Form.Item label="插入方式" name="menuInsertType" rules={[{ required: true, message: '請輸入選單插入方式!', },]}>
            <Radio.Group onChange={onNewMenuInsertTypeChange} defaultValue={newMenuInsertType} value={newMenuInsertType} >
              {isNewMenuLocationIsFolder && <Radio value={1}>此容器內</Radio>}
              <Radio value={2}>{`此${isNewMenuLocationIsFolder ? '容器' : '頁面'}前`}</Radio>
              <Radio value={3}>{`此${isNewMenuLocationIsFolder ? '容器' : '頁面'}後`}</Radio>
            </Radio.Group>
          </Form.Item>}


          {/* 不能在這邊設定，因為還要設定 CRUD */}
          {/* {newMenuType === 2 && <Form.Item label="選單角色" name="menuRoles" rules={[{ required: true, message: '請輸入選單角色!', },]}>
            <Select
              // labelInValue
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Please select"
              // defaultValue={['a10', 'c12']}
              // onChange={handleSelectRoleChange}
              options={options}
            />
          </Form.Item>
          } */}


        </Form>
      </Modal>
    </div>
  )
};


export default MaintainMenu