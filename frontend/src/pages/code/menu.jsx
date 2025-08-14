import { useState,useEffect } from "react";
import styles from "./code.module.css";
import Section from "./section";
function Menu({cats,dishes}) {
    const [dish,setDish]=useState(dishes||[]);
    useEffect(() => {
    if (cats?._id && dishes) {
      setDish(dishes.filter(d => String(d.categoryId) === String(cats._id)));
    }
  }, [cats, dishes]);
    return(
        <div className={styles.menu_column}>
            <div className={styles["cat-header"]}>
                <img src={`http://localhost:5000${cats.avatar}`} alt={cats.name} />
                <h5>{cats.name}</h5>
            </div>
            <div className={styles.dish}>
                {dish?.length>0?(
                    <div className={styles.dish_section}>
                        {dish.map(dish=>(
                            <Section key={dish._id} dish={dish} />
                        ))}
                    </div>)
                    :
                (<p>no dishes found</p>)}
            </div>
        </div>
    )
}
export default Menu;