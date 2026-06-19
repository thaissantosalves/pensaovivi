import type { SvgIconProps } from "@mui/material/SvgIcon";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import RiceBowlIcon from "@mui/icons-material/RiceBowl";
import SoupKitchenIcon from "@mui/icons-material/SoupKitchen";
import KebabDiningIcon from "@mui/icons-material/KebabDining";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import CakeIcon from "@mui/icons-material/Cake";
import CookieIcon from "@mui/icons-material/Cookie";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import IcecreamIcon from "@mui/icons-material/Icecream";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PaymentsIcon from "@mui/icons-material/Payments";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import StorefrontIcon from "@mui/icons-material/Storefront";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import type { AppIconName } from "@/types/icons";

export const ICON_MAP = {
  lunchDining: LunchDiningIcon,
  riceBowl: RiceBowlIcon,
  soupKitchen: SoupKitchenIcon,
  kebabDining: KebabDiningIcon,
  fastfood: FastfoodIcon,
  restaurant: RestaurantIcon,
  localBar: LocalBarIcon,
  localCafe: LocalCafeIcon,
  waterDrop: WaterDropIcon,
  cake: CakeIcon,
  cookie: CookieIcon,
  localDrink: LocalDrinkIcon,
  icecream: IcecreamIcon,
  qrCode: QrCode2Icon,
  payments: PaymentsIcon,
  creditCard: CreditCardIcon,
  restaurantMenu: RestaurantMenuIcon,
  shoppingBag: ShoppingBagOutlinedIcon,
  chatBubble: ChatBubbleOutlineIcon,
  storefront: StorefrontIcon,
  deliveryDining: DeliveryDiningIcon,
  shoppingCart: ShoppingCartOutlinedIcon,
  deleteOutline: DeleteOutlineIcon,
  close: CloseIcon,
} as const satisfies Record<AppIconName, typeof LunchDiningIcon>;

type AppIconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
  className?: string;
} & Pick<SvgIconProps, "sx">;

export default function AppIcon({
  name,
  size = 24,
  color = "#ea580c",
  className,
  sx,
}: AppIconProps) {
  const Icon = ICON_MAP[name];
  return (
    <Icon
      className={className}
      sx={{ fontSize: size, color, ...sx }}
      aria-hidden
    />
  );
}
