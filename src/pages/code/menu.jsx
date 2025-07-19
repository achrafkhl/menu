import styles from "./code.module.css";
import Section from "./section";
function Menu({cats}) {
    return(
        <div className={styles.menu_column}>
            <div className={styles["cat-header"]}>
                <img src={cats.image_url} alt={cats.name} />
                <h5>{cats.name}</h5>
            </div>
            <div className="dish">
                {cats.dishes.length>0?(
                    <div className={styles.dish_section}>
                        {cats.dishes.map(dish=>(
                            <Section key={dish.id} dish={dish} />
                        ))}
                    </div>)
                    :
                (<p>no dishes found</p>)}
            </div>
        </div>
    )
}
export default Menu;