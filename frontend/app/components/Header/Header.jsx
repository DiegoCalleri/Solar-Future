'use client'
import { Button } from "react-bootstrap"
import { Navbar } from "react-bootstrap"
import { Container } from "react-bootstrap"
import { Nav } from "react-bootstrap"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "../AuthForm/AuthForm"
import { Popup } from "../Popup/Popup"
import { useDispatch } from "react-redux"
import { logout, openPopup, closePopup } from '../../redux/features/counter/counterSlice';
import { useSelector } from "react-redux"


export const Header = () => {

  const user = useSelector((state) => state.counter.user)
  const [isAuthorized, setIsAuthorized] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    user ? setIsAuthorized(true) : setIsAuthorized(false)
  }, [user])


  const handleLogout = () => {
    dispatch(logout());
    setIsAuthorized(false);
    // Перенаправляем на главную страницу
    router.push('/');
  };


  return (
    <Navbar expand="lg" className="bg-body-tertiary" variant="light" bg="light" data-bs-theme="light"> 
      <Container fluid>
        <Navbar.Brand href="/">Solar Future</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            navbarScroll
          >
            <Nav.Link href="/devices">мои устройства</Nav.Link>
            <Nav.Link href="/order">заказать установку</Nav.Link>
            <Nav.Link href="/team">команда</Nav.Link>
          </Nav>
          {isAuthorized && user?.username && (
            <Navbar.Text className="me-3">
              <span style={{ color: '#666', fontSize: '0.9rem' }}>
                Пользователь: <strong>{user.username}</strong>
              </span>
            </Navbar.Text>
          )}
          <Button variant="outline-success">
          {isAuthorized ? (
            <span onClick={handleLogout}>
              Выйти
            </span>
          ) : (
            <span onClick={() => dispatch(openPopup())}>
              Войти
            </span>
          )}
          </Button>
        </Navbar.Collapse>
      </Container>
      <Popup >
        <AuthForm setAuth={setIsAuthorized}/>
      </Popup>
    </Navbar>

  )
}
