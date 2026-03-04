import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  dayjs, lang,
} from "@/core/libs";
import { formatGender, getStaticFile } from "@/core/utils";
import { InfoItem, ViewPhoto } from "@/features/_global";
import { useUserDetail } from "@/features/user";
import {
  CheckIcon,
  IdCard,
  LogInIcon,
  Mail,
  MapPin,
  PersonStanding,
  Phone,
  TabletSmartphone,
  User,
  VerifiedIcon,
} from "lucide-react";
export interface StudentInformationProps {
  id?: number;
}

export const ParentInformation = (props: StudentInformationProps) => {
  const detail = useUserDetail(Number(props.id));
  console.log('detail', detail)
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <ViewPhoto
            title={detail.data?.name || "-"}
            image={getStaticFile(String(detail.data?.image))}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{detail.data?.name}</CardTitle>
              <CardDescription>{`NIK: ${detail?.data?.nik || "-"}`}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <InfoItem
                  icon={<User size={24} />}
                  label={lang.text("fullName")}
                  value={detail.data?.name || "-"}
                />
                <InfoItem
                  icon={<IdCard size={24} />}
                  label="NIK"
                  value={detail.data?.nik || "-"}
                />

                <InfoItem
                  icon={<Mail size={24} />}
                  label="Email"
                  value={detail.data?.email || "-"}
                />
                <InfoItem
                  icon={<Mail size={24} />}
                  label={lang.text("school")}
                  value={detail.data?.school?.namaSekolah || "-"}
                />
                <InfoItem
                  icon={<MapPin size={24} />}
                  label={lang.text("address")}
                  value={detail.data?.alamat || "-"}
                />
                <InfoItem
                  icon={<MapPin size={24} />}
                  label={lang.text("hobby")}
                  value={detail.data?.hobi || "-"}
                />
                <InfoItem
                  icon={<PersonStanding size={24} />}
                  label={lang.text("gender")}
                  value={formatGender(detail.data?.jenisKelamin) || "-"}
                />
                <InfoItem
                  icon={<CheckIcon size={24} />}
                  label={lang.text("status")}
                  value={
                    detail.data?.isActive === 2
                      ? lang.text("active")
                      : lang.text("nonActive")
                  }
                />
                <InfoItem
                  icon={<LogInIcon size={24} />}
                  label={lang.text("lastLogin")}
                  value={dayjs(detail.data?.lastLogin).format(
                    "HH:mm, DD MMM YYYY",
                  )}
                />
                <InfoItem
                  icon={<VerifiedIcon size={24} />}
                  label={lang.text("verificationStatus")}
                  value={
                    detail.data?.isVerified
                      ? lang.text("isVerified")
                      : lang.text("isNotVerified")
                  }
                />
                <InfoItem
                  icon={<Phone size={24} />}
                  label={lang.text("noHP")}
                  value={detail.data?.noTlp || "-"}
                />
                <InfoItem
                  icon={<TabletSmartphone size={24} />}
                  label={lang.text("deviceId")}
                  value={detail.data?.devicesId || "-"}
                />
                {/* <InfoItem */}
                {/*   icon={<MapPin size={24} />} */}
                {/*   label={lang.text("lastLocation")} */}
                {/*   renderValue={ */}
                {/*     detail?.data?.location ? ( */}
                {/*       <Link */}
                {/*         to={createGmapUrl( */}
                {/*           detail.data.location?.latitude, */}
                {/*           detail.data.location.longitude, */}
                {/*         )} */}
                {/*         target="_blank" */}
                {/*       > */}
                {/*         {lang.text("seeOnMap")} */}
                {/*       </Link> */}
                {/*     ) : ( */}
                {/*       "-" */}
                {/*     ) */}
                {/*   } */}
                {/* /> */}
              </div>
            </CardContent>
            {/* <CardFooter className="flex justify-between"> */}
            {/*   <Button variant="outline">Cancel</Button> */}
            {/*   <Button>Deploy</Button> */}
            {/* </CardFooter> */}
          </Card>
        </div>
      </div>
    </>
  );
};
