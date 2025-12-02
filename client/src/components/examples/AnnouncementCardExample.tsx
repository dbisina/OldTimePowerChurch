import { AnnouncementCard } from "../AnnouncementCard";

export default function AnnouncementCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-4xl">
      <AnnouncementCard
        id="1"
        title="Christmas Carol Service"
        content="Join us for our annual Christmas Carol Service on December 24th at 6:00 PM. A special time of worship and celebration."
        type="graphic"
        graphicUrl="https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=800&q=80"
        publishedAt="Nov 20, 2024"
        pinned={true}
      />
      <AnnouncementCard
        id="2"
        title="Youth Bible Study - New Series"
        content="Our youth ministry is starting a new series on 'Faith in Action'. Every Saturday at 4:00 PM."
        type="non_graphic"
        publishedAt="Nov 18, 2024"
      />
    </div>
  );
}
