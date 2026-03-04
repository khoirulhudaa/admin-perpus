// import { AnimatePresence, motion } from "framer-motion";
// import React, { useCallback, useEffect, useRef, useState } from "react";

// // Theme Tokens - updated to teal dominant
// const THEME_TOKENS: Record<string, React.CSSProperties> = {
//   smkn13: {
//     "--brand-primary": "#14b8a6",
//     "--brand-primaryText": "#ffffff",
//     "--brand-accent": "#f59e0b",
//     "--brand-bg": "#0a0a0a",
//     "--brand-surface": "rgba(24,24,27,0.8)",
//     "--brand-surfaceText": "#f3f4f6",
//     "--brand-subtle": "#27272a",
//     "--brand-pop": "#3b82f6",
//   },
// };

// // Apply theme
// if (typeof document !== 'undefined') {
//   document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13).map(([k, v]) => `${k}: ${v};`).join('');
// }

// // Utility: clsx
// const clsx = (...args: Array<string | false | null | undefined>): string =>
//   args.filter(Boolean).join(" ");

// // Custom useAlert Hook
// interface AlertState {
//   message: string;
//   isVisible: boolean;
// }

// const useAlert = () => {
//   const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });

//   const showAlert = useCallback((message: string) => {
//     setAlert({ message, isVisible: true });
//   }, []);

//   const hideAlert = useCallback(() => {
//     setAlert({ message: "", isVisible: false });
//   }, []);

//   return { alert, showAlert, hideAlert };
// };

