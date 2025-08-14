import styles from "./code.module.css"
function Section({dish}) {
    return(
        <div className={styles.section}>
            <img src={`http://localhost:5000${dish.avatar}`} alt={dish.name} />
            <p>{dish.name}</p>
            <h5>{dish.price} DA</h5>
        </div>
    )
}
export default Section;