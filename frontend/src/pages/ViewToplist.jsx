import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Col, Row, Button } from "react-bootstrap";
import ToplistItemImage from "../components/ToplistItemImage";

function Toplist() {
    const [toplist, setToplist] = useState({});
    const [hasLiked, setHasLiked] = useState(false);
    const viewsUpdatedRef = useRef(false);
    const { authUser, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const { id } = useParams();

    const handleToplistEdit = () => {
        navigate(`/toplists/${id}/edit`, { state: toplist });
    };

    const handleToplistDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete the toplist?"
        );

        if (confirmed) {
            try {
                const accessToken = localStorage.getItem("accessToken");
                await axios.delete(
                    `${import.meta.env.VITE_API_URL}/toplists/${
                        toplist.toplist_id
                    }`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                navigate("/", {
                    state: { successAlert: "Toplist deleted successfully" },
                });
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleToplistItems = () => {
        navigate(`/toplists/${id}/items`, { state: toplist });
    };

    const handleToplistLike = async () => {
        if (!isLoggedIn) {
            alert("Login required");
            return;
        }
        try {
            const accessToken = localStorage.getItem("accessToken");
            await axios.post(
                `${import.meta.env.VITE_API_URL}/toplists/likes`,
                {
                    toplist_id: toplist.toplist_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (hasLiked) {
                setHasLiked(false);
                toplist.like_count -= 1;
            } else {
                setHasLiked(true);
                toplist.like_count += 1;
            }
        } catch (e) {
            console.error(e);
        }
    };

    function getBackgroundColor(rank) {
        if (rank === 1) {
            return "gold";
        } else if (rank === 2) {
            return "silver";
        } else if (rank === 3) {
            return "#AA8954";
        } else {
            return "white";
        }
    }

    useEffect(() => {
        if (toplist && authUser && toplist.like_ids) {
            for (const id of toplist.like_ids) {
                if (id == authUser.userID) {
                    setHasLiked(true);
                    return;
                }
            }
        }
        setHasLiked(false);
    }, [toplist, authUser]);

    useEffect(() => {
        const updateToplistViews = async () => {
            await axios
                .post(`${import.meta.env.VITE_API_URL}/toplists/views/${id}`)
                .catch((error) => {
                    console.error(error);
                });
            viewsUpdatedRef.current = true;
        };

        const fetchToplistData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/toplists/${id}`
                );
                let toplist = response.data;
                if (toplist.items) {
                    const sortedItems = toplist.items.sort(
                        (a, b) => a.rank - b.rank
                    );
                    toplist.items = sortedItems;
                }
                setToplist(toplist);
            } catch (error) {
                console.error(error);
            }
        };

        if (!viewsUpdatedRef.current) {
            updateToplistViews();
        }
        fetchToplistData();
    }, []);
    return (
        <>
            <Container style={{ width: "80%", margin: "2rem auto" }}>
                <Row className="my-4">
                    <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                        <div style={{ display: "flex" }}>
                            <h1>{toplist.title}</h1>

                            {isLoggedIn &&
                            Number(toplist.user_id) ===
                                Number(authUser.userID) ? (
                                <span
                                    className="mx-2 emojiBtn"
                                    onClick={handleToplistEdit}
                                >
                                    ✏️
                                </span>
                            ) : null}
                        </div>
                        <p>
                            <em>Made by: {toplist.username}</em>
                        </p>
                        <p>{toplist.description}</p>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                        <div className="d-flex justify-content-end">
                            <Button
                                variant="secondary"
                                className={`my-3 ${
                                    hasLiked ? "" : "brand-button"
                                }`}
                                onClick={handleToplistLike}
                            >
                                🤍 {toplist.like_count}
                            </Button>
                        </div>
                    </Col>
                </Row>
                {toplist.items && (
                    <>
                        {toplist.items.map((item) => (
                            <React.Fragment key={item.item_id}>
                                <Row className="my-5">
                                    <Col xs={2} s={1} md={1}>
                                        <div
                                            style={{
                                                backgroundColor:
                                                    getBackgroundColor(
                                                        item.rank
                                                    ),
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <h5 style={{ marginBottom: "0px" }}>
                                                {item.rank}
                                            </h5>
                                        </div>
                                    </Col>
                                    <Col
                                        xs={10}
                                        s={6}
                                        md={4}
                                        style={{ maxWidth: "220px" }}
                                    >
                                        {item.image_path && (
                                            <ToplistItemImage item={item} />
                                        )}
                                    </Col>
                                    <Col xs={12} s={5} md={7} className="mx-4">
                                        <h5>{item.title}</h5>
                                        <p>{item.description}</p>
                                    </Col>
                                </Row>
                                <hr />
                            </React.Fragment>
                        ))}
                    </>
                )}

                {isLoggedIn &&
                Number(toplist.user_id) === Number(authUser.userID) ? (
                    <div className="my-5">
                        {toplist.items === null ? (
                            <Button
                                variant="outline-primary"
                                className="brand-button-outline"
                                onClick={handleToplistItems}
                            >
                                Add items
                            </Button>
                        ) : (
                            <Button
                                variant="outline-primary"
                                className="brand-button-outline"
                                onClick={handleToplistItems}
                            >
                                Edit items
                            </Button>
                        )}

                        <Button
                            variant="outline-secondary"
                            onClick={handleToplistDelete}
                            className="mx-2"
                        >
                            Delete Toplist
                        </Button>
                    </div>
                ) : null}
            </Container>
        </>
    );
}

export default Toplist;
