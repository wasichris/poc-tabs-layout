import { Table, Col, Row, Divider, Input, Button } from 'antd';
import { Resizable } from 'react-resizable';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';

const ResizableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

class Demo extends React.Component {
  state = {
    columns: [
      {
        title: 'Date',
        dataIndex: 'date',
        width: 200,
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        width: 100,
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: 'Type',
        dataIndex: 'type',
        width: 100,
      },
      {
        title: 'Note',
        dataIndex: 'note',
        width: 100,
      },
      {
        title: 'Action',
        key: 'action',
        render: () => <a>Delete</a>,
      },
    ],
  };

  components = {
    header: {
      cell: ResizableTitle,
    },
  };

  data = [
    {
      key: 0,
      date: '2018-02-11',
      amount: 120,
      type: 'income',
      note: 'transfer',
    },
    {
      key: 1,
      date: '2018-03-11',
      amount: 243,
      type: 'income',
      note: 'transfer',
    },
    {
      key: 2,
      date: '2018-04-11',
      amount: 98,
      type: 'income',
      note: 'transfer',
    },
  ];

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  render() {
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    const style = { padding: '8px 0', textAlign: 'right' };

    return <>
      <Row gutter={[8, 8]}>
        <Col span={2}>
          <div style={style}>Name:</div>
        </Col>
        <Col span={4}>
          <Input placeholder="User Name" />
        </Col>
        <Col span={2}>
          <div style={style}>Type:</div>
        </Col>
        <Col span={4}>
          <Input placeholder="User Type" />
        </Col>
        <Col span={2}>
          <div style={style}>Note:</div>
        </Col>
        <Col span={4}>
          <Input placeholder="Note" />
        </Col>
      
        <Col span={4} offset={2}>
          <Button type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
        </Col>
        

      </Row>

      <Divider orientation="left"></Divider>

      <Table bordered components={this.components} columns={columns} dataSource={this.data} />;
    </>

  }
}

export default Demo