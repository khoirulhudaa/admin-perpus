/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from "@/core/libs";

import { lang } from "@/core/libs";
import { useAlert } from "@/features/_global/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAttendanceCreation } from "../hooks";
import { attendanceCreateSchema } from "../utils";

export const AttendanceCreationForm = () => {
const creation = useAttendanceCreation();
const navigate = useNavigate();
const alert = useAlert();

const form = useForm<z.infer<typeof attendanceCreateSchema>>({
  resolver: zodResolver(attendanceCreateSchema),
  defaultValues: {
    userId: 0,
  },
});

const userId = form.watch("userId");
const isValue = userId !== 0;
console.log('isValue:', isValue, 'userId:', userId);

async function onSubmit(data: z.infer<typeof attendanceCreateSchema>) {
  try {
    if (isValue) {
        await creation.create({
          userId: data.userId
        });
    }

    alert.success(
      lang.text("successCreate", { context: lang.text("attendance") })
    );

    if (isValue) {
      navigate(-1);
    } else {
      navigate("/attendance/students", { replace: true });
    }
  } catch (err: any) {
    alert.error(
      err?.message || 
      (isValue
        ? lang.text("failUpdate", { context: lang.text("attendance") })
        : lang.text("failCreate", { context: lang.text("attendance") })),
    );
  }
}

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
      <div className="max-w-lg gap-6">
        <div className="basis-1">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="basis-1 sm:basis-1/2">
              <FormField
                control={form.control}
                name="userId"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{lang.text("userId")}</FormLabel>
                    <FormControl>
                      <Input
                         type="text"
                         inputMode="numeric"
                         pattern="[0-9]*"
                         placeholder={lang.text("inputUserId")}
                         value={field.value === 0 ? "" : String(field.value)}
                         onChange={(e) => {
                           const raw = e.target.value;
                           // Hapus karakter non-numeric dan nol di depan
                           const sanitized = raw.replace(/[^0-9]/g, "").replace(/^0+/, "");
                           field.onChange(sanitized === "" ? 0 : Number(sanitized));
                         }}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="py-4">
            <Button
              disabled={
                (!isValue && (!form.formState.isDirty || !form.formState.isValid)) ||
                creation.isLoading
              }
              type="submit"
            >
              {creation.isLoading
                ? lang.text("saving")
                : lang.text("saveChanges")}
            </Button>
          </div>
        </div>
      </div>
    </form>
  </Form>
);
};