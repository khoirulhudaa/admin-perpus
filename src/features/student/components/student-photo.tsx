import { AspectRatio, Avatar, AvatarFallback, AvatarImage } from "@/core/libs";

export interface StudentPhotoProps {
  image?: string;
  title?: string;
}

export const StudentPhoto = ({ image, title }: StudentPhotoProps) => {
  const nameArr = title?.split(" ") || [];
  const initialName =
    nameArr && nameArr.length > 0
      ? `${nameArr?.[0]?.[0]?.toUpperCase() || ""}${nameArr?.[1]?.[0]?.toUpperCase() || ""}`
      : "-";

  console.log('foto siswa:', image);

  return (
    // <AspectRatio ratio={1 / 1} className="w-full h-full">
    // </AspectRatio>
      <Avatar className="w-full h-full rounded-lg">
        <AvatarImage
          src={image}
          alt={title}
          className="bg-no-repeat object-cover object-center w-full h-full"
        />
        <AvatarFallback className="rounded-none text-7xl flex items-center justify-center">
          {initialName}
        </AvatarFallback>
      </Avatar>
  );
};