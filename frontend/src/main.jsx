import React, {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import {Car, Plus, Pencil, Trash2, Search, Gauge, MapPin} from "lucide-react";
import "./style.css";

const API = import.meta.env.VITE_API_URL || "/api";
const empty = {brand:"",model:"",year:2020,price:"",kilometers:"",fuel:"Petrol",transmission:"Manual",location:"",image_url:""};

function App(){
  const [cars,setCars]=useState([]);
  const [form,setForm]=useState(empty);
  const [editing,setEditing]=useState(null);
  const [search,setSearch]=useState("");
  const [showForm,setShowForm]=useState(false);

  const load=()=>fetch(`${API}/cars`).then(r=>r.json()).then(setCars).catch(()=>setCars([]));
  useEffect(load,[]);

  const save=async(e)=>{
    e.preventDefault();
    const body={...form,year:+form.year,price:+form.price,kilometers:+form.kilometers};
    const url=editing?`${API}/cars/${editing}`:`${API}/cars`;
    const res=await fetch(url,{method:editing?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(!res.ok){alert("Could not save car");return;}
    setForm(empty);setEditing(null);setShowForm(false);load();
  };

  const edit=(c)=>{setForm(c);setEditing(c.id);setShowForm(true);window.scrollTo({top:0,behavior:"smooth"});}
  const remove=async(id)=>{if(confirm("Delete this listing?")){await fetch(`${API}/cars/${id}`,{method:"DELETE"});load();}}
  const filtered=cars.filter(c=>`${c.brand} ${c.model} ${c.location} ${c.fuel}`.toLowerCase().includes(search.toLowerCase()));

  return <div>
    <header><div className="brand"><Car size={30}/><span>CarMart</span></div><button onClick={()=>{setForm(empty);setEditing(null);setShowForm(!showForm)}}><Plus size={18}/> Sell Your Car</button></header>
    <section className="hero"><div><p className="eyebrow"> VERIFIED. SIMPLE.</p><h1>Find cartmart <br/><span>perfect drive.</span></h1><p>Browse quality second-hand cars or list yours in minutes.</p></div></section>
    <main>
      {showForm && <form className="form" onSubmit={save}>
        <div className="form-head"><div><small>{editing?"UPDATE LISTING":"NEW LISTING"}</small><h2>{editing?"Edit car":"Sell your car"}</h2></div><button type="button" className="close" onClick={()=>setShowForm(false)}>×</button></div>
        <div className="grid">
          {["brand","model","year","price","kilometers","location","image_url"].map(k=><label key={k}>{k.replace("_"," ")}<input required={k!=="image_url"} type={["year","price","kilometers"].includes(k)?"number":"text"} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={k==="image_url"?"https://...":""}/></label>)}
          <label>Fuel<select value={form.fuel} onChange={e=>setForm({...form,fuel:e.target.value})}><option>Petrol</option><option>Diesel</option><option>CNG</option><option>Electric</option><option>Hybrid</option></select></label>
          <label>Transmission<select value={form.transmission} onChange={e=>setForm({...form,transmission:e.target.value})}><option>Manual</option><option>Automatic</option></select></label>
        </div><button className="submit">{editing?"Update Listing":"Publish Listing"}</button>
      </form>}
      <div className="toolbar"><div><small>MARKETPLACE</small><h2>Available cars <span>{filtered.length}</span></h2></div><div className="search"><Search size={18}/><input placeholder="Search brand, model, city..." value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
      <div className="cards">
        {filtered.map(c=><article key={c.id}>
          <div className="photo">{c.image_url?<img src={c.image_url} alt={`${c.brand} ${c.model}`}/>:<Car size={64}/>}<div className="year">{c.year}</div></div>
          <div className="content"><div className="title"><div><small>{c.brand}</small><h3>{c.model}</h3></div><strong>₹{Number(c.price).toLocaleString("en-IN")}</strong></div>
          <div className="meta"><span><Gauge size={15}/>{Number(c.kilometers).toLocaleString()} km</span><span>{c.fuel}</span><span>{c.transmission}</span></div>
          <div className="bottom"><span><MapPin size={15}/>{c.location}</span><div><button className="icon" onClick={()=>edit(c)}><Pencil size={16}/></button><button className="icon danger" onClick={()=>remove(c.id)}><Trash2 size={16}/></button></div></div></div>
        </article>)}
      </div>
      {!filtered.length&&<div className="empty"><Car size={44}/><h3>No cars found</h3><p>Add your first vehicle listing.</p></div>}
    </main>
    <footer>CarMart · Second-Hand Car Marketplace · CRUD Demo</footer>
  </div>
}
createRoot(document.getElementById("root")).render(<App/>);
