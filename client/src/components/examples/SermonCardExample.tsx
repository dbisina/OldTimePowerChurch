import { SermonCard } from "../SermonCard";

export default function SermonCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 max-w-5xl">
      <SermonCard
        id="1"
        title="The Power of Persistent Prayer"
        preacher="Pastor John"
        serviceDay="Sunday"
        date="Nov 24, 2024"
        excerpt="Discover how persistent prayer can transform your spiritual life and bring breakthrough."
        duration="45:30"
        featured={true}
      />
      <SermonCard
        id="2"
        title="Walking in the Spirit"
        preacher="Pastor John"
        serviceDay="Friday"
        date="Nov 22, 2024"
        excerpt="Learn what it means to walk in the Spirit daily and experience fullness."
        duration="38:15"
      />
      <SermonCard
        id="3"
        title="Understanding the Book of Romans"
        preacher="Elder James"
        serviceDay="Tuesday"
        date="Nov 19, 2024"
        excerpt="A deep dive into the theological foundations laid out in Paul's letter."
        duration="52:00"
      />
    </div>
  );
}