// // Alert Component
// const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
//   const isSuccess = message === 'Beranda data saved successfully';
  
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={clsx(
//         "mb-4 rounded-xl border p-4 text-sm",
//         isSuccess
//           ? "border-green-500/30 bg-green-500/10 text-green-300"
//           : "border-red-500/30 bg-red-500/10 text-red-300"
//       )}
//     >
//       <div className="flex items-start justify-between">
//         <div className="whitespace-pre-line">{message}</div>
//         <button
//           type="button"
//           onClick={onClose}
//           className={clsx(
//             "ml-4",
//             isSuccess ? "text-green-300 hover:text-green-400" : "text-red-300 hover:text-red-400"
//           )}
//         >
//           ✕
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// // Mini Icons
// const Icon = ({ label }: { label: string }) => (
//   <span
//     aria-hidden
//     className="inline-block align-middle select-none"
//     style={{ width: 16, display: "inline-flex", justifyContent: "center" }}
//   >
//     {label}
//   </span>
// );
// const ISave = () => <Icon label="💾" />;
// const IPlus = () => <Icon label="＋" />;
// const ITrash = () => <Icon label="🗑️" />;

// // Utility Components
// interface FieldProps {
//   label?: string;
//   hint?: string;
//   children: React.ReactNode;
//   className?: string;
// }

// const Field: React.FC<FieldProps> = ({ label, hint, children, className }) => (
//   <label className={clsx("block", className)}>
//     {label && (
//       <div className="mb-1 text-xs font-medium text-white">{label}</div>
//     )}
//     {children}
//     {hint && <div className="mt-1 text-[10px] text-teal-200/50">{hint}</div>}
//   </label>
// );

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   className?: string;
// }

// const Input: React.FC<InputProps> = ({ className, ...props }) => (
//   <input
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
//       className
//     )}
//   />
// );

// interface TextAreaProps
//   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
//   className?: string;
// }

// const TextArea: React.FC<TextAreaProps> = ({ className, ...props }) => (
//   <textarea
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
//       className
//     )}
//   />
// );

// interface SwitchProps {
//   checked: boolean;
//   onChange: (value: boolean) => void;
// }

// const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => (
//   <button
//     type="button"
//     onClick={() => onChange(!checked)}
//     className={clsx(
//       "inline-flex h-6 w-11 items-center rounded-full border border-white/10",
//       checked ? "bg-teal-500/70" : "bg-teal-500/10"
//     )}
//   >
//     <span
//       className={clsx(
//         "ml-1 inline-block h-4 w-4 rounded-full bg-white transition-transform",
//         checked ? "translate-x-5" : "translate-x-0"
//       )}
//     />
//   </button>
// );

// interface ImageUploadProps {
//   value?: string; // URL for display
//   onChange: (value: { path?: string }) => void;
//   label?: string;
//   uploadUrl: string; // Endpoint for uploading images
// }

// const ImageUpload: React.FC<ImageUploadProps> = ({
//   value,
//   onChange,
//   label = "Unggah Gambar",
//   uploadUrl,
// }) => {
//   const fileRef = useRef<HTMLInputElement | null>(null);
//   const { showAlert } = useAlert();

//   const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0];
//     if (!f) {
//       showAlert('No file selected');
//       return;
//     }

//     // Client-side validation
//     if (!['image/jpeg', 'image/png'].includes(f.type)) {
//       showAlert('Please upload a valid image (JPEG or PNG)');
//       return;
//     }
//     if (f.size > 5 * 1024 * 1024) { // 5MB limit
//       showAlert('Image size must be less than 5MB');
//       return;
//     }

//     // Upload file to the specified endpoint
//     try {
//       const formData = new FormData();
//       formData.append('file', f);
//       const response = await fetch(uploadUrl, {
//         method: 'POST',
//         headers: {
//           ...getAuthHeaders(),
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(parseApiErrors(errorData));
//       }

//       const { path } = await response.json(); // Extract 'path' from response
//       onChange({ path }); // Update state with the path
//     } catch (err) {
//       showAlert(err instanceof Error ? err.message : 'Failed to upload image');
//     } finally {
//       if (fileRef.current) {
//         fileRef.current.value = ''; // Reset file input
//       }
//     }
//   };

//   return (
//     <div className="rounded-xl border border-white/20 p-3">
//       <div className="mb-2 text-xs font-medium text-white">{label}</div>
//       <div className="flex justify-between items-center gap-3">
//         <input
//           ref={fileRef}
//           type="file"
//           accept="image/*"
//           onChange={onPick}
//           className="text-xs text-teal-200"
//         />
//         <button
//           type="button"
//           onClick={() => fileRef.current?.click()}
//           className="rounded-lg border border-white/10 bg-teal-500/10 px-3 py-1.5 text-xs text-teal-300 hover:bg-teal-500/20"
//         >
//           Pilih File
//         </button>
//       </div>
//       {value && (
//         <div className="mt-3">
//           <img
//             src={`https://dev.kiraproject.id`+value}
//             alt="preview"
//             className="max-h-36 rounded-lg border border-white/20"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// // Data Interfaces
// interface HeroSlide {
//   id?: number;
//   title: string;
//   desc: string;
//   img: string; // Path from upload response
//   order: number;
// }

// interface Dinas {
//   id?: number;
//   enabled: boolean;
//   title: string;
//   link: string;
//   tag: string;
// }

// interface Sambutan {
//   id?: number;
//   name: string;
//   tenure: string;
//   photo: string; // Path from upload response
//   text: string;
// }

// interface Beranda {
//   heroSlides: HeroSlide[];
//   infoDinas: Dinas;
//   sambutan: Sambutan;
// }

// // API Configuration
// const API_BASE_URL = "https://dev.kiraproject.id/api/";
// const SAMBUTAN_PHOTO_UPLOAD_URL = "https://dev.kiraproject.id/api/media/sambutan/photo";
// const HERO_SLIDE_UPLOAD_URL = "https://dev.kiraproject.id/api/media/hero-slide";

// // Error Parsing Function
// const parseApiErrors = (errorData: any): string => {
//   const errors: string[] = [];
  
//   // Parse infoDinas errors
//   if (errorData.infoDinas) {
//     if (errorData.infoDinas._errors?.length) {
//       errors.push(...errorData.infoDinas._errors.map((err: string) => `Info Dinas: ${err}`));
//     }
//     if (errorData.infoDinas.link?._errors?.length) {
//       errors.push(...errorData.infoDinas.link._errors.map((err: string) => `Info Dinas Link: ${err}`));
//     }
//     if (errorData.infoDinas.tag?._errors?.length) {
//       errors.push(...errorData.infoDinas.tag._errors.map((err: string) => `Info Dinas Tag: ${err}`));
//     }
//   }

//   // Parse sambutan errors
//   if (errorData.sambutan) {
//     if (errorData.sambutan._errors?.length) {
//       errors.push(...errorData.sambutan._errors.map((err: string) => `Sambutan: ${err}`));
//     }
//     if (errorData.sambutan.name?._errors?.length) {
//       errors.push(...errorData.sambutan.name._errors.map((err: string) => `Sambutan Name: ${err}`));
//     }
//     if (errorData.sambutan.text?._errors?.length) {
//       errors.push(...errorData.sambutan.text._errors.map((err: string) => `Sambutan Text: ${err}`));
//     }
//     if (errorData.sambutan.photo?._errors?.length) {
//       errors.push(...errorData.sambutan.photo._errors.map((err: string) => `Sambutan Photo: ${err}`));
//     }
//   }

//   // Parse heroSlides errors
//   if (errorData.heroSlides) {
//     if (Array.isArray(errorData.heroSlides)) {
//       errorData.heroSlides.forEach((slide: any, index: number) => {
//         if (slide._errors?.length) {
//           errors.push(...slide._errors.map((err: string) => `Slide ${index + 1}: ${err}`));
//         }
//         if (slide.title?._errors?.length) {
//           errors.push(...slide.title._errors.map((err: string) => `Slide ${index + 1} Title: ${err}`));
//         }
//         if (slide.desc?._errors?.length) {
//           errors.push(...slide.desc._errors.map((err: string) => `Slide ${index + 1} Description: ${err}`));
//         }
//         if (slide.img?._errors?.length) {
//           errors.push(...slide.img._errors.map((err: string) => `Slide ${index + 1} Image: ${err}`));
//         }
//       });
//     } else {
//       errors.push('Hero Slides: Invalid error format received from server');
//     }
//   }

//   // Handle generic API errors
//   if (errorData.message || errorData.error) {
//     errors.push(errorData.message || errorData.error || 'Unknown server error');
//   }

//   return errors.length ? errors.join('\n') : 'An unknown error occurred';
// };

// // API Functions
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('token');
//   return {
//     'Authorization': `Bearer ${token || ''}`,
//   };
// };

// const fetchBeranda = async (showAlert: (message: string) => void): Promise<Beranda> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}beranda`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         ...getAuthHeaders(),
//       },
//     });
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(parseApiErrors(errorData));
//     }
//     const data = await response.json();
//     console.log('API Response:', data); // Debug log to inspect the response

//     // Provide fallback for sambutan if null or undefined
//     const sambutan = data.sambutan || {
//       id: undefined,
//       name: "",
//       tenure: "",
//       photo: "",
//       text: "",
//     };

//     return {
//       heroSlides: data.heroSlides?.map((slide: any) => ({
//         id: slide.id,
//         title: slide.title || "",
//         desc: slide.desc || "",
//         img: slide.img || "",
//         order: slide.order || 0,
//       })) || [],
//       infoDinas: data.infoDinas || {
//         id: undefined,
//         enabled: false,
//         title: "",
//         link: "",
//         tag: "",
//       },
//       sambutan,
//     };
//   } catch (err) {
//     console.error('Fetch Beranda Error:', err);
//     showAlert(err instanceof Error ? err.message : 'Failed to fetch beranda data');
//     throw err; // Rethrow to prevent setting state on error
//   }
// };

// const saveBeranda = async (data: Beranda, showAlert: (message: string) => void): Promise<Beranda | void> => {
//   try {
//     // Prepare the payload matching the API structure
//     const payload: Beranda = {
//       heroSlides: data.heroSlides.map((slide, index) => ({
//         id: slide.id,
//         title: slide.title,
//         desc: slide.desc,
//         img: slide.img, // Path from upload
//         order: index,
//       })),
//       infoDinas: {
//         id: data.infoDinas.id,
//         enabled: data.infoDinas.enabled,
//         title: data.infoDinas.title,
//         link: data.infoDinas.link,
//         tag: data.infoDinas.tag,
//       },
//       sambutan: {
//         id: data.sambutan.id,
//         name: data.sambutan.name,
//         tenure: data.sambutan.tenure,
//         photo: data.sambutan.photo, // Path from upload
//         text: data.sambutan.text,
//       },
//     };

//     console.log('Save Payload:', JSON.stringify(payload, null, 2)); // Debug log to inspect the payload

//     // First API call: Save data to /beranda
//     const saveResponse = await fetch(`${API_BASE_URL}beranda`, {
//       method: 'PUT', // Assuming PUT for update
//       headers: {
//         'Content-Type': 'application/json',
//         ...getAuthHeaders(),
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!saveResponse.ok) {
//       const errorData = await saveResponse.json();
//       throw new Error(parseApiErrors(errorData));
//     }

//     const updatedData = await saveResponse.json();
//     console.log('Server Response (Save):', updatedData);

//     // Second API call: Publish to /beranda/publish
//     const publishResponse = await fetch(`https://dev.kiraproject.id/api/beranda/publish`, {
//       method: 'POST',
//       headers: {
//         ...getAuthHeaders(),
//       },
//     });

//     if (!publishResponse.ok) {
//       const errorData = await publishResponse.json();
//       throw new Error(parseApiErrors(errorData));
//     }

//     const publishResult = await publishResponse.json();
//     console.log('Server Response (Publish):', publishResult);

//     // Update local state with the response data from /beranda
//     return {
//       heroSlides: updatedData.heroSlides?.map((slide: any) => ({
//         id: slide.id,
//         title: slide.title,
//         desc: slide.desc,
//         img: slide.img,
//         order: slide.order,
//       })) || data.heroSlides,
//       infoDinas: {
//         id: updatedData.infoDinas?.id,
//         enabled: updatedData.infoDinas?.enabled ?? data.infoDinas.enabled,
//         title: updatedData.infoDinas?.title ?? data.infoDinas.title,
//         link: updatedData.infoDinas?.link ?? data.infoDinas.link,
//         tag: updatedData.infoDinas?.tag ?? data.infoDinas.tag,
//       },
//       sambutan: {
//         id: updatedData.sambutan?.id,
//         name: updatedData.sambutan?.name ?? data.sambutan.name,
//         tenure: updatedData.sambutan?.tenure ?? data.sambutan.tenure,
//         photo: updatedData.sambutan?.photo ?? data.sambutan.photo,
//         text: updatedData.sambutan?.text ?? data.sambutan.text,
//       },
//     };
//   } catch (err) {
//     console.error('Save Beranda Error:', err);
//     showAlert(err instanceof Error ? err.message : 'Failed to save or publish beranda data');
//     throw err;
//   }
// };

// // Slide Card
// interface SlideCardProps {
//   idx: number;
//   slide: HeroSlide;
//   onChange: (index: number, slide: HeroSlide) => void;
//   onDel: (index: number) => void;
// }

// const SlideCard: React.FC<SlideCardProps> = ({ idx, slide, onChange, onDel }) => {
//   const set = (patch: Partial<HeroSlide>) => onChange(idx, { ...slide, ...patch });

//   return (
//     <div className="rounded-2xl border border-white/10 p-4">
//       <div className="mb-2 text-sm font-semibold text-white">Slide #{idx + 1}</div>
//       <div className="grid gap-4">
//         <Field label="Judul">
//           <Input
//             value={slide.title}
//             onChange={(e) => set({ title: e.target.value })}
//           />
//         </Field>
//         <Field label="Gambar">
//           <ImageUpload
//             value={slide.img}
//             onChange={({ path }) => set({ img: path || '' })}
//             uploadUrl={HERO_SLIDE_UPLOAD_URL}
//           />
//         </Field>
//         <Field label="Deskripsi">
//           <TextArea
//             rows={3}
//             value={slide.desc}
//             onChange={(e) => set({ desc: e.target.value })}
//           />
//         </Field>
//       </div>
//       <div className="mt-3 flex justify-end">
//         <button
//           type="button"
//           onClick={() => onDel(idx)}
//           className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 hover:bg-red-500/20"
//         >
//           <ITrash className="h-3 w-3" /> Hapus Slide
//         </button>
//       </div>
//     </div>
//   );
// };

// export function Beranda() {
//   const [local, setLocal] = useState<Beranda | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { alert, showAlert, hideAlert } = useAlert();

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchBeranda(showAlert);
//         setLocal(data);
//       } catch (err) {
//         // Error is handled via showAlert in fetchBeranda
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, [showAlert]);

//   const touch = (patch: Partial<Beranda>) => {
//     if (local) {
//       setLocal({ ...local, ...patch });
//     }
//   };

//   const setSlide = (index: number, slide: HeroSlide) => {
//     if (!local) return;
//     const arr = [...local.heroSlides];
//     arr[index] = { ...slide, order: index };
//     touch({ heroSlides: arr });
//   };

//   const addSlide = () => {
//     if (!local) return;
//     touch({
//       heroSlides: [
//         ...local.heroSlides,
//         {
//           title: "",
//           desc: "",
//           img: "",
//           order: local.heroSlides.length,
//         },
//       ],
//     });
//   };

//   const delSlide = (index: number) => {
//     if (!local) return;
//     touch({ heroSlides: local.heroSlides.filter((_, idx) => idx !== index) });
//   };

//   const setSambutan = (patch: Partial<Sambutan>) => {
//     if (!local) return;
//     touch({ sambutan: { ...local.sambutan, ...patch } });
//   };

//   const setDinas = (patch: Partial<Dinas>) => {
//     if (!local) return;
//     touch({ infoDinas: { ...local.infoDinas, ...patch } });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!local) return;
//     try {
//       setLoading(true);
//       const updatedData = await saveBeranda(local, showAlert);
//       if (updatedData) {
//         setLocal(updatedData); // Update state with new data
//       }
//       showAlert('Beranda data saved successfully');
//     } catch (err) {
//       // Error is handled via showAlert in saveBeranda
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="p-4 text-white">Loading...</div>;
//   }

//   return (
//     <div className="space-y-6 mb-10">
//       <AnimatePresence>
//         {alert.isVisible && (
//           <Alert message={alert.message} onClose={hideAlert} />
//         )}
//       </AnimatePresence>
//       <form
//         onSubmit={handleSubmit}
//         className="rounded-2xl border space-y-6 flex flex-col p-4 border-white/20"
//       >
//         {/* DINAS BAR */}
//         <div className="rounded-2xl border border-white/10 p-4">
//           <div className="mb-3 flex items-center justify-between">
//             <div className="text-sm font-semibold text-white">Info Dinas (Global Bar)</div>
//             <Switch
//               checked={local?.infoDinas.enabled ?? false}
//               onChange={(v) => setDinas({ enabled: v })}
//             />
//           </div>
//           <div className="grid gap-4 md:grid-cols-2">
//             <Field label="Judul">
//               <Input
//                 value={local?.infoDinas.title ?? ""}
//                 onChange={(e) => setDinas({ title: e.target.value })}
//               />
//             </Field>
//             <Field label="Tautan">
//               <Input
//                 value={local?.infoDinas.link ?? ""}
//                 onChange={(e) => setDinas({ link: e.target.value })}
//                 placeholder="/pengumuman"
//               />
//             </Field>
//             <Field label="Tag">
//               <Input
//                 value={local?.infoDinas.tag ?? ""}
//                 onChange={(e) => setDinas({ tag: e.target.value })}
//                 placeholder="Urgent"
//               />
//             </Field>
//           </div>
//         </div>

//         {/* HERO SLIDER */}
//         <div className="rounded-2xl border border-white/20 p-4">
//           <div className="mb-3 flex items-center justify-between">
//             <div className="text-sm font-semibold text-white">Hero Slider (multi slide)</div>
//             <button
//               type="button"
//               onClick={addSlide}
//               className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-teal-500/10 px-2 py-1 text-xs text-teal-300 hover:bg-teal-500/20"
//             >
//               <IPlus className="h-3 w-3" /> Tambah Slide
//             </button>
//           </div>
//           <div className="grid gap-3">
//             {local?.heroSlides.map((slide, index) => (
//               <SlideCard
//                 key={slide.id || index}
//                 idx={index}
//                 slide={slide}
//                 onChange={setSlide}
//                 onDel={delSlide}
//               />
//             ))}
//           </div>
//         </div>

//         {/* SAMBUTAN RINGKAS */}
//         <div className="rounded-2xl border border-white/20 p-4">
//           <div className="mb-3 text-sm font-semibold text-white">
//             Sambutan Kepala Sekolah (ringkas)
//           </div>
//           <div className="grid gap-4 md:grid-cols-2">
//             <Field label="Nama">
//               <Input
//                 value={local?.sambutan.name ?? ""}
//                 onChange={(e) => setSambutan({ name: e.target.value })}
//               />
//             </Field>
//             <Field label="Masa Jabatan">
//               <Input
//                 value={local?.sambutan.tenure ?? ""}
//                 onChange={(e) => setSambutan({ tenure: e.target.value })}
//               />
//             </Field>
//             <Field label="Foto">
//               <ImageUpload
//                 value={local?.sambutan.photo}
//                 onChange={({ path }) => setSambutan({ photo: path || '' })}
//                 uploadUrl={SAMBUTAN_PHOTO_UPLOAD_URL}
//               />
//             </Field>
//             <div className="md:col-span-2">
//               <Field label="Paragraf Sambutan">
//                 <TextArea
//                   rows={3}
//                   value={local?.sambutan.text ?? ""}
//                   onChange={(e) => setSambutan({ text: e.target.value })}
//                 />
//               </Field>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end p-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className={clsx(
//               "inline-flex items-center gap-4 rounded-xl bg-teal-500/30 px-4 py-2 text-sm font-semibold text-white transition-shadow",
//               loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-500"
//             )}
//           >
//             <ISave className="h-4 w-4" /> Simpan Beranda
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";

// Theme Tokens - updated to teal dominant
const THEME_TOKENS: Record<string, React.CSSProperties> = {
  smkn13: {
    "--brand-primary": "#14b8a6",
    "--brand-primaryText": "#ffffff",
    "--brand-accent": "#f59e0b",
    "--brand-bg": "#0a0a0a",
    "--brand-surface": "rgba(24,24,27,0.8)",
    "--brand-surfaceText": "#f3f4f6",
    "--brand-subtle": "#27272a",
    "--brand-pop": "#3b82f6",
  },
};

// Apply theme
if (typeof document !== 'undefined') {
  document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13).map(([k, v]) => `${k}: ${v};`).join('');
}

