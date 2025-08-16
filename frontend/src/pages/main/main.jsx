import styles from "./main.module.css"
import { useState,useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import Cat from "./cat";
import Dish from "./dish";
import QRCodeDownload from "../../config/QRCodeDownload";

function Main() {
    const[cat,setCat]=useState([]);
    const[dish,setDish]=useState([]);
    const[catin,setCatin]=useState("");
    const[dishPrice,setDishPrice]=useState("");
    const[dishin,setDishin]=useState("");
    const[file,setFile]=useState("");
    const[dishPhoto,setDishPhoto]=useState("");
    const[pop,setPop]=useState(false);
    const[popDish,setPopDish]=useState(false);
    const[selectedProduct,setSelectedProduct]=useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteType, setDeleteType] = useState(null);
    const [newPrice,setNewPrice] = useState("");
    const [popPrice,setPopPrice] = useState(false);
    const [slug,setSlug] = useState("");
    const [signout,setSignout] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [userId,setUserId]= useState("");
    const [reload, setReload] = useState(false);

    const navigate = useNavigate();

useEffect(() => {
    const fetchData = async () => {
        
        try {
            const res = await fetch("http://192.168.1.5:5000/api/main", {
                method: "GET",
                credentials: "include" // Send cookies with request
            });  
            const data = await res.json();

            if (res.ok) {
                setUserId(data.user);
            } else {
                console.error("Error:", data.error || "Failed to fetch user");
            }
        } catch (err) {
            console.error("Error connecting to server:", err);
        }   
    };

    fetchData();
}, []); // [] makes sure it runs only once after mount

useEffect(()=>{
    const fetchCat = async() => {
        if(!userId) return
        try{
            const res = await fetch(`http://192.168.1.5:5000/api/main/categories?userId=${userId}`, {
                method: "GET",
                credentials: "include" // Send cookies with request
            });  
            const data = await res.json();

            if (res.ok) {
                setCat(data.categories)
                setSelectedProduct(data.categories[0]);
            } else {
                console.error("Error:", data.error);
            }
        } catch (err) {
            console.error("Error connecting to server:", err);
        }
    };
    fetchCat();
},[userId])

useEffect(()=>{
    const fetchDish = async() => {
        if (!selectedProduct || !selectedProduct._id) {
            return;
        }
        try{
            const res = await fetch(`http://192.168.1.5:5000/api/main/dishes?categoryId=${selectedProduct._id}`, {
                method: "GET",
                credentials: "include", // Send cookies with request
            });  
            const data = await res.json();

            if (res.ok) {
                setDish(data.dishes || "");
            } else {
                console.error("Error:", data.error);
            }
        } catch (err) {
            console.error("Error connecting to server:", err);
        }
    };
    fetchDish();
},[selectedProduct])

useEffect(()=>{
    const fetchSlug = async() => {
        if(!userId) return;
        try{
        const res = await fetch(`http://192.168.1.5:5000/api/main/get?userId=${userId}`, {
                method: "GET",
                credentials: "include"
            });  
            const data = await res.json();

            if (res.ok) {
                setSlug(data.user);
            } else {
                console.error("Error:", data.error || "Failed to fetch user");
            }
        } catch (err) {
            console.error("Error connecting to server:", err);
        }
    }
    fetchSlug()
},[userId])
/*
useEffect(() => {
  // Combine dishes into categories once both are fetched
  if(cat.length > 0 && dish.length > 0) {
    const combined = cat.map(category => ({
      ...category,
      dishes: dish.filter(dish => dish.categoryId === category._id)
    }));
    setCat(combined);
  }
}, [cat, dish]);
    */
    const handle = () =>setPop(true);
    const cancel = () =>{setPop(false); setCatin(""); setFile("")};
    const cancelDish = () =>{setPopDish(false); setDishin(""); setDishPhoto(""); setDishPrice("")}
    const addDish = () =>setPopDish(true)
    const submit = async() => {
        setLoadingModal(true);
        try{
            if(!catin||!file){
                alert("you need to fill the inputs")
                setLoadingModal(false);
                return;
            }
            const formData = new FormData();
            formData.append("avatar", file);
            formData.append("name", catin);
            formData.append("userId", userId);
            const res = await fetch("http://192.168.1.5:5000/api/main/categories", {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            setCat(prev => [...prev, data.category]);
            console.log("category created successfully");
            setPop(false);
        }
        catch(error){
            console.log(error);
        }
        setLoadingModal(false);
    }

    const submitDish = async () => {
    setLoadingModal(true);

    if (!selectedProduct || !selectedProduct._id) {
        console.log("there is no selected product");
        setLoadingModal(false);
        return;
    }

    if (!dishin || !dishPhoto || !dishPrice) {
        alert("you need to fill the inputs");
        setLoadingModal(false);
        return;
    }

    try {
        const formData = new FormData();
        formData.append("name", dishin);
        formData.append("categoryId", selectedProduct._id);
        formData.append("userId", userId);
        formData.append("avatar", dishPhoto);
        formData.append("price", dishPrice);

        const response = await fetch("http://192.168.1.5:5000/api/main/dishes", {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error from server:", data.error || data);
            throw new Error("Network response was not ok");
        }

        console.log("Dish created successfully");
        setDish(prev => [...prev, data.dish]);
        setReload(prev => !prev);
        setPopDish(false);
    } catch (error) {
        console.error("Error creating dish:", error);
    } finally {
        setLoadingModal(false);
    }
};

    // Delete handlers
    const handleDeleteCat = (cat) => {
        setDeleteTarget(cat);
        setDeleteType('cat');
        setConfirmDelete(true);
    };
    const handleDeleteDish = (dish) => {
        setDeleteTarget(dish);
        setDeleteType('dish');
        setConfirmDelete(true);
    };

    
    // Confirm delete
   const confirmDeleteAction = async () => {
  if (!deleteTarget) return;

  setLoadingModal(true);
  try {
    if (deleteType === 'cat') {
      const res = await fetch("http://192.168.1.5:5000/api/main/categories", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("error deleting category", data.error);
      } else {
        setSelectedProduct(null);
        setCat(prev => prev.filter(d => d._id !== deleteTarget._id));
        setSelectedProduct(cat[0]);
      }
    } else if (deleteType === 'dish') {
      const res = await fetch("http://192.168.1.5:5000/api/main/dishes", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("error deleting dish", data.error);
      } else {
        console.log("category deleted with success");
        setDish(prev => prev.filter(d => d._id !== deleteTarget._id));
        setReload(prev => !prev);
      }
    }
  } catch (error) {
    console.log("error deleting", error);
  } finally {
    // Reset delete UI state here — runs once after the attempt (success or fail)
    setConfirmDelete(false);
    setDeleteTarget(null);
    setDeleteType(null);
    setLoadingModal(false);
  }
};


    const changePrice = (dish) => {
        setDeleteTarget(dish);
        setPopPrice(true)
    }

    const ConfirmPrice = async() => {
        setLoadingModal(true);
        try{
            const res = await fetch("http://192.168.1.5:5000/api/main/dishes", {
                method: "PUT",
                credentials:"include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id:deleteTarget._id,price:newPrice }),
            })
            
            const data = await res.json();

        if(data.error){
            console.log("error changing the price:",data.error);
            setLoadingModal(false);
            return;
        }
        setDish((prev) =>
            prev.map((dish) =>
                dish._id === deleteTarget._id
                    ? { ...dish, price: newPrice }
                    : dish
            )
        );
    }
        catch(error){
            console.log("error changing the price:",error);
            setLoadingModal(false);
            return;
        }
        
        setNewPrice("");
        setPopPrice(false);
        setLoadingModal(false);
    }
    
    const confirmSignOut = async() => {
        await fetch("http://192.168.1.5:5000/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
        navigate("/login");
    };
    return(
        <div className={styles.body} >
            <div className={styles.logout} onClick={() => setSignout(true)}>
                <i className="fas fa-sign-out-alt"></i>
            </div>
            {signout && (
  <div className={styles["modal-overlay"]}>
    <div className={styles["modal-center"]}>
      <div className={styles.pop_dish}>
        <p>Are you sure you want to <b>SIGN OUT</b></p>
        <div className={styles["modal-actions"]}>
          <button className={styles.submit} onClick={confirmSignOut}>Yes</button>
          <button className={styles.cancel} onClick={() => setSignout(false)}>No</button>
        </div>
      </div>
    </div>
  </div>
)}
            <div className={styles.left}>
                <h4>Sidebar: Categories</h4>
                {slug && (
                    <div className={styles.logo}>
                    <img src={`http://192.168.1.5:5000${slug.avatar}`} alt={slug.username} />
                    <h3>{slug.username?.toUpperCase()}</h3>
                </div>)}
                <button onClick={handle} className={styles.addcat}><span><b>+</b></span> add categorie</button>
                {pop && (
                    <div className={styles["modal-overlay"]}>
                <div className={styles["modal-center"]}>
      <div className={styles["modal-title"]}>Add New Category</div>
      <div className={styles["modal-form"]}>
        <input className={styles.citib} id="catin" type="text" placeholder="Enter the name of the category" value={catin} onChange={(e) => setCatin(e.target.value)}/>
        <div className={styles.inside_photo}>
            <label className={styles.fileLabel} htmlFor="catphoto">Upload a photo</label>
            <input className={styles.catphoto} id="catphoto" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
            {file && <span className={styles.fileName}>{file.name}</span>}
        </div>
        <div className={styles["modal-actions"]}>
          <button className={styles.submit} onClick={submit} disabled={loadingModal} style={loadingModal ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
            {loadingModal ? <FaSpinner className={styles.spinner} style={{ marginRight: 8, fontSize: '1.2em', verticalAlign: 'middle' }} /> : null}
            Add
          </button>
          <button className={styles.cancel} onClick={cancel} disabled={loadingModal} style={loadingModal ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
                    /*<div className={styles.in}>
                        <input className={styles.citib} id="catin" type="text" placeholder="enter a category" value={catin} onChange={(e) => setCatin(e.target.value)}/>
                        <div className={styles.inside}>
                            <label className={styles["file-label"]} htmlFor="catphoto">Enter a photo</label>
                            <input className={styles.catphoto} id="catphoto" type="file" onChange={(e) => setFile(e.target.files[0])}/>
                            {file && <span className={styles["selected-file"]}>{file.name}</span>}
                        </div>
                        <button className={styles.submit} onClick={submit}>submit</button>
                        <button className={styles.cancel} onClick={cancel}>cancel</button>
                    </div>*/
                )}
                <div className={styles.cat}>
                        {cat.length>0 ? (
                            <div className={styles.cat_filter}>
                                {cat.map(cats=>(
                            <Cat key={cats._id} cats={cats} reload={reload} setReload={setReload} onClick={() => {
                                            setSelectedProduct(cats);
                                        }}
                                        isSelected={selectedProduct?._id === cats._id}

                                        onDeleteCat={() => handleDeleteCat(cats)}
                                />
                        ))}
                            </div>
                        ) : (
                    <h2>No categories found.</h2>
                )}
                </div>
            </div>

            <div className={styles.right}>
                <h4>Main Panel: Dishes in Selected Category</h4>
            
                {selectedProduct ? (
                    <div className={styles.left_center}>
                    <img src={`http://192.168.1.5:5000${selectedProduct.avatar}`} alt={selectedProduct.name} />
                    <h4> product: {selectedProduct.name}</h4>
                </div>
                ):(
                    <p>no categorie selected</p>
                )}
                {dish?.filter(Boolean).length>0 ? (
                    <div className={styles.dishes}>
                        {dish?.map(dish=>(
                            <Dish key={dish?._id} dish={dish} onDeleteDish={() => handleDeleteDish(dish)} onChangePrice={() => changePrice(dish)} />
                        ))}
                    </div>
                ):(
                    <p>no dishes found</p>
                )}
                
                
                <button className={styles.add} onClick={addDish}>Add new Dish</button>
                <div className={styles.west}>
                    <QRCodeDownload className={styles.qr} restaurantUrl={`http://192.168.1.5:5173/code/${slug.slug}`} />
                    <Link to={`/code/${slug.slug}`}><button className={styles.show}>see menu <i className="fas fa-book-open"></i></button></Link>
                </div>
                {popDish && (
  <div className={styles["modal-overlay"]}>
    <div className={styles["modal-center"]}>
      <div className={styles["modal-title"]}>Add New Dish</div>
      <div className={styles["modal-form"]}>
        <input className={styles.citib} id="catin" type="text" placeholder="Enter the name of the dish" value={dishin} onChange={(e) => setDishin(e.target.value)}/>
        <div className={styles.inside_photo}>
            <label className={styles.fileLabel} htmlFor="dishphoto">Upload a photo</label>
            <input className={styles.catphoto} id="dishphoto" type="file" accept="image/*" onChange={(e) => setDishPhoto(e.target.files[0])}/>
            {dishPhoto && <span className={styles.fileName}>{dishPhoto.name}</span>}
        </div>
        <input className={styles.citib} id="catin" type="number" placeholder="Enter the price" value={dishPrice} onChange={(e) => setDishPrice(e.target.value)}/>
        <div className={styles["modal-actions"]}>
          <button className={styles.submit} onClick={submitDish} disabled={loadingModal} style={loadingModal ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
            {loadingModal ? <FaSpinner className={styles.spinner} style={{ marginRight: 8, fontSize: '1.2em', verticalAlign: 'middle' }} /> : null}
            Add
          </button>
          <button className={styles.cancel} onClick={cancelDish} disabled={loadingModal} style={loadingModal ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)}
{confirmDelete && (
  <div className={styles["modal-overlay"]}>
    <div className={styles["modal-center"]}>
      <div className={styles.pop_dish}>
        <p>Are you sure you want to delete this {deleteType === 'cat' ? 'category' : 'dish'}?</p>
        <div className={styles["modal-actions"]}>
          <button className={styles.submit} onClick={confirmDeleteAction}>Yes</button>
          <button className={styles.cancel} onClick={() => setConfirmDelete(false)}>No</button>
        </div>
      </div>
    </div>
  </div>
)}
{popPrice && (
  <div className={styles["modal-overlay"]}>
    <div className={styles["modal-center"]}>
      <div className={styles.pop_dish}>
        <p>Enter new price for <b>{deleteTarget?.name}</b>:</p>
        <input
          className={styles.citib}
          type="number"
          placeholder="New price"
          value={newPrice}
          onChange={e => setNewPrice(e.target.value)}
        />
        <div className={styles["modal-actions"]}>
          <button className={styles.submit} onClick={ConfirmPrice} disabled={loadingModal} style={loadingModal ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
            {loadingModal ? <FaSpinner className={styles.spinner} style={{ marginRight: 8, fontSize: '1.2em', verticalAlign: 'middle' }} /> : null}
            Change
          </button>
          <button className={styles.cancel} onClick={() => {setPopPrice(false);setNewPrice("");}} disabled={loadingModal} style={loadingModal ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)}
            </div>

        </div>
    )
}
export default Main;