import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";
import styles from "./code.module.css";
import Menu from "./menu";
import image from "../../assets/mr-removebg-preview (4).png";
import { useParams } from "react-router-dom";

function Code() {
    const { slug } = useParams();
    const [cat, setCat] = useState([]);
    const [restaurantName, setRestaurantName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get restaurant by slug
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("id, name")
                    .eq("slug", slug)
                    .single();

                if (profileError || !profile) {
                    console.error("No restaurant found with that slug");
                    return;
                }

                setRestaurantName(profile.name); // optional: show dynamic restaurant name

                // 2. Get categories & dishes for this restaurant
                const { data: categories, error: catError } = await supabase
                    .from("categories")
                    .select(`*, dishes (id, name, price, image_url)`)
                    .eq("restaurant_id", profile.id);

                if (catError) throw catError;

                if (categories.length > 0) {
                    setCat(categories);
                }
            } catch (err) {
                console.error("Error fetching data:", err.message);
            }
        };

        fetchData();
    }, [slug]); // depend on slug so it refetches if URL changes

    return (
        <div className={styles.body}>
            <div className={styles["header-center"]}>
                <div className={styles.inside}>
                    <img src={image} alt={restaurantName || "MR YUMMY"} />
                    <h3>{restaurantName || "MR YUMMY"}</h3>
                </div>
                <h1>MENU:</h1>
            </div>
            {cat.length > 0 ? (
                <div className={styles.menu}>
                    {cat.map((cats) => (
                        <Menu key={cats.id} cats={cats} />
                    ))}
                </div>
            ) : (
                <h2>No menu found.</h2>
            )}
        </div>
    );
}

export default Code;
