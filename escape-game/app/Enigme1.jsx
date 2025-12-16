import Item from "./components/Item";

export default function Enigme1(){
    return(
        <div className="relative">
            <Item item={{id: 1, name: "Box", icon: "🔑", img:"/assets/e1Box.png"}} top={"top-0"} right={"right-0"} />
        </div>
    )
}