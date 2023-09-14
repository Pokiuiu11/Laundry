import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Form, FormGroup, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React from 'react';



var md5 = require('md5');

function Login() {

    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    const onLogin = (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            doLogin();
        }

        setValidated(true);
    };

    const getAuthenToken = async () => {
        const response = await fetch(
            "http://localhost:8000/api/authen_request",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: md5(username)
                })
            }
        );

        const data = await response.json();

        // console.log(data);

        return data;
    };

    const getAccessToken = async (authToken) => {

        var baseString = username + "&" + md5(password);
        var authenSignature = md5(baseString);

        const response = await fetch(
            "http://localhost:8000/api/access_request",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    auth_signature: authenSignature,
                    auth_token: authToken
                })
            }
        );

        const data = await response.json();
        // console.log(data);
        return data;

    };


    const doLogin = async () => {
        const data1 = await getAuthenToken();
        const authToken = data1.data.auth_token;

        const data2 = await getAccessToken(authToken);


        localStorage.setItem("access_token", data2.data.access_token);
        localStorage.setItem("user_id", data2.data.account_info.user_id);
        localStorage.setItem("username", data2.data.account_info.username);
        localStorage.setItem("first_name", data2.data.account_info.firstname);
        localStorage.setItem("last_name", data2.data.account_info.lastname);
        localStorage.setItem("email", data2.data.account_info.email);
        localStorage.setItem("role_id", data2.data.account_info.role_id);
        localStorage.setItem("role_name", data2.data.account_info.role_name);


        navigate('./home', { replace: false });
    };

    return (

        <div className='container m-auto'>
            <h1>Laundry</h1> {/* Add this line for the header */}
            <Form noValidate validated={validated} onSubmit={onLogin}>
                <div className='container m-auto'>
                    <Form noValidate validated={validated} onSubmit={onLogin}>
                        <Row className='mb-3'>
                            <FormGroup as={Col} controlId="validateUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    required
                                    type='text'
                                    placeholder='Username'
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    กรุณากรอก Username
                                </Form.Control.Feedback>
                            </FormGroup>
                        </Row>
                        <Row className='mb-3'>
                            <FormGroup as={Col} controlId='validatedPassword'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required
                                    type='password'
                                    placeholder='Password'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    กรุณากรอก Password
                                </Form.Control.Feedback>
                            </FormGroup>
                        </Row>
                        <Row>
                            <Col md={3}>
                                <Button type='submit'>Login</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Form>
        </div>



    );

}
export default Login;



