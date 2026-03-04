interface Coordinates {
  latitude: number;
  longitude: number;
}

export async function getCoordinates(
  enableHighAccuracy = true,
  attempt = 0,
): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    // Periksa apakah Geolocation API didukung oleh browser
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    // Fungsi untuk menangani keberhasilan mendapatkan lokasi
    function success(position: GeolocationPosition): void {
      const latitude = position.coords.latitude; // Lintang
      const longitude = position.coords.longitude; // Bujur

      // Kembalikan koordinat sebagai objek
      resolve({
        latitude,
        longitude,
      });
    }

    // Fungsi untuk menangani kegagalan mendapatkan lokasi
    async function error(err: GeolocationPositionError) {
      if (err?.code === err?.PERMISSION_DENIED) {
        return reject(
          new Error(
            "Mohon untuk mengaktifkan izin lokasi untuk situs ini di pengaturan browser anda",
          ),
        );
      }

      if (err?.code === err?.POSITION_UNAVAILABLE && attempt < 3) {
        try {
          const res = await getCoordinates(false, attempt + 1);
          return resolve(res);
        } catch (err) {
          return reject(err);
        }
      }

      if (err?.code === err?.POSITION_UNAVAILABLE) {
        return reject(
          new Error(
            "Lokasi gagal didapatkan, mohon periksa koneksi / jaringan pada perangkat Anda",
          ),
        );
      }

      if (err?.code === err?.TIMEOUT) {
        return reject(
          new Error(
            "Lokasi gagal didapatkan, mohon periksa koneksi / jaringan pada perangkat anda",
          ),
        );
      }

      reject(
        new Error(
          err?.message ||
            "Lokasi gagal didapatkan, mohon periksa perangkat, koneksi dan laporkan kepada admin",
        ),
      );
    }

    // Panggil Geolocation API untuk mendapatkan posisi pengguna
    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

export const requestLocationPermission = async () => {
  const perms = await navigator.permissions.query({ name: "geolocation" });
  if (perms.state === "denied") {
    throw new Error(
      "Mohon aktifkan perizinan lokasi pada browser untuk menggunakan fitur ini!",
    );
  }

  return true;
};

export const requestCameraPermission = async () => {
  const perms = await navigator.permissions.query({
    name: "camera" as PermissionName,
  });
  if (perms.state === "denied") {
    throw new Error(
      "Mohon aktifkan perizinan kamera pada browser untuk menggunakan fitur ini!",
    );
  }

  return true;
};
