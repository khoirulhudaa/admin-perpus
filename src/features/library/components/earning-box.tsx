import { Button } from "@/core/libs";
import { DollarSign, ArrowDownCircle, Clock } from "lucide-react";

export const EarningsBox = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Your Earnings</p>
          <h2 className="text-2xl font-semibold text-gray-800">$15,010</h2>
        </div>
        <div className="text-sm text-right text-gray-500 space-y-1">
          <p>
            Pending: <span className="text-yellow-600 font-semibold">$58</span>
          </p>
          <p>
            In Review: <span className="text-blue-600 font-semibold">$70</span>
          </p>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-700 font-bold text-lg">
          <DollarSign size={18} />
          $167
        </div>
        <Button variant="default" className="bg-orange-500 text-white hover:bg-orange-600">
          Withdraw
        </Button>
      </div>
    </div>
  );
};