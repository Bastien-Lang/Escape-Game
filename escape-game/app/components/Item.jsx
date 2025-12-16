export default function Item({ item }) {
  if (!item) return null;

  return (
    <div
      className="
        w-12 h-12
        bg-gray-700
        border-2 border-gray-500
        flex items-center justify-center
        text-xl
      "
    >
      {item.img ? <img src={item.img} alt={item.name} /> : item.icon}
    </div>
  );
}