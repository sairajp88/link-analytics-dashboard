import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { createLinkAsync } from '../redux/linksSlice';

const CreateLink = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    const trimmedUrl = originalUrl.trim();
    if (!trimmedUrl) {
      setErrorMsg('Please enter a valid URL.');
      return;
    }

    const formattedUrl =
      trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')
        ? trimmedUrl
        : `https://${trimmedUrl}`;

    try {
      await dispatch(
        createLinkAsync({
          originalUrl: formattedUrl,
          customAlias,
          expiresAt: expirationDate,
        })
      ).unwrap();

      setSuccessMsg('✅ Link created successfully!');
      setOriginalUrl('');
      setCustomAlias('');
      setExpirationDate('');
    } catch (err) {
      setErrorMsg(err || '❌ Failed to create link.');
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card style={{ width: '100%', maxWidth: '600px', padding: '30px' }} className="shadow-sm">
      <h2 className="mb-4 text-center">
  <span style={{ color: '#0d6efd', fontWeight: 'bold' }}>🔗 Shorten</span>{' '}
  <span style={{ color: '#6c757d' }}>Your Long URLs</span>
</h2>
<p className="text-muted text-center mb-4" style={{ fontSize: '0.95rem' }}>
  Customize your links, set expiry dates, and track performance easily.
</p>


        {successMsg && <Alert variant="success">{successMsg}</Alert>}
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formOriginalUrl">
            <Form.Label><strong>Original URL</strong></Form.Label>
            <Form.Control
              type="url"
              placeholder="e.g. https://example.com"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCustomAlias">
            <Form.Label><strong>Custom Alias</strong> <span className="text-muted">(optional)</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. my-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formExpiration">
            <Form.Label><strong>Expiration Date</strong> <span className="text-muted">(optional)</span></Form.Label>
            <Form.Control
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit" size="lg">
              🚀 Shorten Link
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default CreateLink;
