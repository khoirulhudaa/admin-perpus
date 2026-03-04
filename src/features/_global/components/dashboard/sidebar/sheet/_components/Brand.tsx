import { Avatar, AvatarFallback, AvatarImage } from "@/core/libs";
import imgLogo from "@/core/assets/images/logo.png";

import { getStaticFile } from "@/core/utils";
import { useVokadashContext } from "@/features/_global";
import { Star } from "lucide-react";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";

export const Brand = React.memo(() => {
  const appContext = useVokadashContext();
  const profile = useProfile();
  const schoolId = profile.user?.sekolahId;
  const school = useSchool();
  const schoolDetail = useMemo(
    () => school.data?.find((d) => d.id === schoolId),
    [school.data, schoolId],
  );
  return (
    <Link
      to="#"
      className="sidebar-brand sidebar-brand-logo flex items-center gap-2 text-lg font-semibold"
    >
      <Avatar>
        {schoolDetail?.file ? (
          <>
            <AvatarImage
              src={getStaticFile(String(schoolDetail?.file))}
              alt={schoolDetail?.namaSekolah}
              className="object-cover object-center bg-white"
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
              className="object-cover object-center bg-white"
            />
            <AvatarFallback>
              <Star />
            </AvatarFallback>
          </>
        )}
      </Avatar>
      {/* <Package2 className="h-6 w-6" /> */}
      {schoolDetail ? (
        <div className="flex flex-col">
          <p className="text-sm whitespace-nowrap font-bold text">
            {appContext.appName}
          </p>
          <p className="text-[10px] font-normal opacity-75">
            {schoolDetail?.namaSekolah}
          </p>
        </div>
      ) : (
        <span className="">{appContext.appName}</span>
      )}
    </Link>
  );
});

Brand.displayName = "Brand";
