import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';

const LinkTable = () => {
  const links = useSelector((state) => state.links.list);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    alert('Short URL copied to clipboard!');
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Original URL</th>
          <th>Short URL</th>
          <th>Clicks</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {links.slice(0, 5).map((link, index) => (
          <tr key={link.id || index}>
            <td>{index + 1}</td>
            <td>{link.originalUrl}</td>
            <td>{link.shortUrl}</td>
            <td>{link.clicks}</td>
            <td>{link.createdAt}</td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => handleCopy(link.shortUrl)}
              >
                Copy
              </Button>
              <Button variant="outline-danger" size="sm">Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LinkTable;

