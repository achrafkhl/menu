import supabase from "../../config/supabaseClient";

async function deleteImage(path) {
  const { data, error } = await supabase
    .storage
    .from("avatar") // your bucket name
    .remove(path);

  if (error) {
    console.error("❌ Failed to delete image:", error.message);
  } if(data) {
    console.log("✅ Image deleted successfully:", path);
  }
  else(console.log("something went wrong"))
}

function Home() {
    const  ana= () =>deleteImage("public/1752916738689-mr.png");
    
    return(
        <>
            <button onClick={ana}>click</button>
        </>
    )
}
export default Home;