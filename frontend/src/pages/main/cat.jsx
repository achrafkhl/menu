import styles from "./main.module.css";
function Cat({cats, isSelected, onClick, onDeleteCat }){
    const display = () =>document.getElementById(cats._id+1).style.visibility = "visible"
    const hide = () =>document.getElementById(cats._id+1).style.visibility = "hidden"
    return(
        <div className={styles.radio} onClick={onClick} onMouseOver={display} onMouseLeave={hide}>
            <input type="radio" name="cats" id={cats._id} style={{display:"none"}} defaultChecked={isSelected}/>
            <label htmlFor={cats._id} className={styles.ster}>
            <div className={styles["ster-left"]}>
                <img src= {`http://localhost:5000${cats.avatar}`} alt={cats.name} />
                <p>{cats.name}</p>
              </div>
              <div className={styles["ster-right"]}>
                <p>({Array.isArray(cats.dishes) ? cats.dishes.length : 0})</p>
                <i className="fas fa-trash" id={cats._id+1} style={{visibility:"hidden",marginLeft:"10px"}} onClick={e => { e.stopPropagation(); onDeleteCat(); }}></i>
              </div>
            </label>
        </div>
    )
}
export default Cat;