import { AspectRatio, Avatar, AvatarFallback, AvatarImage } from "@/core/libs";
import { getStaticFile } from "@/core/utils";

export interface ViewPhotoProps {
  image?: string;
  title?: string;
}

export const ViewPhoto = ({ image, title }: ViewPhotoProps) => {
  const nameArr = title?.split(" ") || [];
  const initialName =
    nameArr && nameArr.length > 0
      ? `${nameArr?.[0]?.[0]?.toUpperCase() || ""}${nameArr?.[1]?.[0]?.toUpperCase() || ""}`
      : "-";

    console.log('foto guru:', image)

  return (
    <AspectRatio ratio={1 / 1}>
      <Avatar className="w-full h-full rounded-none">
        <AvatarImage src={image} alt={title} />
        <AvatarFallback className="rounded-none text-7xl">
          {initialName}
        </AvatarFallback>
      </Avatar>
    </AspectRatio>
  );
};
