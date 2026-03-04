import React from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DUMMY_SCHEDULE = [
  { date: "12", value: 50 },
  { date: "13", value: 60 },
  { date: "14", value: 80 },
  { date: "15", value: 70 },
  { date: "16", value: 90 },
  { date: "17", value: 60 },
  { date: "18", value: 75 },
  { date: "19", value: 85 },
  { date: "20", value: 55 },
];

export const SholatScheduleCard = () => {
  const currentMonth = dayjs().format("MMMM");

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-black mb-4">Jadwal Sholat</h3>
      <div className="flex items-center justify-between text-sm mb-4">
        <button className="text-gray-500">
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-4 text-gray-700 font-medium">
          {["June", "July", "August", "September"].map((month) => (
            <span
              key={month}
              className={`${
                month === currentMonth ? "text-green-600 underline" : ""
              }`}
            >
              {month}
            </span>
          ))}
        </div>
        <button className="text-gray-500">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex gap-3 items-end justify-between h-28">
        {DUMMY_SCHEDULE.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-2">{item.date}</span>
            <div className="w-4 bg-green-400 rounded-full" style={{ height: `${item.value}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
};