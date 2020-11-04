import { Card, Col, Row, Divider, Button, Typography } from 'antd';
import Report from '../Report/index.js'
import Spin from '../Spin/index.js'
import Register from '../Register/index.js'
import Chart from '../Chart/index.js'

const { Title, Paragraph, Link } = Typography;

const cards = ({ addTab }) => {

  return <div className="site-card-wrapper">
    <Title level={2}> My Favorite</Title>

    <Row gutter={16}>
      <Col span={8}>
        <Card title="Application 01" className='ant-card-gb' bordered={true}>

          <Paragraph>
            <ul>
              <li>
                <Link onClick={() => addTab('Report', () => <Report />)}>Report</Link>
              </li>
              <li>
                <Link onClick={() => addTab('Register', () => <Register />)}>Register</Link>
              </li>
            </ul>
          </Paragraph>

        </Card>
      </Col>
      <Col span={8}>
        <Card title="Application 02" className='ant-card-gb' bordered={true}>
          <Paragraph>

            <ul>
              <li>
                <Link onClick={() => addTab('Spin', () => <Spin />)}>Spin</Link>
              </li>
              <li>
                <Link onClick={() => addTab('Chart', () => <Chart />)}>Chart</Link>
              </li>
            </ul>
          </Paragraph>
        </Card>
      </Col>

    </Row>


  </div>
}

export default cards