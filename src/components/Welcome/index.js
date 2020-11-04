import { Card, Col, Row, Divider, Button } from 'antd';
import Report from '../Report/index.js'
import Spin from '../Spin/index.js'
import Register from '../Register/index.js'


const cards = ({addTab}) => {

  return <div className="site-card-wrapper">

    <h2> Welcome to the platform</h2>

    <Row gutter={16}>
      <Col span={8}>
        <Card title="Application 01" className='ant-card-gb' bordered={true}>

          <div><Button type="link" onClick={() => addTab('Report', () => <Report />)}>Report</Button></div>
          <div><Button type="link" onClick={() => addTab('Register', () => <Register />)}>Register</Button></div>

        </Card>
      </Col>
      <Col span={8}>
        <Card title="Application 02" className='ant-card-gb' bordered={true}>
          <div><Button type="link" onClick={() => addTab('Spin', () => <Spin />)}>Spin</Button></div>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Application 03" className='ant-card-gb' bordered={true}>
          Card content
        </Card>
      </Col>
    </Row>

    <Divider orientation="left"></Divider>
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Application 04" className='ant-card-gb' bordered={true}>
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Application 05" className='ant-card-gb' bordered={true}>
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Application 06" className='ant-card-gb' bordered={true}>
          Card content
        </Card>
      </Col>

    </Row>
  </div>
}

export default cards