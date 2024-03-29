import { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await login(email, password);
            navigate("/");
        } catch (error) {
            console.error(error);
            setShowErrorAlert(true);
        }
    };

    return (
        <Container style={{ maxWidth: "50%", margin: "3rem auto" }}>
            <div style={{ margin: "0 auto" }}>
                {showErrorAlert && (
                    <Alert
                        variant="danger"
                        onClose={() => setShowErrorAlert(false)}
                        dismissible
                    >
                        Login failed. Please check your email and password.
                    </Alert>
                )}
                <h1 style={{ marginBottom: "30px" }}>Login</h1>
                <Form onSubmit={handleLogin}>
                    <Form.Group
                        controlId="email"
                        style={{ marginBottom: "1rem" }}
                    >
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid email.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                        controlId="password"
                        style={{ marginBottom: "1rem" }}
                    >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Enter password"
                            minLength="8"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Password must be at least 8 characters.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="brand-button"
                    >
                        Login
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => navigate("/register")}
                        className="brand-button mx-2"
                    >
                        Sign up
                    </Button>
                    <Link
                        to={`/forgot-password`}
                        style={{
                            textDecoration: "none",
                            color: "#8b3dff",
                        }}
                    >
                        Forgot password? Click here
                    </Link>
                </Form>
            </div>
        </Container>
    );
}

export default Login;
