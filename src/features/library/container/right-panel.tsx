import { AnnouncementCard } from "../components/announcement-card";
import { BooksAmountBox } from "../components/books-amount-box";
import { YoutubeListCard } from "../components/youtube-list-card";


export const RightPanel = () => {
  return (
    <div className="space-y-6">
      <BooksAmountBox />
      <YoutubeListCard />
      <AnnouncementCard />

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      </div> */}
      {/* <SholatScheduleCard /> */}
      {/* <TopLocationCard /> */}
    </div>
  );
};