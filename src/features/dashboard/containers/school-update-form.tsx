import {
    Button,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    lang,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/core/libs";
  import { FormProvider } from "react-hook-form";
  import { FaRegFlag } from "react-icons/fa";
  import { SaveIcon } from "lucide-react";
  import { useProvinces, useSchoolDetail } from "@/features/schools";
  import { useProfile } from "@/features/profile";
import { useSchoolUpdateForm } from "../hooks";
  
  interface SchoolUpdateFormProps {
    onClose: () => void;
  }
  
  export const SchoolUpdateForm = ({ onClose }: SchoolUpdateFormProps) => {
    const profile = useProfile();
    const SchoolID = profile.user?.sekolahId;
    const school = useSchoolDetail({ id: SchoolID });
    console.log("detail school:", school?.data)
    const province = useProvinces();
    const { form, onSubmit, isLoading } = useSchoolUpdateForm({ onClose });
  
    return (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
          <div className="flex justify-between mb-4">
            <Button
              type="submit"
              size="sm"
              className="w-full max-w-[150px]"
              disabled={!form.formState.isValid || isLoading}
            >
              <SaveIcon />
              {isLoading ? lang.text("saving") : lang.text("update")}
            </Button>
            <Button
              size="sm"
              className="w-full max-w-[150px]"
              variant="outline"
              onClick={onClose}
            >
              {lang.text("close")}
            </Button>
          </div>
          {/* Baris 1: schoolName, schoolNPSN, active */}
          <div className="flex flex-col justify-between sm:flex-row gap-10 mb-8">
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("schoolName")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukan nama sekolah"
                          {...field}
                          className={isEmpty ? "border border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="schoolNPSN"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("npsn")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukan NPSN sekolah"
                          {...field}
                          className={isEmpty ? "border border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => {
                  const isEmpty = school.isLoading
                    ? false
                    : field.value === undefined || field.value === null;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("status")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={isEmpty ? "border border-red-500" : ""}
                          >
                            <SelectValue placeholder={lang.text("selectStatus")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">{lang.text("inactive")}</SelectItem>
                          <SelectItem value="1">{lang.text("active")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          {/* Baris 2: provinceId, moodleApiUrl, tokenMoodle */}
          <div className="flex flex-col sm:flex-row gap-10 mb-8">
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="provinceId"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("province")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger
                            className={isEmpty ? "border border-red-500" : ""}
                          >
                            <SelectValue placeholder={lang.text("selectProvince")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {province.data?.map(
                            (data: { id: number; name: string }, index: number) => (
                              <SelectItem key={index} value={String(data.id)}>
                                {data.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="moodleApiUrl"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("moodleApiUrl")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputMoodleApiUrl")}
                          {...field}
                          className={isEmpty ? "border border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="tokenMoodle"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("tokenMoodle")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputTokenMoodle")}
                          {...field}
                          className={isEmpty ? "border border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          {/* Baris 3: libraryServer, libraryName, serverSatu */}
          <div className="flex flex-col sm:flex-row gap-10 mb-8">
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="libraryServer"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("libraryServer")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputLibraryServer")}
                          {...field}
                          className={isEmpty ? "border border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="libraryName"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("libraryName")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputLibraryName")}
                          {...field}
                          className={isEmpty ? "border border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="serverSatu"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("server1")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputServer")}
                          {...field}
                          className={isEmpty ? "border border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          {/* Baris 4: serverDua, serverTiga, urlYoutube1 */}
          <div className="flex flex-col sm:flex-row gap-10 mb-8">
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="serverDua"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("server2")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputServer")}
                          {...field}
                          className={isEmpty ? "border border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="serverTiga"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("server3")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputServer")}
                          {...field}
                          className={isEmpty ? "border border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="urlYoutube1"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("urlYoutube1")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputURLYoutube1")}
                          {...field}
                          className={isEmpty ? "border border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          {/* Baris 5: urlYoutube2, urlYoutube3, address */}
          <div className="flex flex-col sm:flex-row gap-10 mb-8">
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="urlYoutube2"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("urlYoutube2")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputURLYoutube2")}
                          {...field}
                          className={isEmpty ? "border border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="urlYoutube3"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("urlYoutube3")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputURLYoutube3")}
                          {...field}
                          className={isEmpty ? "border border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="basis-1 sm:basis-1/3">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => {
                  const isEmpty = school.isLoading ? false : !field.value;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {lang.text("address")}
                        {isEmpty ? <FaRegFlag className="text-red-500" /> : null}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputaddress")}
                          {...field}
                          className={isEmpty ? "border border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    );
  };