// Utility: clsx
const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

// Custom useAlert Hook
interface AlertState {
  message: string;
  isVisible: boolean;
}

const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });

  const showAlert = useCallback((message: string) => {
    setAlert({ message, isVisible: true });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert({ message: "", isVisible: false });
  }, []);

  return { alert, showAlert, hideAlert };
};

// Alert Component
const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  const isSuccess = message === 'Beranda data saved successfully';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        "mb-4 rounded-xl border p-4 text-sm",
        isSuccess
          ? "border-green-500/30 bg-green-500/10 text-green-300"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="whitespace-pre-line">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className={clsx(
            "ml-4",
            isSuccess ? "text-green-300 hover:text-green-400" : "text-red-300 hover:text-red-400"
          )}
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

// Mini Icons
const Icon = ({ label }: { label: string }) => (
  <span
    aria-hidden
    className="inline-block align-middle select-none"
    style={{ width: 16, display: "inline-flex", justifyContent: "center" }}
  >
    {label}
  </span>
);
const ISave = () => <Icon label="💾" />;
const IPlus = () => <Icon label="＋" />;
const ITrash = () => <Icon label="🗑️" />;

// Utility Components
interface FieldProps {
  label?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

const Field: React.FC<FieldProps> = ({ label, hint, children, className }) => (
  <label className={clsx("block", className)}>
    {label && (
      <div className="mb-1 text-xs font-medium text-white">{label}</div>
    )}
    {children}
    {hint && <div className="mt-1 text-[10px] text-teal-200/50">{hint}</div>}
  </label>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className, ...props }) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
      className
    )}
  />
);

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ className, ...props }) => (
  <textarea
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
      className
    )}
  />
);

interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={clsx(
      "inline-flex h-6 w-11 items-center rounded-full border border-white/10",
      checked ? "bg-teal-500/70" : "bg-teal-500/10"
    )}
  >
    <span
      className={clsx(
        "ml-1 inline-block h-4 w-4 rounded-full bg-white transition-transform",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

interface ImageUploadProps {
  value?: string; // URL for display
  onChange: (value: { path?: string }) => void;
  label?: string;
  uploadUrl: string; // Endpoint for uploading images
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = "Unggah Gambar",
  uploadUrl,
}) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { showAlert } = useAlert();

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      showAlert('No file selected');
      return;
    }

    // Client-side validation
    if (!['image/jpeg', 'image/png'].includes(f.type)) {
      showAlert('Please upload a valid image (JPEG or PNG)');
      return;
    }
    if (f.size > 5 * 1024 * 1024) { // 5MB limit
      showAlert('Image size must be less than 5MB');
      return;
    }

    // Upload file to the specified endpoint
    try {
      const formData = new FormData();
      formData.append('file', f);
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(parseApiErrors(errorData));
      }

      const { path } = await response.json(); // Extract 'path' from response
      onChange({ path }); // Update state with the path
    } catch (err) {
      showAlert(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      if (fileRef.current) {
        fileRef.current.value = ''; // Reset file input
      }
    }
  };

  return (
    <div className="rounded-xl border border-white/20 p-3">
      <div className="mb-2 text-xs font-medium text-white">{label}</div>
      <div className="flex justify-between items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onPick}
          className="text-xs text-teal-200"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-white/10 bg-teal-500/10 px-3 py-1.5 text-xs text-teal-300 hover:bg-teal-500/20"
        >
          Pilih File
        </button>
      </div>
      {value && (
        <div className="mt-3">
          <img
            src={`https://dev.kiraproject.id${value}`}
            alt="preview"
            className="max-h-36 min-w-[200px] rounded-lg border border-white/20"
          />
        </div>
      )}
    </div>
  );
};

