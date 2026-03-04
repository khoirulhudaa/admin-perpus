import { lang, useToast } from "@/core/libs";

export const useAlert = () => {
  const { toast } = useToast();

  const success = (message: string) => {
    toast({
      title: lang.text("success"),
      variant: "default",
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
