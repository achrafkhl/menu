
import { useState, useEffect } from "react";
import styles from "./code.module.css";
import Menu from "./menu";
import { useParams } from "react-router-dom";

function Code() {
    const { slug } = useParams();
    const [cat, setCat] = useState([]);
    const [dish,setDish] = useState([]);
    const [restaurant, setRestaurant] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            if(!slug)return;
            try {
                // 1. Get restaurant by slug
                const res = await fetch(`http://192.168.1.5:5000/api/menu?slug=${slug}`, {
                method: "GET"
            });  
            const data = await res.json();
            if (!res.ok) {
                console.log("error fetching data", data.error);
                return;
            }

            if (res.ok) {
                setRestaurant(data.user);
                setCat(data.categories || "");
                setDish(data.dishes || "");
            }
        } catch (err) {
            
            console.error("Error connecting to server:", err);
        }

                
        };

        fetchData();
    }, [slug]); // depend on slug so it refetches if URL changes

    return (
        <div className={styles.body}>
            <div className={`${styles["header-center"]} ${styles.sticky_header}`}>
                {restaurant ? (
                    <div className={styles.inside}>
                    <img src={`http://192.168.1.5:5000${restaurant.avatar}`} alt={restaurant.username} />
                    <h3>{restaurant.username}</h3>
                </div>
                ) : (
                    <h1>Restaurant Name</h1>
                )}
                <h1>MENU:</h1>
            </div>
            {cat.length > 0 ? (
                <div className={styles.menu}>
                    {cat.map((cats) => (
                        <Menu key={cats._id} cats={cats} dishes={dish}/>
                    ))}
                </div>
            ) : (
                <h2>No menu found.</h2>
            )}
        </div>
    );
}

export default Code;
