import React, { useState } from 'react';
import { Tree, Card, Col, Input, Form, Row, Typography, Select, Button, message, Transfer, Modal } from 'antd';


import { FolderOutlined, ProfileOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph, Link } = Typography;
const { Option } = Select;

const authOptions = key => [
  { title: '新增', key: `${key}-C`, selectable: false },
  { title: '查詢', key: `${key}-R`, selectable: false },
  { title: '修改', key: `${key}-U`, selectable: false },
  { title: '刪除', key: `${key}-D`, selectable: false },
]

const MaintainRole = () => {


  // React useState changes my constant initial state
  // https://stackoverflow.com/questions/63123314/react-usestate-changes-my-constant-initial-state
  // so move the const inside of MaintainRole
  // sample: https://codesandbox.io/s/suspicious-boyd-iehbc?file=/src/Panel.js
  const treeData = [
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
            { title: '頁面 0', key: '0-0-0', icon: <ProfileOutlined />, children: authOptions('0-0-0') },
            { title: '頁面 1', key: '0-0-1', icon: <ProfileOutlined />, children: authOptions('0-0-1') },
            { title: '頁面 2', key: '0-0-2', icon: <ProfileOutlined />, children: authOptions('0-0-2') },
          ],
        },
        {
          title: '專案 0-1',
          key: '0-1',
          icon: <FolderOutlined />,
          children: [
            { title: '頁面 0', key: '0-1-0', icon: <ProfileOutlined />, children: authOptions('0-1-0') },
          ],
        },
        {
          title: '專案 0-2',
          key: '0-2',
          icon: <FolderOutlined />,
          children: [
            { title: '頁面 0', key: '0-2-0', icon: <ProfileOutlined />, children: authOptions('0-2-0') },
            { title: '頁面 1', key: '0-2-1', icon: <ProfileOutlined />, children: authOptions('0-2-1') },
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
            { title: '頁面 0', key: '1-0-0', icon: <ProfileOutlined />, children: authOptions('1-0-0') },
            { title: '頁面 1', key: '1-0-1', icon: <ProfileOutlined />, children: authOptions('1-0-1') },
          ],
        },
      ],
    },
  ];

  const [menu, setMenu] = useState(treeData)
  const [showLine, setShowLine] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [showLeafIcon, setShowLeafIcon] = useState(true);
  const [checkedKeys, setCheckedKeys] = useState(["0-0-1", "0-2-0"]);
  const [role, setRole] = useState('')


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
  for (let i = 0; i < 20; i++) {
    mockData.push({
      key: i.toString(),
      title: `name${i + 1}`,
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

  const options = [];
  for (let i = 0; i < 10000; i++) {
    const value = `${i.toString(36)}${i}`;
    options.push({
      value,
      // disabled: i === 10,
      label: 'n-' + value
    });
  }

  function handleSelectUserChange(value) {
    console.log(`selected ${value}`);
  }


  //==================================================================================

  const [isCreateRoleModalVisible, setIsCreateRoleModalVisible] = useState(false);

  const showCreateRoleModal = () => {
    setIsCreateRoleModalVisible(true)
  };

  const showDeleteRoleModal = () => {
    Modal.confirm({
      title: '刪除角色',
      content: '是否要刪除此角色?',
      okText: '刪除', 
      cancel: '取消',
      onOk: () => {
        return new Promise((resolve, reject) => {
          setRole(null)
          message.success('Role deleted!')
          resolve()
        }).catch(() => console.log('Oops errors!'));
      }
    })
  };

  const handleCreateRoleModalOk = e => {
    console.log(e);
    setIsCreateRoleModalVisible(false)
    message.success('User saved!')
  };

  const handleCreateRoleModalCancel = e => {
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


  return (
    <div>
      <Title level={2}> 角色維護 </Title>

      {/* <div style={{ marginBottom: 16 }}>
        showLine: <Switch checked={showLine} RoleonChange={onSetShowLine} />
        <br />
        <br />
        showIcon: <Switch checked={showIcon} RoleonChange={setShowIcon} />
        <br />
        <br />
        showLeafIcon: <Switch checked={showLeafIcon} RoleonChange={onSetLeafIcon} />
      </div> */}


      <Select
        // allowClear
        showSearch
        style={{ width: 400 }}
        placeholder="請選擇需要維護的角色"
        optionFilterProp="children"
        onChange={setRole}
        value={role}
        // onFocus={onFocus}
        // onBlur={onBlur}
        // onSearch={onSearch}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="manager">Manager - 各處一級主管</Option>
        <Option value="tech">Tech - 各處技術人員</Option>
        <Option value="sales">Sales - 業務部業務</Option>
      </Select>

      <Button icon={<DeleteOutlined />} disabled={!role} onClick={showDeleteRoleModal}>刪除角色</Button>
      <Button icon={<PlusCircleOutlined />} onClick={showCreateRoleModal}>新增角色</Button>
      <br />
      <br />

      {role && <Row gutter={16}>
        <Col span={12}>

          <Card title="人員" bordered={true} extra={<a href="#" onClick={() => message.success('User saved!')}>Save</a>} >

            新增角色人員
            <Select
              // labelInValue
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Please select"
              // defaultValue={['a10', 'c12']}
              onChange={handleSelectUserChange}
              options={options}
            />
            <br />
            <br />

            移除角色人員
            <Transfer
              className="role-user-list"
              dataSource={mockData}
              titles={['角色人員', '移除人員']}
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
        <Col span={12}>
          <Card title="權限" bordered={true} extra={<a href="#" onClick={() => message.success('Permission saved!')}>Save</a>}>


            <Tree
              showLine={showLine}
              showIcon={showIcon}

              // defaultExpandedKeys={['0-0']}
              defaultExpandedKeys={checkedKeys}
              // autoExpandParent={true}
              // blockNode={true}

              onSelect={onSelect}
              treeData={menu}

              draggable
              onDragEnter={onDragEnter}
              onDrop={onDrop}

              checkable
              checkedKeys={checkedKeys}
              onCheck={onCheck}

            />

          </Card>
        </Col>

      </Row>
      }


      <Modal
        title="新增角色"
        visible={isCreateRoleModalVisible}
        onOk={handleCreateRoleModalOk}
        onCancel={handleCreateRoleModalCancel}
        okText="新增"
        cancelText="取消"
      >

        <Form {...layout}  name="basic"  >

          <Form.Item label="角色名稱" name="rolename" rules={[ { required: true,  message: '請輸入角色名稱!', },  ]}>
            <Input />
          </Form.Item>

          <Form.Item label="角色描述" name="roledesc">
            <Input />
          </Form.Item>

        </Form>
      </Modal>

    </div>
  );
};


export default MaintainRole