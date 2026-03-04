import { useTodayVisitors } from "../hooks/use-slims-visitor-today";

interface Props {
  baseUrl?: string;
  namaSekolah: string;
}

export const SchoolVisitorCard = ({ baseUrl, namaSekolah }: Props) => {
  const { data: todayStat, isLoading, error } = useTodayVisitors(baseUrl ?? "");

  if (isLoading) return <div className="p-4">Loading {namaSekolah}...</div>;
  if (error) return <div className="p-4">❌ Error loading data dari {namaSekolah}</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      <h2 className="text-lg font-semibold">{namaSekolah}</h2>
      <p>Total Pengunjung Hari Ini: {todayStat?.total_visitor ?? "0"}</p>

      <div className="grid grid-cols-2 gap-2 pt-2">
  {todayStat?.visitor.map((v, i) => {
    console.log(`[${namaSekolah}] Visitor #${i}`, v);

    return (
      <div key={i} className="flex items-center gap-2">
        <img
          src={
            v.image
              ? `${baseUrl}/${v.image.replace("./", "")}`
              : "/default-avatar.jpg"
          }
          alt={v.member_name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-sm">{v.member_name}</span>
      </div>
    );
  })}
</div>

    </div>
  );
};