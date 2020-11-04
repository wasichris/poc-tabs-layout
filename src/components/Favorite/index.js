import { Card, Col, Row, Divider, Button } from 'antd';
import Report from '../Report/index.js'
import Spin from '../Spin/index.js'
import Register from '../Register/index.js'


const cards = ({addTab}) => {

  return <div className="site-card-wrapper">
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

    </Row>

    
  </div>
}

export default cards