// List Editor
interface ListEditorProps {
  items: string[];
  onChange: (list: string[]) => void;
  placeholder?: string;
}

const ListEditor: React.FC<ListEditorProps> = ({
  items,
  onChange,
  placeholder = "Teks...",
}) => {
  const setAt = (index: number, value: string) => {
    const copy = [...items];
    copy[index] = value;
    onChange(copy);
  };

  const add = () => onChange([...items, ""]);
  const del = (index: number) => onChange(items.filter((_, idx) => idx !== index));
  const up = (index: number) => {
    if (index <= 0) return;
    const copy = [...items];
    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
    onChange(copy);
  };
  const down = (index: number) => {
    if (index >= items.length - 1) return;
    const copy = [...items];
    [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      {items.map((text, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={text}
            onChange={(e) => setAt(index, e.target.value)}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => up(index)}
            className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white hover:bg-teal-500/20"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => down(index)}
            className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white hover:bg-teal-500/20"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => del(index)}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 hover:bg-red-500/20"
          >
            Hapus
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-teal-500/20"
      >
        Tambah
      </button>
    </div>
  );
};

// Data Interfaces
interface HeroSlide {
  id?: number;
  title: string;
  desc: string;
  img: string; // Path from upload response
  order: number;
}

interface Dinas {
  id?: number;
  enabled: boolean;
  title: string;
  link: string;
  tag: string;
}

interface Sambutan {
  id?: number;
  name: string;
  tenure: string;
  photo: string; // Path from upload response
  text: string;
  poinPrioritas: string[]; // Added poinPrioritas field
}

interface Beranda {
  heroSlides: HeroSlide[];
  infoDinas: Dinas;
  sambutan: Sambutan;
}

// API Configuration
const API_BASE_URL = "https://dev.kiraproject.id/api/";
const SAMBUTAN_PHOTO_UPLOAD_URL = "https://dev.kiraproject.id/api/media/sambutan/photo";
const HERO_SLIDE_UPLOAD_URL = "https://dev.kiraproject.id/api/media/hero-slide";

// Error Parsing Function
const parseApiErrors = (errorData: any): string => {
  const errors: string[] = [];
  
  // Parse infoDinas errors
  if (errorData.infoDinas) {
    if (errorData.infoDinas._errors?.length) {
      errors.push(...errorData.infoDinas._errors.map((err: string) => `Info Dinas: ${err}`));
    }
    if (errorData.infoDinas.link?._errors?.length) {
      errors.push(...errorData.infoDinas.link._errors.map((err: string) => `Info Dinas Link: ${err}`));
    }
    if (errorData.infoDinas.tag?._errors?.length) {
      errors.push(...errorData.infoDinas.tag._errors.map((err: string) => `Info Dinas Tag: ${err}`));
    }
  }

  // Parse sambutan errors
  if (errorData.sambutan) {
    if (errorData.sambutan._errors?.length) {
      errors.push(...errorData.sambutan._errors.map((err: string) => `Sambutan: ${err}`));
    }
    if (errorData.sambutan.name?._errors?.length) {
      errors.push(...errorData.sambutan.name._errors.map((err: string) => `Sambutan Name: ${err}`));
    }
    if (errorData.sambutan.text?._errors?.length) {
      errors.push(...errorData.sambutan.text._errors.map((err: string) => `Sambutan Text: ${err}`));
    }
    if (errorData.sambutan.photo?._errors?.length) {
      errors.push(...errorData.sambutan.photo._errors.map((err: string) => `Sambutan Photo: ${err}`));
    }
    if (errorData.sambutan.poinPrioritas?._errors?.length) {
      errors.push(...errorData.sambutan.poinPrioritas._errors.map((err: string) => `Sambutan Poin Prioritas: ${err}`));
    }
  }

  // Parse heroSlides errors
  if (errorData.heroSlides) {
    if (Array.isArray(errorData.heroSlides)) {
      errorData.heroSlides.forEach((slide: any, index: number) => {
        if (slide._errors?.length) {
          errors.push(...slide._errors.map((err: string) => `Slide ${index + 1}: ${err}`));
        }
        if (slide.title?._errors?.length) {
          errors.push(...slide.title._errors.map((err: string) => `Slide ${index + 1} Title: ${err}`));
        }
        if (slide.desc?._errors?.length) {
          errors.push(...slide.desc._errors.map((err: string) => `Slide ${index + 1} Description: ${err}`));
        }
        if (slide.img?._errors?.length) {
          errors.push(...slide.img._errors.map((err: string) => `Slide ${index + 1} Image: ${err}`));
        }
      });
    } else {
      errors.push('Hero Slides: Invalid error format received from server');
    }
  }

  // Handle generic API errors
  if (errorData.message || errorData.error) {
    errors.push(errorData.message || errorData.error || 'Unknown server error');
  }

  return errors.length ? errors.join('\n') : 'An unknown error occurred';
};

// API Functions
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token || ''}`,
  };
};

const fetchBeranda = async (showAlert: (message: string) => void): Promise<Beranda> => {
  try {
    const response = await fetch(`${API_BASE_URL}beranda`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(parseApiErrors(errorData));
    }
    const data = await response.json();
    console.log('API Response:', data); // Debug log to inspect the response

    // Provide fallback for sambutan if null or undefined
    const sambutan = data.sambutan || {
      id: undefined,
      name: "",
      tenure: "",
      photo: "",
      text: "",
      poinPrioritas: [], // Initialize poinPrioritas
    };

    return {
      heroSlides: data.heroSlides?.map((slide: any) => ({
        id: slide.id,
        title: slide.title || "",
        desc: slide.desc || "",
        img: slide.img || "",
        order: slide.order || 0,
      })) || [],
      infoDinas: data.infoDinas || {
        id: undefined,
        enabled: false,
        title: "",
        link: "",
        tag: "",
      },
      sambutan,
    };
  } catch (err) {
    console.error('Fetch Beranda Error:', err);
    showAlert(err instanceof Error ? err.message : 'Failed to fetch beranda data');
    throw err; // Rethrow to prevent setting state on error
  }
};

const saveBeranda = async (data: Beranda, showAlert: (message: string) => void): Promise<Beranda | void> => {
  try {
    // Prepare the payload matching the API structure
    const payload: Beranda = {
      heroSlides: data.heroSlides.map((slide, index) => ({
        id: slide.id,
        title: slide.title,
        desc: slide.desc,
        img: slide.img, // Path from upload
        order: index,
      })),
      infoDinas: {
        id: data.infoDinas.id,
        enabled: data.infoDinas.enabled,
        title: data.infoDinas.title,
        link: data.infoDinas.link,
        tag: data.infoDinas.tag,
      },
      sambutan: {
        id: data.sambutan.id,
        name: data.sambutan.name,
        tenure: data.sambutan.tenure,
        photo: data.sambutan.photo, // Path from upload
        text: data.sambutan.text,
        poinPrioritas: data.sambutan.poinPrioritas, // Include poinPrioritas
      },
    };

    console.log('Save Payload:', JSON.stringify(payload, null, 2)); // Debug log to inspect the payload

    // First API call: Save data to /beranda
    const saveResponse = await fetch(`${API_BASE_URL}beranda`, {
      method: 'PUT', // Assuming PUT for update
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });

    if (!saveResponse.ok) {
      const errorData = await saveResponse.json();
      throw new Error(parseApiErrors(errorData));
    }

    const updatedData = await saveResponse.json();
    console.log('Server Response (Save):', updatedData);

    // Second API call: Publish to /beranda/publish
    const publishResponse = await fetch(`https://dev.kiraproject.id/api/beranda/publish`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!publishResponse.ok) {
      const errorData = await publishResponse.json();
      throw new Error(parseApiErrors(errorData));
    }

    const publishResult = await publishResponse.json();
    console.log('Server Response (Publish):', publishResult);

    // Update local state with the response data from /beranda
    return {
      heroSlides: updatedData.heroSlides?.map((slide: any) => ({
        id: slide.id,
        title: slide.title,
        desc: slide.desc,
        img: slide.img,
        order: slide.order,
      })) || data.heroSlides,
      infoDinas: {
        id: updatedData.infoDinas?.id,
        enabled: updatedData.infoDinas?.enabled ?? data.infoDinas.enabled,
        title: updatedData.infoDinas?.title ?? data.infoDinas.title,
        link: updatedData.infoDinas?.link ?? data.infoDinas.link,
        tag: updatedData.infoDinas?.tag ?? data.infoDinas.tag,
      },
      sambutan: {
        id: updatedData.sambutan?.id,
        name: updatedData.sambutan?.name ?? data.sambutan.name,
        tenure: updatedData.sambutan?.tenure ?? data.sambutan.tenure,
        photo: updatedData.sambutan?.photo ?? data.sambutan.photo,
        text: updatedData.sambutan?.text ?? data.sambutan.text,
        poinPrioritas: updatedData.sambutan?.poinPrioritas ?? data.sambutan.poinPrioritas, // Include poinPrioritas
      },
    };
  } catch (err) {
    console.error('Save Beranda Error:', err);
    showAlert(err instanceof Error ? err.message : 'Failed to save or publish beranda data');
    throw err;
  }
};

