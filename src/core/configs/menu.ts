import { VokadashProps } from "@/features/_global";
import { lang } from "../libs";

export const MENU_STAFF: VokadashProps["menus"] = [
  {
    title: 'Halaman Utama',
    url: "/",
    icon: "LayoutDashboard",
  },
  {
    title: "Master Bibliografy", // 11 karakter
    url: "/bibliografy",
    icon: "Book",
    main: false,
  },
  {
    title: "Daftar Eksemplar", // 11 karakter
    url: "/eksemplar",
    icon: "Library",
    main: false,
  },
  {
    title: "Kendali Serial", // 12 karakter
    url: "/kendali-serial",
    icon: "Newspaper",
    main: false,
  },
  {
    title: "Stok Opname", // 11 karakter
    url: "/inventory",
    icon: "ClipboardCheck",
    main: false,
  },
  {
    title: "Sirkulasi Pinjam", // 9 karakter (opsi: DATA PINJAM - 11)
    url: "/peminjam",
    icon: "User",
    main: false,
  },
  {
    title: "Riwayat Kunjungan", // 9 karakter (opsi: LOG KUNJUNGI - 12)
    url: "/laporan-kunjungan",
    icon: "Footprints",
    main: false,
  },
  {
    title: "Keanggotaan", // 11 karakter
    url: "/anggota-perpus",
    icon: "Users",
    main: false,
  },
  {
    title: "Konfigurasi Perpus", // 11 karakter
    url: "/pengaturan-perpus",
    icon: "Cog",
    main: false,
  },
];

export const USER_MENU_STAFF: VokadashProps["usermenus"] = [
  {
    title: lang.text("logout"),
    url: "/logout",
  },
];

export const MENU_CONFIG = {
  staff: MENU_STAFF,
};

export const USERMENU_CONFIG = {
  staff: USER_MENU_STAFF,
};