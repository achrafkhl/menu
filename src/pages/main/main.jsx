import styles from "./main.module.css"
import supabase from "../../config/supabaseClient";
import { useState,useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import Cat from "./cat";
import Dish from "./dish";
import QRCodeDownload from "../../config/QRCodeDownload";
function getStoragePathFromUrl(url) {
  const regex = /\/storage\/v1\/object\/public\/avatar\/(.*)$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function Main() {
    const[cat,setCat]=useState([]);
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
    const userId = sessionStorage.getItem("userId");
    const navigate = useNavigate();

    useEffect(() => {
    const fetchCat = async () => {
        if (!userId) {
                        navigate("/login");
                      }
        try {
            const { data: profile, error: profileError } = await supabase
                .from("profiles").select("slug,name,id,logo_url").eq("id", userId).single();
            if (profileError || !profile) throw new Error("No profile found for this user");
            setSlug(profile); // Store slug for QR code generation
            const { data, error } = await supabase.from("categories").select(`*,dishes (id, name, price, image_url)`).eq('restaurant_id', userId);
            if (error) throw error;
            
            if(data.length>0){
                setCat(data);
                setSelectedProduct(data[0]);
            }


        } catch (err) {
            console.error("Error fetching categories:", err.message);
        }
    };
    fetchCat();
    const channel = supabase
            .channel('realtime:categories')
            .on(
                'postgres_changes',
                {
                    event: '*', // can be 'INSERT', 'UPDATE', or 'DELETE'
                    schema: 'public',
                    table: 'categories',
                },
                (payload) => {
                    console.log("Realtime change detected:", payload);
                    fetchCat(); // Re-fetch data when changes happen
                }
            )
            .subscribe();

    const dishesChannel = supabase
            .channel('realtime:dishes')
            .on(
                'postgres_changes',
                {
                    event: '*', // can be 'INSERT', 'UPDATE', or 'DELETE'
                    schema: 'public',
                    table: 'dishes',
                },
                (payload) => {
                    console.log("Realtime dishes change detected:", payload);
                    fetchCat(); // Re-fetch data when dish changes happen
                }
            )
            .subscribe();

        // Cleanup on unmount
        return () => {
            supabase.removeChannel(channel);
            supabase.removeChannel(dishesChannel);
        };
}, [navigate,userId]);
    
    const handle = () =>setPop(true);
    const cancel = () =>setPop(false);
    const cancelDish = () =>setPopDish(false)
    const addDish = () =>setPopDish(true)
    const submit = async() => {
        try{
        if(!catin||!file){
            alert("you need to fill the inputs")
            return;
        }
        
        const fileName = `${Date.now()}-${file.name}`;

            const { error: fetchError } = await supabase.storage
                .from("avatar")
                .upload(`public/${fileName}`, file, { cacheControl: "3600", upsert: false });

            if (fetchError) {
                console.error("Upload error:", fetchError.message);
                return;
            }

            const { data } = supabase.storage.from("avatar").getPublicUrl(`public/${fileName}`);
            const publicUrl = data.publicUrl;

             const { data: insertedData, error } = await supabase.from('categories').insert({
    name: catin,
    image_url: publicUrl,
    restaurant_id: userId,
}).select().single(); // <- gets back the inserted row

if (!error) {
    setCat(prev => [...prev, { ...insertedData, dishes: [] }]); // update local UI
    setSelectedProduct(insertedData); // optional: auto select
}

            else {
                console.log('Error inserting data:', error);
                return;
            }
            setPop(false);
        }
        catch(error){
            console.log(error);
        }
    }

    const submitDish = async() => {
        try{
        if(!dishin||!dishPhoto||!dishPrice){
            alert("you need to fill the inputs");
            return;
        }
        
        const fileName = `${Date.now()}-${dishPhoto.name}`;

            const { error: fetchError } = await supabase.storage
                .from("avatar")
                .upload(`public/${fileName}`, dishPhoto, { cacheControl: "3600", upsert: false });

            if (fetchError) {
                console.error("Upload error:", fetchError.message);
                return;
            }

            const { data } = supabase.storage.from("avatar").getPublicUrl(`public/${fileName}`);
            const publicUrl = data.publicUrl;

             const { data: insertedDish, error } = await supabase.from('dishes').insert({
    name: dishin,
    image_url: publicUrl,
    price: dishPrice,
    category_id: selectedProduct.id,
}).select().single();

if (!error) {
    setCat(prevCats => prevCats.map(cat =>
        cat.id === selectedProduct.id
            ? { ...cat, dishes: [...(cat.dishes || []), insertedDish] }
            : cat
    ));
}

            else {
                console.log('Error inserting data:', error);
                return;
            }
            setPopDish(false);
        }
        catch(error){
            console.log(error);
        }
    }
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
    if (deleteTarget) {
        const imageUrl = deleteTarget.image_url;
        const path = getStoragePathFromUrl(imageUrl); // already includes "public/filename.png"

        if (path) {
            const { error: deleteError } = await supabase
                .storage
                .from("avatar")
                .remove([path]); // DO NOT add another "public/" here

            if (deleteError) {
                console.error("❌ Supabase failed to delete image:", deleteError.message);
            }
        }

        if (deleteType === 'cat') {
    await supabase.from('categories').delete().eq('id', deleteTarget.id);
    setCat(prev => prev.filter(c => c.id !== deleteTarget.id));
    setSelectedProduct(null);
}

        else if (deleteType === 'dish') {
    await supabase.from('dishes').delete().eq('id', deleteTarget.id);
    setCat(prevCats =>
        prevCats.map(cat =>
            cat.id === selectedProduct.id
                ? { ...cat, dishes: cat.dishes.filter(d => d.id !== deleteTarget.id) }
                : cat
        )
    );
}

    }

    setConfirmDelete(false);
    setDeleteTarget(null);
    setDeleteType(null);
};
    const changePrice = (dish) => {
        setDeleteTarget(dish);
        setPopPrice(true)
    }

    const ConfirmPrice = async() => {
        const {error} = await supabase.from("dishes").update({price:newPrice}).eq('id',deleteTarget.id)
        if(error){
            console.log("error changing the price:",error);
        }
        setNewPrice("");
        setPopPrice(false);
    }
    
    const confirmSignOut = async() => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Sign out error:", error.message);
        }
        sessionStorage.removeItem("userId");
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
                    <img src={slug.logo_url} alt={slug.name} />
                    <h3>{slug.name.toUpperCase()}</h3>
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
          <button className={styles.submit} onClick={submit}>Submit</button>
          <button className={styles.cancel} onClick={cancel}>Cancel</button>
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
                            <Cat key={cats.id} cats={cats} onClick={() => {
                                            setSelectedProduct(cats);
                                        }}
                                        isSelected={selectedProduct?.id === cats.id}
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
                    <img src={selectedProduct.image_url} alt={selectedProduct.name} />
                    <h4> product: {selectedProduct.name}</h4>
                </div>
                ):(
                    <p>no categorie selected</p>
                )}
                {selectedProduct?.dishes?.length>0 ? (
                    <div className={styles.dishes}>
                        {selectedProduct.dishes.map(dish=>(
                            <Dish key={dish.id} dish={dish} onDeleteDish={() => handleDeleteDish(dish)} onChangePrice={() => changePrice(dish)} />
                        ))}
                    </div>
                ):(
                    <p>no dishes found</p>
                )}
                
                
                <button className={styles.add} onClick={addDish}>Add new Dish</button>
                <div className={styles.west}>
                    <QRCodeDownload className={styles.qr} restaurantUrl={`https://menu-iota-two.vercel.app/code/${slug.slug}`} />
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
          <button className={styles.submit} onClick={submitDish}>Submit</button>
          <button className={styles.cancel} onClick={cancelDish}>Cancel</button>
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
          <button className={styles.submit} onClick={ConfirmPrice}>Confirm</button>
          <button className={styles.cancel} onClick={() => setPopPrice(false)}>Cancel</button>
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