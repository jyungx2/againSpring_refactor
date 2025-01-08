const MainContentSection = () => {
  const stories = [
    { id: 1, title: "제로웨이스트 이야기 1" },
    { id: 2, title: "제로웨이스트 이야기 2" },
    { id: 3, title: "제로웨이스트 이야기 3" },
  ];

  return (
    <section className="w-[1200px] mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 text-black">Contents</h2>
      <div className="flex justify-between gap-6">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center text-center">
            <div className="w-[300px] h-[300px] bg-gray-300 mb-4"></div>
            <p>{story.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainContentSection;
