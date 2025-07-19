import styles from "./main.module.css"
function Dish({dish, onDeleteDish,onChangePrice}) {
    return(
        <div className={styles.dish_ster}>
            <img src={dish.image_url} alt={dish.name} />
            <p>{dish.name}</p>
            <p>{dish.price} DA</p>
            <button className={styles.edit} onClick={onChangePrice}>change price</button>
            <button className={styles.delete} onClick={onDeleteDish}>delete</button>
        </div>
    );
}
export default Dish