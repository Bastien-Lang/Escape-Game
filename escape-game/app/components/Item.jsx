export default function Item({ item, top, bottom, left, right, width, height }) {
  if (!item) return null;

  return (
    <div  >
      {item.img ? <img className={`absolute ${top ?? ""} ${bottom ?? ""} ${left ?? ""} ${right ?? ""} ${width ?? ""} ${height ?? ""} `} src={item.img} alt={item.name} /> : item.icon}
    </div>
  );
}