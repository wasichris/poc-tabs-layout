import React, { useState } from 'react';
import { Table, Tree, Card, Col, Input, Form, Row, Typography, Select, Button, message, Transfer, Modal } from 'antd';
import ReactJson from 'react-json-view'
import XLSX from 'xlsx';
import { FolderOutlined, ProfileOutlined, PlusCircleOutlined, ExportOutlined } from '@ant-design/icons';
import get from 'lodash/get'
const { Title, Paragraph, Link } = Typography;
const { Option } = Select;
const { Search } = Input;


const MaintainReport = () => {

  const [report, setReport] = useState('')


  //==================================================================================
  const [selectedKeys, setSelectedKeys] = useState([])
  const [targetKeys, setTargetKeys] = useState([]);
  const [columns, setColumns] = useState([])

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



  //==============================
  const dataSource = {
    cards: [
      { id: '10', name: 'card-a', description: 'dep1' },
      { id: '20', name: 'card-a', description: 'dep1' },
    ],
    queryResult: {
      users: [
        { useId: '01', name: 'chris', dept: 'dep1', age: '22' },
        { useId: '02', name: 'darren', dept: 'dep2', age: '22' },
        { useId: '03', name: 'ryan', dept: 'dep3', age: '22' }
      ]
    }
  }

  const handleExportFile = () => {

    const entozh = {
      "name": "姓名",
      "dept": "部門",
      "age": "年齡",
    }

    const json = dataSource.map((item) => {
      return Object.keys(item).reduce((newData, key) => {
        const newKey = entozh[key] || key
        newData[newKey] = item[key]
        return newData
      }, {})
    });
    console.log(`%c json `, 'background-color: #3A88AE; color: white;font-size: 14px; font-weight: bold;', json)
    const sheet = XLSX.utils.json_to_sheet(json);
    openDownloadDialog(sheet2blob(sheet, undefined), `全部信息.xlsx`);
  }

  const openDownloadDialog = (url, saveName) => {
    if (typeof url == 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url); // 創建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的屬性，指定保存文件名，可以不要後綴，注意，file:///模式下不會生效
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
  }
  const sheet2blob = (sheet, sheetName) => {
    sheetName = sheetName || 'sheet1';
    var workbook = {
      SheetNames: [sheetName],
      Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet; // 生成excel的配置項
    var wopts = {
      bookType: 'xlsx', // 要生成的文件類型
      bookSST: false, // 是否生成Shared String Table，官方解釋是，如果開啟生成速度會下降，但在低版本IOS設備上有更好的兼容性
      type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    }); // 字符串轉ArrayBuffer
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
    return blob;
  }


  //==============================
  const [tableColumns, setTableColumns] = React.useState([])
  const [tableDataSource, setTableDataSource] = React.useState([])
  const [targetArray, setTargetArray] = React.useState([])

  const [arrayPath, setArrayPath] = React.useState('queryResult.users')
  const handleArrayPathSearch = (arrayPath) => {

    setTableColumns([])
    setTableDataSource([])
    setColumns([])
    setTargetKeys([]);
    setSelectedKeys([]);

    const arrayData = get(dataSource, arrayPath)
    if (arrayData && Array.isArray(arrayData) && arrayData.length > 0) {
      const keys = Object.keys(arrayData[0])
      const keyColumns = keys.map(k => ({
        key: k,
        title: k,
        description: `description of k`,
        disabled: false
      }))

      // 提供資料挑選要顯示那些欄位
      setColumns(keyColumns)

      // 目標的 array 資料
      setTargetArray(arrayData)


      // ================================================

      // // 要在下面一層，只顯示勾選的欄位，還有對應欄位名稱
      // const tempTableColumns = keys.map(k => ({
      //   title: k,
      //   dataIndex: k,
      //   key: k
      // }))
      // setTableColumns(tempTableColumns)
      // setTableDataSource(arrayData)


    } else {
      setColumns([])
    }

    console.log(`%c arrayData `, 'background-color: #3A88AE; color: white;font-size: 14px; font-weight: bold;', arrayData)
    console.log(`%c arrayPath `, 'background-color: #3A88AE; color: white;font-size: 14px; font-weight: bold;', arrayPath)

  }


  // const refreshTable = (keys, arrayData) => {
  //   const tempTableColumns = keys.map(k => ({
  //     title: k,
  //     dataIndex: k,
  //     key: k
  //   }))
  //   setTableColumns(tempTableColumns)
  //   setTableDataSource(arrayData)
  // }

  React.useEffect(() => {

    if (targetKeys && targetKeys.length > 0) {

      // 顯示什麼欄位
      const tempTableColumns = targetKeys.map(k => ({
        title: k,
        dataIndex: k,
        key: k
      }))
      setTableColumns(tempTableColumns)

      // 透過 arrayPath 取得目標 array 加上 key 在給 table 顯示
      // TODO: 應該使要相依 arrayPath, targetKeys, dataSource 就好了!!!! 要處理!!!
      // TODO: 示意只顯示前N筆資料
      setTableDataSource(targetArray.map((a, index) => ({ key: index, ...a })))
    } else {
      setTableColumns([])
      setTableDataSource([])
    }

  }, [targetKeys, targetArray])

  return (
    <div>
      <Title level={2}> 報表維護 </Title>


      <Select
        showSearch
        style={{ width: 400 }}
        placeholder="請選擇需要維護的人員"
        optionFilterProp="children"
        onChange={setReport}
        // onFocus={onFocus}
        // onBlur={onBlur}
        // onSearch={onSearch}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="chris">Chris Chen - Dept01</Option>
        <Option value="jason">Jason Lin - Dept02</Option>
        <Option value="darren">Darren Chen - Dept03</Option>
      </Select>

      <Button icon={<ExportOutlined />} onClick={handleExportFile}>Export Data</Button>


      <br />
      <br />

      {<Row gutter={16}>

        <Col span={12}>
          <Card title="原始資料" bordered={true} >
            <ReactJson src={dataSource} enableClipboard={false} displayDataTypes={false} />
          </Card>
        </Col>

        <Col span={12}>

          <Card className="app-card" title="擷取資料" bordered={true} extra={<a href="#" onClick={() => message.success('Role saved!')}>Save</a>} >

            陣列位置
            <Search placeholder="input search text"
              value={arrayPath}
              onChange={e => setArrayPath(e.target.value)}
              onSearch={handleArrayPathSearch} />

            <br />
            <br />

            資料欄位
            <Transfer
              className="report-column-list"
              dataSource={columns}
              titles={['可選欄位', '報表欄位']}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={handleTransferChange}
              onSelectChange={handleTransferSelectChange}
              render={item => item.title}
              // disabled={disabled}
              oneWay
              showSelectAll={false}
              showSearch
            />

            <br />
            <br />


            報表資料
            <Table dataSource={tableDataSource} columns={tableColumns} pagination={false} />

          </Card>
        </Col>


      </Row>
      }


    </div>
  );
};


export default MaintainReport