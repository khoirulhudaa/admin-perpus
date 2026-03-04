/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/core/libs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { otpSchema } from "../utils";
import { useForm } from "react-hook-form";
import { useAlert } from "@/features/_global";
import { lang, simpleDecode } from "@/core/libs";
import { z } from "zod";
import { useOtp } from "../hooks";

const parseZ = (zstring: string) => {
  try {
    const jsonString = simpleDecode(zstring);
    const json = JSON.parse(jsonString);
    return json;
  } catch (err) {
    console.log("invalid param", err);
    return {};
  }
};

export function OtpForm() {
  const [searchParams] = useSearchParams();
  const zParams = searchParams.get("z");
  const { navigateTo, email } = parseZ(zParams || "");

  console.log("navigateTo", navigateTo, email, zParams);

  const navigate = useNavigate();
  const otp = useOtp();
  const alert = useAlert();

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof otpSchema>) {
    try {
      await otp.verify({
        code: data.code,
      });

      alert.success(lang.text("verifyOtpSuccess"));
      if (navigateTo) {
        navigate(navigateTo, { replace: true });
      }
    } catch (err: any) {
      console.log("err =>", err);
      alert.error(err?.message || lang.text("verifyOtpFailed"));
    }
  }

  const onResendOtp = async () => {
    try {
      await otp.resend({ email });
      alert.success(lang.text("otpSended"));
    } catch (err: any) {
      alert.error(err?.message || lang.text("errSystem"));
    }
  };

  // useEffect(() => {
  //   if (!navigateTo || !email) navigate("/", { replace: true });
  // }, [navigateTo, navigate, email]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-sm ">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {lang.text("otpVerification")}
            </CardTitle>
            <CardDescription className="text-center">
              {lang.text("otpVerificationDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <InputOTP
                          containerClassName={cn("justify-center")}
                          maxLength={6}
                          {...field}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-center">
                <Button type="submit">{lang.text("submit")}</Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              {lang.text("notReceivedOtp")}{" "}
              <Button
                type="button"
                onClick={onResendOtp}
                variant="link"
                className="p-0 underline"
              >
                {lang.text("resend")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
