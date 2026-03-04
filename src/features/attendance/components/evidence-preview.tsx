// /* eslint-disable @typescript-eslint/no-explicit-any */
// import Lightbox, { SlideImage } from "yet-another-react-lightbox";
// import Captions from "yet-another-react-lightbox/plugins/captions";

// import React from "react";

// export interface EvidenceItem {
//   image?: string;
//   title?: string;
//   status?: string;
// }

// export interface EvidencePreviewProps {
//   items?: EvidenceItem[];
//   name?: string;
// }

// export const EvidencePreview = React.memo(
//   ({ items = [], name }: EvidencePreviewProps) => {
//     const [open, setOpen] = React.useState(false);
//     const [index, setIndex] = React.useState(0);

//     const handleClickImage = (e: any, i: number) => {
//       e?.preventDefault?.();
//       setOpen((v) => !v);
//       setIndex(i);
//     };

//     // console.log('test:', {items, name})

//     const getValidImageSrc = (url?: string): string => {
//       if (!url) return '';

//       // Jika mengandung "data:image/jpeg;base64,assets/"
//       if (url.startsWith('data:image/jpeg;base64,assets/')) {
//         // Hapus bagian "data:image/jpeg;base64,"
//         const cleanPath = url.replace('data:image/jpeg;base64,', '');
//         return `https://dev.kiraproject.id/${cleanPath}`;
//       }

//       // Jika sudah base64 asli
//       if (url.startsWith('data:image')) {
//         return url;
//       }

//       // Jika sudah full URL
//       if (url.startsWith('http')) {
//         return url;
//       }

//       // Jika relative path biasa
//       return `https://dev.kiraproject.id/${url}`;
//     };


//     return (
//       <>
//         <div className="flex flex-row gap-2">
//           {items?.map((item, i) => {
//             return (
//               <div key={i}>
//                 {
//                   item?.image?.includes('assets') ? (
//                     // <p>{item?.image}</p>
//                     <img
//                       src={getValidImageSrc(item?.image) || '/defaultProfile.png'}
//                       alt={item.title || 'foto'}
//                       crossOrigin="anonymous"
//                       className="h-12 w-12 rounded-md object-cover"
//                     />
//                   ):
//                   // <p>
//                   //   {items?.[0]?.image}
//                   // </p>
//                     <img
//                       src={items?.[0]?.image}
//                       alt={item.title}
//                       className="h-12 w-12 rounded-md object-cover"
//                     />
//                 }
//               </div>
//             );
//           })}
//         </div>
//         <Lightbox
//           index={index}
//           open={open}
//           plugins={[Captions]}
//           close={() => {
//             setOpen(false);
//             setIndex(0);
//           }}
//           slides={
//             (items?.map((d) => ({
//               src: d.image,
//               alt: d.title,
//               title: d.title,
//               description: d.status,
//               type: "image",
//               // imageFit: "cover",
//             })) as SlideImage[]) || []
//           }
//         />
//       </>
//     );
//   },
// );



/* eslint-disable @typescript-eslint/no-explicit-any */
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import React, { useState } from "react";

export interface EvidenceItem {
  image?: string;
  title?: string;
  status?: string;
}

export interface EvidencePreviewProps {
  items?: EvidenceItem[];
  name?: string;
}

export const EvidencePreview = React.memo(
  ({ items = [], name }: EvidencePreviewProps) => {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [imageErrors, setImageErrors] = useState<boolean[]>(new Array(items.length).fill(false));

    const handleClickImage = (e: any, i: number) => {
      e?.preventDefault?.();
      setOpen((v) => !v);
      setIndex(i);
    };

    console.log('items', items)

    const getValidImageSrc = (url?: string): string => {
      if (!url) return '/defaultProfile.png';

      if (url.startsWith('data:image/jpeg;base64,assets/')) {
        const cleanPath = url.replace('data:image/jpeg;base64,', '');
        return `https://dev.kiraproject.id/${cleanPath}`;
      }

      if (url.startsWith('data:image')) {
        return url;
      }

      if (url.startsWith('http')) {
        return url;
      }

      if (url.includes('/uploads')) {
        return `https://dev.kiraproject.id${url}`;
      }

      return `https://dev.kiraproject.id/${url}`;
    };

    const handleImageError = (index: number) => {
      setImageErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = true;
        return newErrors;
      });
    };

    return (
      <>
        <div className="flex flex-row gap-2">
          {items?.map((item, i) => {
            const imageSrc = imageErrors[i] ? '/defaultProfile.png' : getValidImageSrc(item?.image);
            return (
              <div key={i}>
                <img
                  src={imageSrc}
                  alt={item.title || 'foto'}
                  crossOrigin="anonymous"
                  className="h-12 w-12 rounded-md object-cover"
                  onError={() => handleImageError(i)}
                  onClick={(e) => handleClickImage(e, i)}
                />
              </div>
            );
          })}
        </div>
        <Lightbox
          index={index}
          open={open}
          plugins={[Captions]}
          close={() => {
            setOpen(false);
            setIndex(0);
          }}
          slides={
            (items?.map((d, i) => ({
              src: imageErrors[i] ? '/defaultProfile.png' : getValidImageSrc(d?.image),
              alt: d.title,
              title: d.title,
              description: d.status,
              type: "image",
            })) as SlideImage[]) || []
          }
        />
      </>
    );
  }
);