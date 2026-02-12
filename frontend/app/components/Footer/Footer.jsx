'use client'
import { Container } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Styles from './Footer.module.css'

export const Footer = () => {
  const userData = useSelector((state) => state.counter.userData)
  const email = process.env.NEXT_PUBLIC_EMAIL || 'contact@example.com'

  return (
    <Navbar className="bg-body-tertiary">
      <Container fluid >
        <Navbar.Brand href="#home">Solar Future</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <div className={Styles["footer__links"]}>
          <Nav.Link href={`mailto:${email}`}>{email}</Nav.Link>
          {userData.role == 'admin' &&
            <Nav.Link href="/managment">администрация</Nav.Link>}
        </div>
      </Container>
    </Navbar>
  );
}

