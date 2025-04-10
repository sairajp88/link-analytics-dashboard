import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const AppNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
      <Navbar.Brand as={NavLink} to="/" end className="navbar-brand-custom">
  Link <span className="highlight">Analytics</span>
</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-center">
            {user && (
              <>
                <NavLink to="/" end className="nav-link nav-link-custom">
                  Dashboard
                </NavLink>
                <NavLink to="/create" className="nav-link nav-link-custom">
                  Create Link
                </NavLink>
                <NavLink to="/all-links" className="nav-link nav-link-custom">
                  All Links
                </NavLink>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-light small">👤 {user.email}</span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <NavLink to="/login" className="nav-link nav-link-custom">
                Login
              </NavLink>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
