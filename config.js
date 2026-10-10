/* config.js: the only file you need to edit for text, prices, WhatsApp and pictures */
/* =====================  EDIT THIS PART  ===================== */
const CONFIG = {
  whatsapp: "21651276601",   // your number: country code + digits, no + or spaces
  currency: "TND",
  logo: "logo.png"                   // your logo picture, e.g. "logo.png" or a full image link. Empty = empty box
};

/* Each category: image = category icon/picture (empty = empty box)
   Each product: [name, description, price, image]  (image empty = empty box) */
const CATS = {
  keychains: { title:"Keychains & Charms", blurb:"Small, tough, and made to swing from your keys or bag.", image:"", items:[
    ["product 1","fin sord",7,"product1.jfif"],
    ["product 2","fin sord",7,"product5.jpg"],
    ["product 3","fin sord",7,"product2-.jfif"],
    ["product 4","fin sord",7,"product4.jfif"]]},
  necklace: { title:"necklace", blurb:"Stands, holders and organizers that make your desk look alive.", image:"", items:[
    ["pruduct 1","berserk necklace",15,"product1-.jfif"],
    ["product 2","spiderman necklace",15,"product4-.png"],
    ["product 3","nightwing necklace",15,"product3.jfif"],
    ["product 4","batman necklace",15,"product3-.jfif"]]},
  wearables: { title:"not ready", blurb:"", image:"", items:[
    ["","",0,""],
    ["","",0,""],
    ["","",0,""],
    ["","",0,""]]}
};
/* ============================================================ */
