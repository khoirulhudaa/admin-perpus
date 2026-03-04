// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   Input,
//   Button,
//   SelectTrigger,
//   Select,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from '@/core/libs';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { useNavigate, useParams } from 'react-router-dom';
// import { lang, simpleDecode } from '@/core/libs';
// import { useAlert } from '@/features/_global/hooks';
// import { useUserCreation, useUserDetail } from '../hooks';
// import { userUpdateSchema } from '../utils';
// import { useEffect } from 'react';

// // **✅ Perbaiki tipe signature dalam model**
// interface UserCreationModel {
//   name: string;
//   isActive: number;
//   signature?: string | null; // Dapat berupa string atau null
// }

// const statusOptions = [
//   { label: lang.text('active'), value: '2' },
//   { label: lang.text('nonActive'), value: '1' },
// ];

// export const AdminCreationForm = () => {
//   // ✅ Perbaiki penggunaan ref dengan `useRef`
//   const params = useParams();
//   const navigate = useNavigate();
//   const alert = useAlert();

//   const decodeParams: { id: number | string; text: string } = params.id
//     ? JSON.parse(simpleDecode(params.id || ''))
//     : {};

//   const detail = useUserDetail(Number(decodeParams?.id));
//   const creation = useUserCreation();

//   const form = useForm<z.infer<typeof userUpdateSchema>>({
//     resolver: zodResolver(userUpdateSchema),
//     mode: 'all',
//     defaultValues: {
//       name: detail.data?.name || '',
//       isActive: detail.data?.isActive === 2 ? '2' : '1',
//     },
//   });

//   useEffect(() => {
//     if (detail.data) {
//       form.reset({
//         name: detail.data.name || '',
//         isActive: detail.data.isActive === 2 ? '2' : '1',
//       });
//     }
//   }, [detail.data, form]);

//   async function onSubmit(data: z.infer<typeof userUpdateSchema>) {
//     try {
//       // ✅ Gunakan null-safe operator untuk menghindari error

//       const payload: UserCreationModel = {
//         name: data.name,
//         isActive: Number(data.isActive),
//       };

//       console.log('Payload yang dikirim:', payload); // Debugging payload sebelum dikirim

//       await creation.update(Number(decodeParams.id), payload);

//       alert.success(
//         lang.text('successUpdate', { context: lang.text('userAdmin') }),
//       );

//       navigate(-1);
//     } catch (err: any) {
//       alert.error(
//         err?.message ||
//           lang.text('failUpdate', { context: lang.text('userAdmin') }),
//       );
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
//         <div className="max-w-lg gap-6">
//           <div className="basis-1">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="basis-1 sm:basis-1/2">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field, fieldState }) => (
//                     <FormItem>
//                       <FormLabel>{lang.text('adminName')}</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="text"
//                           placeholder={lang.text('inputAdminName')}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage>{fieldState.error?.message}</FormMessage>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="basis-1 sm:basis-1/2">
//                 <FormField
//                   control={form.control}
//                   name="isActive"
//                   render={({ field }) => (
//                     <FormItem className="mb-6">
//                       <FormLabel>{lang.text('status')}</FormLabel>
//                       <Select
//                         value={field.value}
//                         onValueChange={field.onChange}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue
//                               placeholder={lang.text('selectLevel')}
//                             />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {statusOptions.map((option, i) => (
//                             <SelectItem key={i} value={option.value}>
//                               {option.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>

//             {/* Form Tanda Tangan */}

//             <div className="py-4">
//               <Button disabled={creation.isLoading} type="submit">
//                 {creation.isLoading
//                   ? lang.text('saving')
//                   : lang.text('saveChanges')}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </Form>
//   );
// };


/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  SelectTrigger,
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/core/libs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { lang } from "@/core/libs";
import { useAlert } from "@/features/_global/hooks";
import { useUserAdmin, useUserCreation } from "../hooks";
import { userUpdateSchema } from "../utils";
import { useEffect } from "react";
import { UserDataModel } from "@/core/models";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/features/profile";

// *✅ Perbaiki tipe signature dalam model*
interface UserCreationModel {
  name: string;
  isActive: number;
  member?: string; // Optional, only included when updating member
  signature?: string | null; // Dapat berupa string atau null
}

interface AdminCreationFormProps {
  user?: UserDataModel; // User data for editing
  onClose?: () => void; // Callback to close the modal
}

const statusOptions = [
  { label: lang.text("active"), value: "2" },
  { label: lang.text("nonActive"), value: "1" },
];

const statusOptionsMember = [
  { label: lang.text("active"), value: "member" },
  { label: lang.text("nonActive"), value: "noMember" },
];

export const AdminCreationForm = ({ user, onClose }: AdminCreationFormProps) => {
  const alert = useAlert();
  const creation = useUserCreation();
  const queryClient = useQueryClient();
  const admins = useUserAdmin();
  const profile = useProfile();
  const profileSchoolId = profile?.user?.sekolahId;
  const isSuperAdmin = profile?.user?.role === "superAdmin";

  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    mode: "all",
    defaultValues: {
      name: user?.name || "",
      isActive: user?.isActive === 2 ? "2" : "1",
      member: user?.member === null ? "noMember" : "member",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        isActive: user.isActive === 2 ? "2" : "1",
        member: user.member === null ? "noMember" : "member",
      });
    }
  }, [user, form]);

  async function onSubmit(data: z.infer<typeof userUpdateSchema>) {
    try {
      const payload: UserCreationModel = {
        name: data.name,
        isActive: Number(data.isActive),
        ...(isSuperAdmin && { member: data.member }), // Include member only for superAdmin
      };

      console.log("Payload yang dikirim:", payload); // Debugging payload

      if (user?.id) {
        await creation.update(user.id, payload);
        alert.success(
          lang.text("successUpdate", { context: lang.text("userAdmin") }),
        );

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["user-admin", profileSchoolId] }), // Invalidasi useBiodataNew
        ]);

        // Refetch semua data yang relevan
        await Promise.all([admins.query.refetch()]);

        if (onClose) onClose(); // Close the modal on success
      } else {
        alert.error(lang.text("noData"));
        return;
      }
    } catch (err: any) {
      alert.error(
        err?.message ||
          lang.text("failUpdate", { context: lang.text("userAdmin") }),
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
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{lang.text("adminName")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={lang.text("inputAdminName")}
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
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>{lang.text("status")}</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={lang.text("selectLevel")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option, i) => (
                            <SelectItem key={i} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isSuperAdmin && (
                <div className="basis-1 sm:basis-1/2">
                  <FormField
                    control={form.control}
                    name="member"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel>Member</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={lang.text("selectLevel")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptionsMember.map((option, i) => (
                              <SelectItem key={i} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="py-4 flex gap-4">
              <Button disabled={creation.isLoading} type="submit">
                {creation.isLoading
                  ? lang.text("saving")
                  : lang.text("saveChanges")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={creation.isLoading}
              >
                {lang.text("cancel")}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};