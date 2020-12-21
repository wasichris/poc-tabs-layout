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

  const [report, setReport] = useState('r1')


  // ======= 取得資料 ==============================
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

  const [responseData, setResponseData] = useState({})
  React.useEffect(() => {
    setResponseData(dataSource)
  }, [])


  //======= 依據 array path 取出指定的陣列資料，並取出所有屬性(欄位)名稱 ======================
  const [arrayPath, setArrayPath] = React.useState('queryResult.users')
  const [arrayData, setArrayData] = React.useState([])

  const handleArrayPathSearch = (arrayPath) => {

    setTableColumns([])
    setTableDataSource([])
    setTransferColumns([])
    setTransferedColumnKeys([]);

    const arrayData = get(responseData, arrayPath)
    if (arrayData && Array.isArray(arrayData) && arrayData.length > 0) {

      // 指定的陣列資料
      setArrayData(arrayData)

      // 取出第一筆陣列資料的所有屬性(欄位)名稱
      const keys = Object.keys(arrayData[0])
      setTransferColumns(
        keys.map(k => ({
          key: k,
          title: k,
          description: `description of ` + k,
          disabled: false
        }))
      )

    }

  }

  //======== 取得需要顯示的欄位 Key 值 ==============================================
  const [transferColumns, setTransferColumns] = useState([]) 
  const [transferedColumnKeys, setTransferedColumnKeys] = useState([]);

  const handleTransferChange = (nextVisibleColumnKeys, direction, moveKeys) => {
    setTransferedColumnKeys(nextVisibleColumnKeys);
  };



  //======== 取出指定 arrayPath 下的 arrayData 需要顯示的欄位資料 =====================
  const [tableColumns, setTableColumns] = React.useState([])
  const [tableDataSource, setTableDataSource] = React.useState([])

  React.useEffect(() => {

    if (transferedColumnKeys && transferedColumnKeys.length > 0) {

      // 顯示什麼欄位
      const tableColumns = transferedColumnKeys.map(k => ({
        title: k,
        dataIndex: k,
        key: k
      }))
      setTableColumns(tableColumns)

      // 透過 arrayPath 取得目標 arrayData 後加上 key 在給 table 顯示
      // TODO: 應該使要相依 arrayPath, transferedColumnKeys, responseData 就好了!!!! 要處理!!!
      // TODO: 示意只顯示前N筆資料
      // setTableDataSource(arrayData.map((a, index) => ({ key: index, ...a })))
      const arrayData = get(responseData, arrayPath)
      if (arrayData && Array.isArray(arrayData) && arrayData.length > 0) {
        setTableDataSource(arrayData.map((a, index) => ({ key: index, ...a })))
      }
    

    } else {
      setTableColumns([])
      setTableDataSource([])
    }

  }, [transferedColumnKeys, arrayPath, responseData])


  //==============================



  const handleExportFile = () => {


  
    const entozh = transferedColumnKeys.reduce((newData, key) => {
      newData[key] = key
      return newData
    }, {})

    // const entozh = {
    //   "useId": "用戶帳號",
    //   "name": "姓名",
    //   // "dept": "部門",
    //   // "age": "年齡",
    // }

    const json = arrayData.map((item) => {
      return Object.keys(item).reduce((newData, key) => {

        const hasKey = entozh.hasOwnProperty(key)
        if (hasKey) {
          // 只取出 entozh 有定義的欄位
          const columnTitleName = entozh[key] || key
          newData[columnTitleName] = item[key]
        }
    
        return newData
        
        // const newKey = entozh[key] || key
        // newData[newKey] = item[key]
        // return newData
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



  return (
    <div>
      <Title level={2}> 報表維護 </Title>


      <Select
        showSearch
        style={{ width: 400 }}
        placeholder="請選擇需要維護的報表"
        optionFilterProp="children"
        onChange={setReport}
        // onFocus={onFocus}
        // onBlur={onBlur}
        // onSearch={onSearch}
        value={report}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="r1">Report - 01</Option>
        <Option value="r2">Report - 02</Option>
        <Option value="r3">Report - 03</Option>
      </Select>



      <br />
      <br />

      {<Row gutter={16}>

        <Col span={12}>
          <Card title="原始資料" bordered={true} >
            <ReactJson src={responseData} enableClipboard={false} displayDataTypes={false} />
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
              dataSource={transferColumns}
              titles={['可選欄位', '報表欄位']}
              targetKeys={transferedColumnKeys}
              onChange={handleTransferChange}
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
            <br />
            {tableDataSource && tableDataSource.length>0 && <Button icon={<ExportOutlined />} onClick={handleExportFile}>Excel</Button>}


          </Card>
        </Col>


      </Row>
      }


    </div>
  );
};


export default MaintainReport