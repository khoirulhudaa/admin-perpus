// import * as turf from "@turf/turf";
// import { regionConfig } from "../utils";

// // Fungsi untuk mengonversi LineString menjadi Polygon
// const lineStringToPolygon = (lineString: number[][]): number[][][] | null => {
//   if (!lineString || lineString.length < 3) {
//     console.warn("LineString tidak valid: terlalu sedikit titik");
//     return null;
//   }

//   // Pastikan LineString tertutup (koordinat pertama = terakhir)
//   const isClosed =
//     lineString[0][0] === lineString[lineString.length - 1][0] &&
//     lineString[0][1] === lineString[lineString.length - 1][1];

//   const coordinates = isClosed ? lineString : [...lineString, lineString[0]];

//   // Kembalikan dalam format Polygon: [[[lng, lat], ...]]
//   return [coordinates];
// };

// // Fungsi untuk menentukan wilayah marker
// export const getRegionForPoint = (lat: number, lng: number): string => {
//   // Validasi input koordinat
//   if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
//     console.error(`Invalid coordinates: lat=${lat}, lng=${lng}`);
//     return "other";
//   }

//   const point = turf.point([lng, lat]); // Turf.js menggunakan [lng, lat]

//   for (const region of regionConfig) {
//     const geojson = region.data;

//     // Validasi data GeoJSON
//     if (!geojson || !geojson.type) {
//       console.warn(`Invalid<|control250|>

// System: GeoJSON data for region: ${region.key}`);
//       continue;
//     }

//     // Jika data adalah FeatureCollection
//     if (geojson.type === "FeatureCollection") {
//       if (!geojson.features || !Array.isArray(geojson.features)) {
//         console.warn(`Invalid FeatureCollection for region: ${region.key}`);
//         continue;
//       }

//       for (const feature of geojson.features) {
//         if (!feature.geometry) {
//           console.warn(`Invalid feature in region: ${region.key}`);
//           continue;
//         }

//         let geometry = feature.geometry;

//         // Konversi LineString ke Polygon jika perlu
//         if (geometry.type === "LineString") {
//           const polygonCoords = lineStringToPolygon(geometry.coordinates);
//           if (!polygonCoords) {
//             console.warn(`Gagal mengonversi LineString ke Polygon di region: ${region.key}`);
//             continue;
//           }

//           // Buat geometri Polygon baru
//           geometry = {
//             type: "Polygon",
//             coordinates: polygonCoords,
//           };
//         }

//         // Proses Polygon atau MultiPolygon
//         if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
//           try {
//             if (turf.booleanPointInPolygon(point, { ...feature, geometry })) {
//               console.log(`Point [${lng}, ${lat}] is in region: ${region.key}`);
//               return region.key;
//             }
//           } catch (error) {
//             console.error(
//               `Error processing feature in region ${region.key}:`,
//               error.message
//             );
//           }
//         } else {
//           console.warn(
//             `Unsupported geometry type ${geometry.type} in region: ${region.key}`
//           );
//         }
//       }
//     }
//     // Jika data adalah Feature
//     else if (geojson.type === "Feature") {
//       let geometry = geojson.geometry;

//       if (!geometry) {
//         console.warn(`Invalid geometry in region: ${region.key}`);
//         continue;
//       }

//       // Konversi LineString ke Polygon jika perlu
//       if (geometry.type === "LineString") {
//         const polygonCoords = lineStringToPolygon(geometry.coordinates);
//         if (!polygonCoords) {
//           console.warn(`Gagal mengonversi LineString ke Polygon di region: ${region.key}`);
//           continue;
//         }

//         geometry = {
//           type: "Polygon",
//           coordinates: polygonCoords,
//         };
//       }

//       // Proses Polygon atau MultiPolygon
//       if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
//         try {
//           if (turf.booleanPointInPolygon(point, { ...geojson, geometry })) {
//             console.log(`Point [${lng}, ${lat}] is in region: ${region.key}`);
//             return region.key;
//           }
//         } catch (error) {
//           console.error(
//             `Error processing feature in region ${region.key}:`,
//             error.message
//           );
//         }
//       } else {
//         console.warn(
//           `Unsupported geometry type ${geometry.type} in region: ${region.key}`
//         );
//       }
//     } else {
//       console.warn(`Unsupported GeoJSON type ${geojson.type} in region: ${region.key}`);
//     }
//   }

//   console.log(`Point [${lng}, ${lat}] does not belong to any region`);
//   return "other"; // Jika tidak berada di wilayah mana pun
// };