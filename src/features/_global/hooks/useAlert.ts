import { lang } from "@/core/libs";
import { useToast } from "@itokun99/vokadash";

export const useAlert = () => {
  const { toast } = useToast();

  const success = (message: string) => {
    toast({
      title: lang.text("success"),
      variant: "success",
      description: message,
    });
  };

  const error = (message: string) => {
    toast({
      title: lang.text("fail"),
      variant: "destructive",
      description: message,
    });
  };

  return {
    success,
    error,
  };
};
