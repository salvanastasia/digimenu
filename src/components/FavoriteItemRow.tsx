import type { MenuItem } from "@/types/menu";

type FavoriteItemRowProps = {
  item: MenuItem;
  quantity: number;
};

function formatLineTotal(item: MenuItem, quantity: number) {
  if (item.price == null) return null;

  const amount = item.price * quantity;
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function FavoriteItemRow({ item, quantity }: FavoriteItemRowProps) {
  const lineTotal = formatLineTotal(item, quantity);

  return (
    <div className="flex items-start justify-between gap-3 py-0.5 leading-snug">
      <span className="min-w-0 flex-1">
        {quantity}× {item.name}
      </span>
      {lineTotal ? (
        <span className="shrink-0 tabular-nums">{lineTotal}</span>
      ) : null}
    </div>
  );
}
