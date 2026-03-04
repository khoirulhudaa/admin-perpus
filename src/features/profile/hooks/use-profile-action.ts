import { useAlert } from "@/features/_global";
import { useProfile } from "./profile";
import { lang } from "@/core/libs";

export const useProfileAction = () => {
  const profile = useProfile();

  const alert = useAlert();
  const isLoading = profile.mutation.isPending;

  const onInputFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await profile.updatePhoto(file);
        alert.success(lang.text("profilePhotoChanged"));
        profile.query.refetch();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        alert.error(error?.message || lang.text("errSystem"));
      }
    }
  };

  return {
    isLoading,
    onInputFileChange,
  };
};
