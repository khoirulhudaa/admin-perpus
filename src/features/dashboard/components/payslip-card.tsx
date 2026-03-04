import { dayjs } from "@/core/libs";
import { DashboardDataModel } from "@/core/models";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@itokun99/vokadash";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Simulasi data ketersediaan slip gaji

export interface PayslipCardProps {
  months?: DashboardDataModel["bulan"];
  data?: DashboardDataModel["slipGaji"];
}

export const PayslipCard = ({ data = [], months = [] }: PayslipCardProps) => {
  const navigate = useNavigate();
  const now = dayjs();
  const currentMonth = now.format("MMM");

  return (
    <Card className="w-full max-w-[95vw] sm:max-w-3xl mx-auto">
      <CardHeader className="space-y-1 p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Slip Gaji Tahun Ini
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {months.map((month, index) => {
            const selectedPayslip = data?.[index]?.[0];

            if (currentMonth.toLowerCase() === month.toLowerCase()) {
              return null;
            }

            return (
              <TooltipProvider key={month}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant={"outline"}
                        className="w-full h-10 sm:h-12 text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-all"
                        onClick={() =>
                          selectedPayslip &&
                          navigate(`/payslip/${selectedPayslip.tanggal}`)
                        }
                        disabled={!selectedPayslip}
                      >
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{month}</span>
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {selectedPayslip
                      ? "Klik untuk melihat slip gaji"
                      : "Slip gaji belum tersedia"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
