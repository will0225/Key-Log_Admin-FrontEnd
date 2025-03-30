import React, { useEffect, useState } from 'react';
import { Item, logout, register } from '../auth/authService';
import axios from 'axios';
import Box from '@mui/material/Box';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { API_URL, BASE_URL } from '../config/index';
import PaginationTable from '../components/PaginationTable';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import { useLocation } from 'react-router-dom';

const Users = () => {

  const [userData, setUserData] = useState({ email: "" });
  const [users, setUsers] = React.useState([]);
  const [searchLog, setSearchLog] = React.useState("");
  const [searchDate, setSearchDate] = React.useState("");
  const [currentUsersPage, setCurrentUsersPage] = React.useState(1);
  const [totalUsersPages, setTotalUsersPages] = React.useState(1);
  const [devices, setDevices] = React.useState([]);
  const [deviceID, setDeviceID] = React.useState("");
  const [isOpen, setOpen] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [registeredUserResponse, setRegisteredUserResponse] = React.useState({
    data: { encryptedString: ""},
    message: ""
  });
  const [randomUser, setRandomUser] = React.useState('');
  const [randomPassword, setRandomPassword] = React.useState('');
  

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`${API_URL}/dashboard`, {
          headers: { Authorization: token },
        });
        setUserData(response.data.user);
      } catch (error) {
        console.log('Error fetching dashboard data', error);
        logout();
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
      try {
        fetch(`${API_URL}/users`).then((res) => {
          return res.json();
        })
        .then((data) => {
          setUsers(data.data);
          setCurrentUsersPage(data.currentPage);
          setTotalUsersPages(data.totalPages);
        });
      }
      catch(error) {
        console.log('Error fetching dashboard data', error);
      }
  }, [])


  React.useEffect(() => {
    try {
        fetch(`${API_URL}/devices`)
        .then((res) => {
        return res.json();
        })
        .then((data) => {console.log(data)
        setDevices(data.data);
        });
      }
      catch(error) {
        console.log('Error fetching dashboard data', error);
      }
}, []);

  

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    //   const token = localStorage.getItem('token');
    //   try {
    //     const response = await axios.post(`${API_URL}/users`,
    //     {
    //         searchLog,
    //         searchDate,
    //         deviceID
    //     },
    //     {
    //       headers: { Authorization: token }, 
    //     });
    //     setLogs(response.data.data);
    //     setUserData(response.data.user);
    //     setCurrentUsersPage(response.data.currentPage);
    //     setTotalUsersPages(response.data.totalPages);
    //   } catch (error) {
    //     console.error('Error fetching dashboard data', error);
    //   }
  }

  const goToLogPage = (currentPage: number) => {
    try {
      fetch(`${API_URL}/users?page=${currentPage}&device=${deviceID}`).then((res) => {
        return res.json();
      })
      .then((data) => {
        setUsers(data.data);
        setCurrentUsersPage(data.currentPage);
        setTotalUsersPages(data.totalPages);
      });
    }
    catch(error) {
      console.log('Error fetching dashboard data', error);
    }
  }


  const onUserRegister = async () => {
    setLoading(true);

     try {
      const result = await register(generateUser(), generatePassword(), deviceID); 
       // Assuming register function is in authService.js
       setOpen(true);  // Redirect to login after successful registration
       setLoading(false);
       setRegisteredUserResponse(result);
    } catch (err: any) {
    //   setError(err.message);  // Display error message if registration fails
      setLoading(false);
      alert(err.message)
    }
  }

  // Function to generate random username
  const generateUser = () => {
    const randomString = Math.random().toString(36).substring(2, 10); // Random string between 6-8 characters
    setRandomUser(`${randomString}@keylog.com`);
    return `${randomString}@keylog.com`;
  };

  // Function to generate random password
  const generatePassword = () => {
    const randomPassword = Math.random().toString(36).substring(2, 12); // Random password between 8-10 characters
    setRandomPassword(randomPassword);
    return randomPassword;
  };

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDeviceID(`${e.target.value}`)
  }
  
  if (!userData) return <div>Loading...</div>;

  return <>
    <div style={{ marginBottom: 5 }}>Welcome, {userData?.email}!</div>
    <Card body>
      <Form 
    //   onSubmit={handleSearch} 
      >
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Col sm="3">
            <Form.Label column sm="4">
                Devices
            </Form.Label>
          </Col>
          <Col sm="5">
            <Form.Select onChange={handleDeviceChange}>
              <option value="">All</option>
              {devices && devices.map((log: Item, i) => (
                  <option value={log.device} key={log.id}>{log.device}</option>
              ))}
            </Form.Select>
          </Col>
          {/* <Col sm="5">
            <Form.Control type="input" placeholder="Logs" 
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              />
          </Col>
          <Col sm="3">
            <Form.Control type="date" placeholder="Logs" 
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              />
          </Col>
          <Col sm="2">
            <Button type="submit" variant="secondary">Search</Button>
          </Col> */}
        </Form.Group>
      </Form>
    </Card>
    <Box sx={{ width: '100%', typography: 'body1', marginTop: 5 }}>
        <Button type="submit" variant="primary" onClick={onUserRegister}>Add User</Button>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <PaginationTable data={users} columns={["user", "user_password", "device_id", "role", "url"]} rowsPerPage={5} currentPage={currentUsersPage} goToPage={goToLogPage} totalPages={totalUsersPages}/>          
        </Box>
        <Modal
            size="lg"
            show={isOpen}
            onHide={() => setOpen(false)}
        >
            <Modal.Header closeButton>
            <Modal.Title id="modal-sizes-title-lg">
                <h2>The user have been registered successfully!</h2>
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <ListGroup>
                <ListGroup.Item>Username: {randomUser}</ListGroup.Item>
                <ListGroup.Item>Password: {randomPassword}</ListGroup.Item>
                <ListGroup.Item style={{ wordBreak: 'break-word' }}>Login URL: {BASE_URL}/login/?access={registeredUserResponse?.data?.encryptedString}</ListGroup.Item>
            </ListGroup>
            </Modal.Body>
        </Modal>
    </Box>
  </>;
};

export default Users;
