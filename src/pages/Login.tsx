import React, { useState } from 'react';
import { login, encrypt } from '../auth/authService';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAccess, setAccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const fetchEncrypt = async () => {
      const queryParams = new URLSearchParams(location.search);
      const access = queryParams.get('access'); 
      setAccess(!!access);
      if(!!access) {
        try {
          const result = await encrypt(access);
          setEmail(result.username);
          setPassword(result.password);
        } catch (err: any) {
          setError(err.message);
        }
      }
    }
    fetchEncrypt();
  })


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="sign-in__wrapper">
      <h2>Login</h2>
      <Form onSubmit={handleLogin} className="shadow p-4 bg-white rounded">
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="4">
          Email Address
        </Form.Label>
        <Col sm="8">
          <Form.Control type="email" placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isAccess}
            required />
        </Col>
        </Form.Group>

        {!isAccess && <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="4">
            Password
          </Form.Label>
          <Col sm="8">
            <Form.Control type="password" placeholder="Password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
             disabled={isAccess}
             hidden={isAccess}
             />
          </Col>
        </Form.Group>}

        {error && <div style={{ color: 'red' }}>{error}</div>}
        <Button type="submit" variant="success">Login</Button>
      </Form>
    </div>
  );
};

export default Login;
