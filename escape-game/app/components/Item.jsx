export default function Item({ item, top, bottom, left, right}) {
  if (!item) return null;

  return (
    <div
        className={`absolute ${top ?? ""} ${bottom ?? ""} ${left ?? ""} ${right ?? ""} w-12 h-12 flex items-center justify-center text-2xl`}

    >
      {item.img ? <img src={item.img} alt={item.name} /> : item.icon}
    </div>
  );
}