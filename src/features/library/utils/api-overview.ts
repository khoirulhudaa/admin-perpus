import axios from "axios";

export const SLIMS_SERVERS = [
  "https://lib.sman1jkt.sch.id",
  "https://sman5-jkt.sch.id",
  "http://pustaka.sman40jkt.com",
  "https://absenrfid.kiraproject.id/attendance"
];

export const INLISLITE_SERVERS = [
  "https://inlislite.kiraproject.id",
  "https://pustaka.sman78library.or.id",
  "http://103.121.148.122:8123/inlislite3",
  "https://smkn13jkt.sch.id",
  "https://smkn13jkt.inlislite.xpresensi.com",
  "https://sman10jkt.inlislite.xpresensi.com"
];

const getMembersEndpoint = (server?: string): string | null => {
  if (!server) return null;

  if (SLIMS_SERVERS.includes(server)) {
    return `${server}/index.php?p=api/members`;
  }

  if (INLISLITE_SERVERS.includes(server)) {
    return `${server}/api/web/v1/member`;
  }

  return null;
};

export const fetchLibraryMembers = async ({
  server,
  sekolahId
}: {
  server?: string;
  sekolahId?: number;
}): Promise<number> => {
  if (!server || !sekolahId) {
    throw new Error("Missing server or sekolahId");
  }

  try {
    const endpoint = getMembersEndpoint(server);

    if (!endpoint) {
      // Try INLISLITE
      try {
        const res = await axios.get(`${server}/api/web/v1/member`, {
          params: { sekolahId },
          timeout: 5000
        });
        return res.data.data.length;
      } catch {
        // Fallback to SLIMS
        const res = await axios.get(`${server}/index.php?p=api/members`, {
          params: { sekolahId },
          timeout: 5000
        });
        return res.data.data.length;
      }
    }

    const res = await axios.get(endpoint, {
      params: { sekolahId },
      timeout: 5000
    });

    return res.data.data.length;
  } catch (err) {
    console.error("❌ Failed to fetch members:", err);
    throw new Error("Failed to fetch library members");
  }
};
