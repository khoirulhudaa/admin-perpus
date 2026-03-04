import { Badge } from "@/core/libs";

interface FilterItem {
  id: string;
  label: string;
  value: string | number;
}

interface BaseFilterBadgesProps {
  filters: FilterItem[];
  classroomOptions?: { label: string; value: any }[];
  schoolOptions?: { label: string; value: any }[];
}

export const BaseFilterBadges = ({
  filters,
  classroomOptions = [],
  schoolOptions = [],
}: BaseFilterBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {filters.map((f, i) => {
        const labelValue = (() => {
          const opt =
            (f.id === "sekolahId"
              ? schoolOptions
              : f.id === "idKelas"
              ? classroomOptions
              : []).find((o) => String(o.value) === String(f.value));
          return opt?.label || f.value;
        })();

        return <Badge key={i}>{`${f.label}: ${labelValue}`}</Badge>;
      })}
    </div>
  );
};