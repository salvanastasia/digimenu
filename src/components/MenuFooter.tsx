import type { RestaurantConfig } from "@/types/menu";

type MenuFooterProps = {
  restaurant: RestaurantConfig;
};

export function MenuFooter({ restaurant }: MenuFooterProps) {
  return (
    <footer className="border-t border-[#141415]/10 px-5 pb-10 pt-8 text-[0.85rem] leading-relaxed text-[#909090]">
      {restaurant.notes ? (
        <div
          className="menu-notes mb-8 text-[#141415]"
          dangerouslySetInnerHTML={{ __html: restaurant.notes }}
        />
      ) : null}

      {restaurant.address ? (
        <p className="mb-1 text-[#141415]">{restaurant.address}</p>
      ) : null}
      {restaurant.phone ? (
        <p>
          <a
            href={`tel:${restaurant.phone.replace(/\s/g, "")}`}
            className="text-[#560200] underline underline-offset-2"
          >
            {restaurant.phone}
          </a>
        </p>
      ) : null}
    </footer>
  );
}
