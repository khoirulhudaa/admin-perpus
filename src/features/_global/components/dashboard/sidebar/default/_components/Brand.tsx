// import imgLogo from "@/core/assets/images/logo.png";
// import { Avatar, AvatarFallback, AvatarImage, Button } from "@/core/libs";
// import { getStaticFile } from "@/core/utils";
// import { useVokadashContext } from "@/features/_global/hooks";
// import { useProfile } from "@/features/profile";
// import { useSchool } from "@/features/schools";
// import { Bell, Star } from "lucide-react";
// import React, { useMemo } from "react";
// import { Link } from "react-router-dom";

// export const Brand = React.memo(() => {
//   const appContext = useVokadashContext();

//   const profile = useProfile();
//   const schoolId = profile.user?.sekolahId;
//   const school = useSchool();
//   const schoolDetail = useMemo(
//     () => school.data?.find((d) => d.id === schoolId),
//     [school.data, schoolId],
//   );

//   return (
//     <div className="sidebar-brand  flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
//       <Link
//         to="/"
//         className="sidebar-brand-logo flex items-center gap-2 font-semibold"
//       >
//         <Avatar>
//           {schoolDetail?.file ? (
//             <>
//               <AvatarImage
//                 src={getStaticFile(String(schoolDetail?.file))}
//                 alt={schoolDetail?.namaSekolah}
//                 className="object-cover object-center bg-white"
//               />
//               <AvatarFallback>
//                 <Star />
//               </AvatarFallback>
//             </>
//           ) : (
//             <>
//               <AvatarImage
//                 src={imgLogo}
//                 alt={appContext.appName}
//                 className="object-cover object-center bg-white"
//               />
//               <AvatarFallback>
//                 <Star />
//               </AvatarFallback>
//             </>
//           )}
//         </Avatar>
//         {/* <Package2 className="h-6 w-6" /> */}
//         {schoolDetail ? (
//           <div className="flex flex-col">
//             <p className="text-sm whitespace-nowrap font-bold text">
//               {appContext.appName}
//             </p>
//             <p className="text-[10px] font-normal opacity-75">
//               {schoolDetail?.namaSekolah}
//             </p>
//           </div>
//         ) : (
//           <span className="">{appContext.appName}</span>
//         )}
//       </Link>
//       <Button
//         variant="outline"
//         size="icon"
//         className=" sidebar-button-notif ml-auto h-8 w-8"
//       >
//         <Bell className="h-4 w-4" />
//         <span className="sr-only">Toggle notifications</span>
//       </Button>
//     </div>
//   );
// });

// Brand.displayName = "Brand";


import imgLogo from "@/core/assets/images/logo.png";
import { Avatar, AvatarFallback, AvatarImage, Button, cn } from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { useVokadashContext } from "@/features/_global/hooks";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import { Bell, Star } from "lucide-react";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

interface BrandProps {
  isCollapsed?: boolean;
}

export const Brand = React.memo(({ isCollapsed }: BrandProps) => {
  const appContext = useVokadashContext();
  const profile = useProfile();
  const schoolId = profile.user?.sekolahId;
  const school = useSchool();
  const schoolDetail = useMemo(
    () => school.data?.find((d) => d.id === schoolId),
    [school.data, schoolId],
  );

  return (
    <div
      className={cn(
        "sidebar-brand w-full flex h-14 items-center border-b-[1px] border-white/30 px-2 lg:h-[61px] lg:px-4",
        isCollapsed && "justify-center",
      )}
    >
      <Link
        to="/"
        className={cn(
          "sidebar-brand-logo flex items-center gap-2 font-semibold",
          isCollapsed && "justify-center",
        )}
      >
        <Avatar>
          {schoolDetail?.file ? (
            <>
              <AvatarImage
                src={getStaticFile(String(schoolDetail?.file))}
                alt={schoolDetail?.namaSekolah}
                className="object-cover object-center scale-[0.8] bg-white"
              />
              <AvatarFallback>
                <Star />
              </AvatarFallback>
            </>
          ) : (
            <>
              <AvatarImage
                src={imgLogo}
                alt={appContext.appName}
                className="object-cover object-center scale-[0.8] bg-white"
              />
              <AvatarFallback>
                <Star />
              </AvatarFallback>
            </>
          )}
        </Avatar>
        {!isCollapsed && schoolDetail ? (
          <div className="flex flex-col">
            <p className="text-sm whitespace-nowrap font-bold">
              {appContext.appName}
            </p>
            <p className="text-[10px] font-normal opacity-75">
              {schoolDetail?.namaSekolah}
            </p>
          </div>
        ) : (
          !isCollapsed && <span className="font-black uppercase">{"E-LIBRARY"}</span>
        )}
      </Link>
    </div>
  );
});

Brand.displayName = "Brand";