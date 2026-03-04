// utils/rfidLocal.ts

export const savePendingRFID = (id: string, rfid: string) => {
  const pending = JSON.parse(localStorage.getItem("pendingRFID") || "{}");
  pending[id] = rfid;
  localStorage.setItem("pendingRFID", JSON.stringify(pending));
};

export const getPendingRFID = (id: string): string | null => {
  const pending = JSON.parse(localStorage.getItem("pendingRFID") || "{}");
  return pending[id] || null;
};

export const clearPendingRFIDIfMatched = (id: string, serverRFID: string) => {
  const pending = JSON.parse(localStorage.getItem("pendingRFID") || "{}");
  if (pending[id] === serverRFID) {
    delete pending[id];
    localStorage.setItem("pendingRFID", JSON.stringify(pending));
  }
};
