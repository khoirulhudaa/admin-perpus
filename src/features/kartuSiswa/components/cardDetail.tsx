import { useState } from "react";
import { MultiCard } from "./card";
import { useProfile } from "@/features/profile"; // Make sure to import useProfile to get the user profile data
import { lang } from "@/core/libs";

export const StudentDetails = () => {
  const { user } = useProfile(); // Retrieve user data using useProfile
  const schoolId = user?.sekolah?.id; // Get the school ID from user profile

  const [searchKelas, setSearchKelas] = useState(""); // Manage the search class state

  if (!schoolId) {
    // If no schoolId found, show an error or fallback UI
    return <p>{lang.text("schoolDataUnavailable")}</p>; // Replace with your translation key for the error message
  }

  return (
    <div style={{ padding: "30px", textAlign: "left" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label
          htmlFor="kelasFilter"
          style={{ fontSize: "16px", fontWeight: "bold" }}
        >
          {lang.text("filterByClass")}:
        </label>
        <input
          type="text"
          id="kelasFilter"
          placeholder={lang.text("searchClass")}
          value={searchKelas}
          onChange={(e) => setSearchKelas(e.target.value)}
          style={{
            padding: "8px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "transparent",
            color: "inherit",
            outline: "none",
            width: "200px",
          }}
        />
      </div>

      {/* Pass searchKelas to MultiCard component */}
      <MultiCard searchKelas={searchKelas} />
    </div>
  );
};
