import styles from "./code.module.css"
function Section({dish}) {
    return(
        <div className={styles.section}>
            <img src={dish.image_url} alt={dish.name} />
            <p>{dish.name}</p>
            <h5>{dish.price} DA</h5>
        </div>
    )
}
export default Section;