// Slide Card
interface SlideCardProps {
  idx: number;
  slide: HeroSlide;
  onChange: (index: number, slide: HeroSlide) => void;
  onDel: (index: number) => void;
}

const SlideCard: React.FC<SlideCardProps> = ({ idx, slide, onChange, onDel }) => {
  const set = (patch: Partial<HeroSlide>) => onChange(idx, { ...slide, ...patch });

  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <div className="mb-2 text-sm font-semibold text-white">Slide #{idx + 1}</div>
      <div className="grid gap-4">
        <Field label="Judul">
          <Input
            value={slide.title}
            onChange={(e) => set({ title: e.target.value })}
          />
        </Field>
        <Field label="Gambar">
          <ImageUpload
            value={slide.img}
            onChange={({ path }) => set({ img: path || '' })}
            uploadUrl={HERO_SLIDE_UPLOAD_URL}
          />
        </Field>
        <Field label="Deskripsi">
          <TextArea
            rows={3}
            value={slide.desc}
            onChange={(e) => set({ desc: e.target.value })}
          />
        </Field>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => onDel(idx)}
          className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 hover:bg-red-500/20"
        >
          <ITrash className="h-3 w-3" /> Hapus Slide
        </button>
      </div>
    </div>
  );
};

export function Beranda() {
  const [local, setLocal] = useState<Beranda | null>(null);
  const [loading, setLoading] = useState(true);
  const { alert, showAlert, hideAlert } = useAlert();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchBeranda(showAlert);
        setLocal(data);
      } catch (err) {
        // Error is handled via showAlert in fetchBeranda
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [showAlert]);

  const touch = (patch: Partial<Beranda>) => {
    if (local) {
      setLocal({ ...local, ...patch });
    }
  };

  const setSlide = (index: number, slide: HeroSlide) => {
    if (!local) return;
    const arr = [...local.heroSlides];
    arr[index] = { ...slide, order: index };
    touch({ heroSlides: arr });
  };

  const addSlide = () => {
    if (!local) return;
    touch({
      heroSlides: [
        ...local.heroSlides,
        {
          title: "",
          desc: "",
          img: "",
          order: local.heroSlides.length,
        },
      ],
    });
  };

  const delSlide = (index: number) => {
    if (!local) return;
    touch({ heroSlides: local.heroSlides.filter((_, idx) => idx !== index) });
  };

  const setSambutan = (patch: Partial<Sambutan>) => {
    if (!local) return;
    touch({ sambutan: { ...local.sambutan, ...patch } });
  };

  const setDinas = (patch: Partial<Dinas>) => {
    if (!local) return;
    touch({ infoDinas: { ...local.infoDinas, ...patch } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!local) return;
    try {
      setLoading(true);
      const updatedData = await saveBeranda(local, showAlert);
      if (updatedData) {
        setLocal(updatedData); // Update state with new data
      }
      showAlert('Beranda data saved successfully');
    } catch (err) {
      // Error is handled via showAlert in saveBeranda
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6 py-4 mb-10">
      <AnimatePresence>
        {alert.isVisible && (
          <Alert message={alert.message} onClose={hideAlert} />
        )}
      </AnimatePresence>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border space-y-6 flex flex-col p-4 border-white/20"
      >
        {/* DINAS BAR */}
        <div className="rounded-2xl border border-white/10 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-white">Info Dinas (Global Bar)</div>
            <Switch
              checked={local?.infoDinas.enabled ?? false}
              onChange={(v) => setDinas({ enabled: v })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Judul">
              <Input
                value={local?.infoDinas.title ?? ""}
                onChange={(e) => setDinas({ title: e.target.value })}
              />
            </Field>
            <Field label="Tautan">
              <Input
                value={local?.infoDinas.link ?? ""}
                onChange={(e) => setDinas({ link: e.target.value })}
                placeholder="/pengumuman"
              />
            </Field>
            <Field label="Tag">
              <Input
                value={local?.infoDinas.tag ?? ""}
                onChange={(e) => setDinas({ tag: e.target.value })}
                placeholder="Urgent"
              />
            </Field>
          </div>
        </div>

        {/* HERO SLIDER */}
        <div className="rounded-2xl border border-white/20 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-white">Hero Slider (multi slide)</div>
            <button
              type="button"
              onClick={addSlide}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-teal-500/10 px-2 py-1 text-xs text-teal-300 hover:bg-teal-500/20"
            >
              <IPlus className="h-3 w-3" /> Tambah Slide
            </button>
          </div>
          <div className="grid gap-3">
            {local?.heroSlides.map((slide, index) => (
              <SlideCard
                key={slide.id || index}
                idx={index}
                slide={slide}
                onChange={setSlide}
                onDel={delSlide}
              />
            ))}
          </div>
        </div>

        {/* SAMBUTAN RINGKAS */}
        <div className="rounded-2xl border border-white/20 p-4">
          <div className="mb-3 text-sm font-semibold text-white">
            Sambutan Kepala Sekolah (ringkas)
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nama">
              <Input
                value={local?.sambutan.name ?? ""}
                onChange={(e) => setSambutan({ name: e.target.value })}
              />
            </Field>
            <Field label="Masa Jabatan">
              <Input
                value={local?.sambutan.tenure ?? ""}
                onChange={(e) => setSambutan({ tenure: e.target.value })}
              />
            </Field>
            <Field label="Foto">
              <ImageUpload
                value={local?.sambutan.photo}
                onChange={({ path }) => setSambutan({ photo: path || '' })}
                uploadUrl={SAMBUTAN_PHOTO_UPLOAD_URL}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Paragraf Sambutan">
                <TextArea
                  rows={3}
                  value={local?.sambutan.text ?? ""}
                  onChange={(e) => setSambutan({ text: e.target.value })}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Poin Prioritas">
                <ListEditor
                  items={local?.sambutan.poinPrioritas ?? []}
                  onChange={(list) => setSambutan({ poinPrioritas: list })}
                  placeholder="Poin Prioritas..."
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4">
          <button
            type="submit"
            disabled={loading}
            className={clsx(
              "inline-flex items-center gap-4 rounded-xl bg-teal-500/30 px-4 py-2 text-sm font-semibold text-white transition-shadow",
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-500"
            )}
          >
            <ISave className="h-4 w-4" /> Simpan Beranda
          </button>
        </div>
      </form>
    </div>
  );
}