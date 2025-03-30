import React, { useEffect, useState } from 'react';
import { Item, logout, ScreenshotItem } from '../auth/authService';
import axios from 'axios';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { API_URL, BASE_URL, UPLOAD_URL } from '../config/index';
import PaginationTable from '../components/PaginationTable';
import Pager from '../components/Pager';
import Modal from 'react-bootstrap/Modal';

const Dashboard = () => {

  const [userData, setUserData] = useState({ email: "" });
  const [logs, setLogs] = React.useState([]);
  const [searchLog, setSearchLog] = React.useState("");
  const [searchDate, setSearchDate] = React.useState("");
  const [itemData, setItemData] = React.useState([]);
  const [currentLogPage, setCurrentLogPage] = React.useState(1);
  const [totalLogPages, setTotalLogPages] = React.useState(1);
  const [devices, setDevices] = React.useState([]);
  const [deviceID, setDeviceID] = React.useState("");
  const [currentScreenPage, setCurrentScreenPage] = React.useState(1);
  const [totalScreenPages, setTotalScreenPages] = React.useState(1);
  const [modalImage, setModalImage] = React.useState("");

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
        fetch(`${API_URL}/logs`).then((res) => {
          return res.json();
        })
        .then((data) => {
          setLogs(data.data);
          setCurrentLogPage(data.currentPage);
          setTotalLogPages(data.totalPages);
        });
      }
      catch(error) {
        console.log('Error fetching dashboard data', error);
      }
  }, [])

  React.useEffect(() => {
      try {
          fetch(`${API_URL}/screenshots`)
          .then((res) => {
          return res.json();
          })
          .then((data) => {console.log(data)
            setItemData(data.data);
            setCurrentScreenPage(data.currentPage);
            setTotalScreenPages(data.totalPages);
          });
        }
        catch(error) {
          console.log('Error fetching dashboard data', error);
        }
  }, []);

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
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(`${API_URL}/search`,
        {
            searchLog,
            searchDate,
            deviceID
        },
        {
          headers: { Authorization: token }, 
        });
        setLogs(response.data.data);
        setUserData(response.data.user);
        setCurrentLogPage(response.data.currentPage);
        setTotalLogPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
  }

  const goToLogPage = (currentPage: number) => {
    try {
      fetch(`${API_URL}/logs?page=${currentPage}&device=${deviceID}`).then((res) => {
        return res.json();
      })
      .then((data) => {
        setLogs(data.data);
        setCurrentLogPage(data.currentPage);
        setTotalLogPages(data.totalPages);
      });
    }
    catch(error) {
      console.log('Error fetching dashboard data', error);
    }
  }

  const goToScreenPage = (pageNumber: number) => {

    try {
      fetch(`${API_URL}/screenshots?page=${pageNumber}&device=${deviceID}`).then((res) => {
        return res.json();
      })
      .then((data) => {
        setItemData(data.data);
        setCurrentScreenPage(data.currentPage);
        setTotalScreenPages(data.totalPages);
      });
    }
    catch(error) {
      console.log('Error fetching dashboard data', error);
    }
  }

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDeviceID(`${e.target.value}`)
  }
  
  if (!userData) return <div>Loading...</div>;

  return <>
    <div style={{ marginBottom: 5 }}>Welcome, {userData?.email}!</div>
    <Card body>
      <Form onSubmit={handleSearch} >
        <Form.Group as={Row} className="mb-3" controlId="formKeyLogSearch">
          <Col sm="2" key={2}>
            <Form.Select onChange={handleDeviceChange}>
              <option value="" key={"all"}>All</option>
              {devices && devices.map((log: Item, i) => (
                  <option value={log.device} key={log.device}>{log.device}</option>
              ))}
            </Form.Select>
          </Col>
          <Col sm="5" key={3}>
            <Form.Control type="input" placeholder="Logs" 
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              />
          </Col>
          <Col sm="3" key={4}>
            <Form.Control type="date" placeholder="Logs" 
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              />
          </Col>
          <Col sm="2" key={5}>
            <Button type="submit" variant="secondary">Search</Button>
          </Col>
        </Form.Group>
      </Form>
    </Card>
    <Box sx={{ width: '100%', typography: 'body1', marginTop: 5 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            defaultActiveKey="keylog"
            id="uncontrolled-tab"
            className="mb-3"
          >
            <Tab eventKey="keylog" title="keylog">
              <PaginationTable data={logs} columns={["date", "time", "site", "device", "log"]} rowsPerPage={5} currentPage={currentLogPage} goToPage={goToLogPage} totalPages={totalLogPages}/>
            </Tab>
            <Tab eventKey="sceenshot" title="screenshot">
                <ImageList sx={{ width: "100%" }} cols={8}>
                
                  { itemData && itemData.map((item: ScreenshotItem) => {
                    
                    var shortTitle = item.site;
                    shortTitle= shortTitle.length > 20 ? shortTitle.substring(0, 20)+"...": shortTitle;

                    return (
                      <ImageListItem key={item.id}>
                        
                        <img
                          srcSet={`${UPLOAD_URL}/${item.screenshot}`}
                          src={`${UPLOAD_URL}/${item.screenshot}`}
                          alt={item.site}
                          loading="lazy"
                          width="30px"
                          onClick={() => setModalImage(`${UPLOAD_URL}/${item.screenshot}`)}
                        />
                        <ImageListItemBar
                          title={item.date}
                          subtitle={<span>{shortTitle}</span>}
                          position="below"
                          onClick={() => setModalImage(`${UPLOAD_URL}/${item.screenshot}`)}
                        />
                       
                      </ImageListItem>
                    )
                  })}

                </ImageList>      
                <Pager currentPage={currentScreenPage} totalPages={totalScreenPages} goToPage={goToScreenPage}/>
                <Modal
                  size="lg"
                  show={!!modalImage}
                  onHide={() => setModalImage("")}
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="modal-sizes-title-lg">
                      
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                        <img
                          src={modalImage || undefined}
                          alt={""}
                          loading="lazy"
                          width="100%"
                        />
                  </Modal.Body>
                </Modal>
            </Tab>
          </Tabs>
        </Box>
    </Box>
  </>;
};

export default Dashboard;
