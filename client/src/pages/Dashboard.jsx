import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Table, Button, Alert, Spinner, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import QRCode from 'react-qr-code';
import { fetchLinks, deleteLinkAsync } from '../redux/linksSlice';
import { FaLink, FaMousePointer, FaCopy, FaQrcode, FaTrashAlt } from 'react-icons/fa';

const BASE_URL = 'http://localhost:5000';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { list: links, loading, error } = useSelector((state) => state.links);
  const { user } = useSelector((state) => state.auth);

  const [analyticsMap, setAnalyticsMap] = useState({});
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchLinks());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const fetchAllAnalytics = async () => {
      if (!links || links.length === 0) return;
      setAnalyticsLoading(true);

      const map = {};

      for (const link of links) {
        try {
          const res = await fetch(`http://localhost:5000/api/links/${link._id}/analytics`);
          const data = await res.json();
          map[link._id] = data.userAgents || [];
        } catch (err) {
          console.error(`Error fetching analytics for ${link._id}`, err);
        }
      }

      setAnalyticsMap(map);
      setAnalyticsLoading(false);
    };

    if (links?.length) {
      fetchAllAnalytics();
    }
  }, [links]);

  const totalLinks = links?.length || 0;
  const totalClicks = Object.values(analyticsMap).reduce((sum, userAgents) => sum + userAgents.length, 0);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      dispatch(deleteLinkAsync(id));
    }
  };

  const handleCopy = (shortUrl) => {
    const fullUrl = `${BASE_URL}/${shortUrl}`;
    navigator.clipboard.writeText(fullUrl)
      .then(() => alert('Short URL copied to clipboard!'))
      .catch(() => alert('Failed to copy.'));
  };

  const handleShowQR = (shortUrl) => {
    const fullUrl = `${BASE_URL}/${shortUrl}`;
    setQrUrl(fullUrl);
    setShowQR(true);
  };

  const handleCloseQR = () => {
    setShowQR(false);
    setQrUrl('');
  };

  const recentLinks = links?.slice(-5).reverse() || [];

  const lineChartData = {
    labels: recentLinks.map((link) => new Date(link.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Clicks',
        data: recentLinks.map((link) => (analyticsMap[link._id]?.length || 0)),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: '#007bff',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const combinedUserAgents = Object.values(analyticsMap).flat();

  const parseBrowser = (ua) => {
    if (!ua) return 'Unknown';
    if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
    return 'Other';
  };

  const userAgentCounts = combinedUserAgents.reduce((acc, ua) => {
    const browser = parseBrowser(ua);
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(userAgentCounts),
    datasets: [
      {
        data: Object.values(userAgentCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8E44AD', '#1ABC9C', '#F39C12', '#34495E'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">📊 Dashboard Overview</h2>

      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm border-0 text-white bg-primary">
            <Card.Body>
              <Card.Title><FaLink className="me-2" />Total Links</Card.Title>
              <h3 className="fw-bold">{totalLinks}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm border-0 text-white bg-success">
            <Card.Body>
              <Card.Title><FaMousePointer className="me-2" />Total Clicks</Card.Title>
              <h3 className="fw-bold">{totalClicks}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>📈 Clicks Over Time</Card.Title>
              {recentLinks.length > 0 ? <Line data={lineChartData} /> : <p>No chart data available.</p>}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>🧭 Device Distribution</Card.Title>
              {analyticsLoading ? (
                <div className="text-center"><Spinner animation="border" /></div>
              ) : Object.keys(userAgentCounts).length > 0 ? (
                <Pie data={pieChartData} />
              ) : (
                <p>No analytics yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>🕒 Recent Links</Card.Title>
          {loading ? (
            <div className="text-center my-4"><Spinner animation="border" /></div>
          ) : error ? (
            <Alert variant="danger">Error: {error}</Alert>
          ) : totalLinks === 0 ? (
            <p>No links found.</p>
          ) : (
            <Table responsive hover className="align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Original URL</th>
                  <th>Short URL</th>
                  <th>Clicks</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentLinks.map((link, index) => (
                  <tr key={link._id}>
                    <td>{index + 1}</td>
                    <td style={{ maxWidth: '200px', wordBreak: 'break-word' }}>{link.originalUrl}</td>
                    <td className="text-primary">{`${BASE_URL}/${link.shortUrl}`}</td>
                    <td><span className="badge bg-info">{analyticsMap[link._id]?.length || 0}</span></td>
                    <td>{new Date(link.createdAt).toLocaleString()}</td>
                    <td>
                      <OverlayTrigger overlay={<Tooltip>Copy URL</Tooltip>}><Button size="sm" variant="outline-primary" className="me-1" onClick={() => handleCopy(link.shortUrl)}><FaCopy /></Button></OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Show QR</Tooltip>}><Button size="sm" variant="outline-secondary" className="me-1" onClick={() => handleShowQR(link.shortUrl)}><FaQrcode /></Button></OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}><Button size="sm" variant="outline-danger" onClick={() => handleDelete(link._id)}><FaTrashAlt /></Button></OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showQR} onHide={handleCloseQR} centered>
        <Modal.Header closeButton>
          <Modal.Title>🔳 QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <QRCode value={qrUrl} size={200} />
          <p className="mt-3 text-muted small">{qrUrl}</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard;
