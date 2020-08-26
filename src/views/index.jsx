var React = require('react');
const BaseLayout = require('./layouts/base');
import { Col, Row,Card,Form,FormGroup,Button,Container,Image } from 'react-bootstrap';

function Index(props) {
    return (<BaseLayout title={props.title}>
        <Container>
            <Row>
                <Col className="col-sm-6">
                    <div className="text-start" style={{paddingTop:'40%',paddingLeft:'25%',paddingRight:'25%'}}>
                            <h1 className="text-primary" >চিঠি এপ</h1>
                            <h6 className="text-black" >কথা হোক বাঁধভাঙা</h6>
                    </div>
                </Col>

                <Col className="col-sm-6">
                    <img src="/images/screen.png" style={{paddingTop:'15%',paddingLeft:'15%',paddingRight:'15%',width:"80%" }}></img>
                </Col>
            </Row>
        </Container>
    </BaseLayout>)
  }
  
  module.exports = Index;