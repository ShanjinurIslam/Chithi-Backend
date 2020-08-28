var React = require('react');
var BaseLayout = require('./layouts/base');
const { Row, Col, Container, Form, FormGroup, Button } = require('react-bootstrap');



function MessageForm(props) {
    return (
        <Form>
            <FormGroup>
                <input id="userID" className="form-control" placeholder="User ID" ></input>
            </FormGroup>
            <FormGroup>
                <textarea hidden={true} id="messageBox" className="form-control" rows="5" placeholder="Enter Your Message"></textarea>
            </FormGroup>
            <FormGroup>
                <button id="control" className="btn btn-primary btn-block"><b>Join</b></button>
            </FormGroup>
        </Form>
    )
}

class Broadcast extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <BaseLayout title={this.props.title} myScript="/js/test.js">
                <Container className="text-start" style={{ paddingTop: "5%" }}>
                    <h2>Socket Test Center</h2>
                    <br />
                    <Row>
                        <Col className="col-sm-8">
                            <h4 id='intro_title'>Enter your ID</h4>
                            <MessageForm></MessageForm>
                        </Col>
                        <Col className="text-right">
                            <h3>Active Users</h3>
                            <div className="overflow-auto" id="activeList">

                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h3>Chat Room</h3>
                        </Col>
                    </Row>
                    <br />
                    <p id="messages"></p>
                </Container>
            </BaseLayout>
        )
    }
}

module.exports = Broadcast