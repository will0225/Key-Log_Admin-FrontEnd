import React, { useState } from 'react';
import { register } from '../auth/authService';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await register(email, password);  // Assuming register function is in authService.js
      navigate('/login');  // Redirect to login after successful registration
    } catch (err: any) {
      setError(err.message);  // Display error message if registration fails
    }
  };

  return (
    <div className="sign-in__wrapper">
      <h2>Register</h2>
      <Form onSubmit={handleRegister} className="shadow p-4 bg-white rounded">
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="4">
          Email Address
        </Form.Label>
        <Col sm="8">
          <Form.Control type="email" placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
        </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Form.Label column sm="4">
            Password
          </Form.Label>
          <Col sm="8">
            <Form.Control type="password" placeholder="Password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
             />
          </Col>
        </Form.Group>

        {error && <div style={{ color: 'red' }}>{error}</div>}
        <Button type="submit" variant="success">Register</Button>
      </Form>
    </div>
  );
};

export default Register;
