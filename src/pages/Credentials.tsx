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
import Toast from 'react-bootstrap/Toast';
import CSVUpload from '../components/CSVUpload';


const Credentials = () => {

  const [userData, setUserData] = useState({ email: "" });
  const [credentials, setCredentials] = React.useState([]);
  const [currentCredentialsPage, setCurrentCredentialsPage] = React.useState(1);
  const [totalCredentialsPages, setTotalCredentialsPages] = React.useState(1);
  const [devices, setDevices] = React.useState([]);
  const [deviceID, setDeviceID] = React.useState("");
  const [isOpen, setOpen] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState("");
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [website, setWebsite] = React.useState("");
  const [isOpenCSVupload, setOpenCSVupload] = React.useState(false);

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
        fetch(`${API_URL}/credentials`).then((res) => {
          return res.json();
        })
        .then((data) => {
          setCredentials(data.data);
          setCurrentCredentialsPage(data.currentPage);
          setTotalCredentialsPages(data.totalPages);
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
        setCredentials(data.data);
        setCurrentCredentialsPage(data.currentPage);
        setTotalCredentialsPages(data.totalPages);
      });
    }
    catch(error) {
      console.log('Error fetching dashboard data', error);
    }
  }


  const createCredential = async () => {
    setLoading(true);
    setErrMessage("");
    if(!website) { setErrMessage("Please fill out website field!"); return; }
    if(!deviceID) { setErrMessage("Please fill out device field!"); return; }
    if(!username) { setErrMessage("Please fill out username field!"); return; }
    if(!password) { setErrMessage("Please fill out password field!"); return; }
    const token = localStorage.getItem('token');
     try {
        const response = await axios.post(`${API_URL}/credentials`,
        {
            website,
            username,
            password,
            device_id:deviceID
        },
        {
            headers: { Authorization: token }, 
        });
        
        if(response.status === 200) {
            setOpen(false);
            alert(response.data.message);
            window.location.reload();
        }

    } catch (err: any) {
      setErrMessage(err.message);
      setErrMessage(err.response.data.message);  // Display error message if  fails
      setLoading(false);
    }
  }


  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDeviceID(`${e.target.value}`)
  }

  const handleDelete = async (id: number) => {
    if(window.confirm("Are you really to delete this item?")){

    } else {
        return;
    }
    
    const token = localStorage.getItem('token');
     try {
        const response = await axios.delete(`${API_URL}/credentials/${id}`,
        {
            headers: { Authorization: token }, 
        });
        
        if(response.status === 200) {
            alert(response.data.message);
            window.location.reload()
        }

    } catch (err: any) {
      setErrMessage(err.message);
    }
  }
  
  if (!userData) return <div>Loading...</div>;

  return <>
    <div style={{ marginBottom: 5 }}>Welcome, {userData?.email}!</div>
    <Box sx={{ width: '100%', typography: 'body1', marginTop: 5 }}>
        <Button type="submit" variant="primary" onClick={() => setOpen(true)}>Add Credential</Button><span>&nbsp;</span>
        <Button type="submit" variant="primary" onClick={() => setOpenCSVupload(true)}>CSV Upload</Button>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <PaginationTable data={credentials} columns={["device_id", "website", "username", "password"]} rowsPerPage={5} isDelete currentPage={currentCredentialsPage} goToPage={goToLogPage} handleDelete={handleDelete} totalPages={totalCredentialsPages}/>          
        </Box>

        <Modal
            size="lg"
            show={isOpen}
            onHide={() => setOpen(false)}
        >
            <Modal.Header closeButton>
            <Modal.Title id="modal-sizes-title-lg" className='modal-sizes-title-lg'>
                <h2>Create credential</h2>
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!!errMessage && 
                    <Alert key={"danger"} variant={"danger"}>
                        {errMessage}
                    </Alert>
                }
                <Row>
                    <Col sm="6">
                        <Form.Label column sm="4">
                            Device
                        </Form.Label>
                        <Form.Select onChange={handleDeviceChange}>
                        <option value={""}></option>
                        {devices && devices.map((log: Item, i) => 
                        {
                            if(log.device) {
                                return (
                                    <option value={log.device} key={log.device}>{log.device}</option>
                                )
                            }
                        })}
                        </Form.Select>
                    </Col>
                    <Col sm="6">
                        <Form.Label column sm="4">
                            Website
                        </Form.Label>
                        <Form.Control type="input" placeholder="website" 
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col sm="6">
                        <Form.Label column sm="4">
                            Username
                        </Form.Label>
                        <Form.Control type="input" placeholder="username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                    </Col>
                    <Col sm="6">
                        <Form.Label column sm="4">
                            Password
                        </Form.Label>
                        <Form.Control type="input" placeholder="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </Col>
                </Row>    
                <Row>    
                    <Button  variant="primary" onClick={createCredential} style={{ marginTop: "35px" }} disabled={isLoading}>{isLoading ? 'Loading…' : 'Create Credential'}</Button>
                </Row>    
            </Modal.Body>
        </Modal>

        <Modal
            size="lg"
            show={isOpenCSVupload}
            onHide={() => setOpenCSVupload(false)}
        >
            <Modal.Header closeButton>
            <Modal.Title id="modal-sizes-title-lg" className='modal-sizes-title-lg'>
                <h2>Upload CSV</h2>
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CSVUpload />
            </Modal.Body>
        </Modal>
    </Box>
  </>;
};

export default Credentials;
