import supabase from "../../config/supabaseClient";
import { useState,useEffect } from "react";
import styles from "./code.module.css";
import Menu from "./menu";
function Code() {
    const [cat,setCat]= useState("");
    useEffect(()=>{
        const fetchData = async() => {
            try {
            const { data, error } = await supabase.from("categories").select(`*,dishes (id, name, price, image_url)`);
            if (error) throw error;
            
            if(data.length>0){
                setCat(data);
            }


        } catch (err) {
            console.error("Error fetching categories:", err.message);
        }
    };
    fetchData();
    },[])
    return(
        <div className={styles.body}>
            <h3>img+name</h3>
            <h1>MENU:</h1>

        
            {cat.length>0 ? (
                            <div className={styles.menu}>
                                {cat.map(cats=>(
                            <Menu key={cats.id} cats={cats} />
                        ))}
                            </div>
                        ) : (
                    <h2>No menu found.</h2>
                )}
        </div>
    )
}
export default Code;