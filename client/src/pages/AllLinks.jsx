import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, InputGroup, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLinks, deleteLinkAsync } from '../redux/linksSlice';

const BACKEND_BASE_URL = 'http://localhost:5000';

const AllLinks = () => {
  const dispatch = useDispatch();
  const { list: links, loading, error } = useSelector((state) => state.links);

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchLinks());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      dispatch(deleteLinkAsync(id));
    }
  };

  const handleCopy = (shortUrl) => {
    const fullUrl = `${BACKEND_BASE_URL}/${shortUrl}`;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => alert('Short URL copied to clipboard!'))
      .catch(() => alert('Failed to copy.'));
  };

  const filteredLinks = links.filter((link) =>
    link.originalUrl.toLowerCase().includes(searchText.toLowerCase()) ||
    link.shortUrl.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const paginatedLinks = filteredLinks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="mt-4">
      <h2 className="mb-3 text-center">
        <span style={{ color: '#0d6efd', fontWeight: 'bold' }}>📋 All</span>{' '}
        <span style={{ color: '#6c757d' }}>Shortened Links</span>
      </h2>

      {/* Search + Pagination Controls */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 my-3">
        <InputGroup style={{ maxWidth: '350px' }}>
          <FormControl
            placeholder="Search links..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1); // Reset page when searching
            }}
          />
        </InputGroup>

        <div className="d-flex align-items-center">
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="me-2"
          >
            ◀ Previous
          </Button>
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages || 1}</strong>
          </span>
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="ms-2"
          >
            Next ▶
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Table striped bordered hover responsive className="text-center">
          <thead>
            <tr>
              <th>Original URL</th>
              <th>Short URL</th>
              <th>Clicks</th>
              <th>Expires</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLinks.map((link) => {
              const fullShortUrl = `${BACKEND_BASE_URL}/${link.shortUrl}`;
              return (
                <tr key={link._id || link.id}>
                  <td style={{ wordBreak: 'break-all' }}>{link.originalUrl}</td>
                  <td>
                    <a href={fullShortUrl} target="_blank" rel="noreferrer">
                      {fullShortUrl}
                    </a>
                  </td>
                  <td>{link.clickCount || 0}</td>
                  <td>
                    {link.expireAt
                      ? new Date(link.expireAt).toLocaleString()
                      : '—'}
                  </td>
                  <td>{new Date(link.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleCopy(link.shortUrl)}
                      >
                        Copy
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(link._id || link.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AllLinks;
