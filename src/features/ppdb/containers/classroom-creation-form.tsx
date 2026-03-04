/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";

import { lang, simpleDecode } from "@/core/libs";
import { useAlert } from "@/features/_global/hooks";
import { useSchool } from "@/features/schools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { useClassroom, useClassroomCreation, useClassroomDetail } from "../hooks";
import { CLASSROOM_LEVEL, classroomCreateSchema } from "../utils";

export const ClassroomCreationForm = ({ onClose }: { onClose?: () => void }) => {
  const params = useParams();
  const decodeParams: { id: number | string; text: string } = params.id
    ? JSON.parse(simpleDecode(params.id || ""))
    : {};

  const school = useSchool();
  const detail = useClassroomDetail({ id: Number(decodeParams?.id) });
  const creation = useClassroomCreation();
  const alert = useAlert();
  const resource = useClassroom();

  const isEdit = Boolean(detail?.data?.id);

  const form = useForm<z.infer<typeof classroomCreateSchema>>({
    resolver: zodResolver(classroomCreateSchema),
    values: {
      className: detail.data?.namaKelas || "",
      level: detail.data?.level || "",
      school: detail.data?.sekolahId || 0,
    },
  });

  async function onSubmit(data: z.infer<typeof classroomCreateSchema>) {
    try {
      // Ubah namaKelas dan level menjadi uppercase
      const formattedData = {
        namaKelas: data.className,
        level: data.level,
        sekolahId: data.school,
      };

      if (isEdit) {
        await creation.update(Number(decodeParams.id), formattedData);
      } else {
        await creation.create(formattedData);
      }

      alert.success(
        isEdit
          ? lang.text("successUpdate", { context: lang.text("classroom") })
          : lang.text("successCreate", { context: lang.text("classroom") })
      );

      resource.query.refetch();
    } catch (err: any) {
      alert.error(
        err?.message ||
          (isEdit
            ? lang.text("failUpdate", { context: lang.text("classroom") })
            : lang.text("failCreate", { context: lang.text("classroom") }))
      );
    } finally {
      if(onClose) onClose();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
        <div className="gap-6">
          <div className="basis-1 w-max">
            <div className="flex flex-col gap-4 mb-4">
              <div className="basis-1 w-max">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field, fieldState }) => (
                    <FormItem className="mb-2 w-[450px]">
                      <FormLabel>{lang.text("school")}</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : undefined}
                        onValueChange={(x) => field.onChange(Number(x))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={lang.text("selectSchool")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {school.data.map((option, i) => {
                            return (
                              <SelectItem key={i} value={String(option.id)}>
                                {option.namaSekolah}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="basis-1 sm:basis-1/2">
                <FormField
                  control={form.control}
                  name="className"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{lang.text("className")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={lang.text("inputClassname")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="basis-1 sm:basis-1/2">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>{lang.text("level")}</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={lang.text("selectLevel")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CLASSROOM_LEVEL.map((option, i) => {
                            return (
                              <SelectItem key={i} value={option}>
                                {option}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="py-4">
              <Button
                disabled={
                  !form.formState.isDirty ||
                  !form.formState.isValid ||
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