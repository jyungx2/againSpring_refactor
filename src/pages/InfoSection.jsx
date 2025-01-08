import { Link } from "react-router-dom";
const InfoSection = () => {

  const notices = [
    { id: 1, title: "공지사항 1", date: "24.01.01" },
    { id: 2, title: "공지사항 2", date: "24.01.02" },
    { id: 3, title: "공지사항 3", date: "24.01.03" },
    { id: 4, title: "공지사항 4", date: "24.01.04" },
    { id: 5, title: "공지사항 5", date: "24.01.05" },
  ];

  const inquiries = [
    { id: 1, title: "문의사항 1", date: "24.01.01" },
    { id: 2, title: "문의사항 2", date: "24.01.02" },
    { id: 3, title: "문의사항 3", date: "24.01.03" },
    { id: 4, title: "문의사항 4", date: "24.01.04" },
    { id: 5, title: "문의사항 5", date: "24.01.05" },
  ];

  return (
    <div className="w-full px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 gap-8 mt-10">
          {/* 공지사항 */}
          <div className="border-b border-gray-300 rounded-md overflow-hidden">
            <div className="flex justify-between items-center py-4 px-6 border-b border-gray-300">
              <h3 className="text-3xl font-bold">공지사항</h3>

              <Link to="/notice">
                <button
                  className="w-8 h-8 hover:opacity-80 focus:outline-none"
                  aria-label="공지사항 더보기"
                >
                  <img src="/icons/plus.svg" alt="더보기" />
                </button>
              </Link>
            </div>
            <ul className="space-y-3 px-6 py-4">
              {notices.map((notice) => (
                <li
                  key={notice.id}
                  className="flex justify-between items-center text-lg py-2"
                >
                  <span className="text-gray-800">{notice.title}</span>
                  <span className="text-gray-500">{notice.date}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Q&A */}
          <div className="border-b border-gray-300 rounded-md overflow-hidden">
            <div className="flex justify-between items-center py-4 px-6 border-b border-gray-300">
              <h3 className="text-3xl font-bold">Q&A</h3>
              <Link to="/QnA">
                <button
                  className="w-8 h-8 hover:opacity-80 focus:outline-none"
                  aria-label="Q&A 더보기"
                >
                  <img src="/icons/plus.svg" alt="더보기" />
                </button>
              </Link>
            </div>
            <ul className="space-y-3 px-6 py-4">
              {inquiries.map((inquiry) => (
                <li
                  key={inquiry.id}
                  className="flex justify-between items-center text-lg py-2"
                >
                  <span className="text-gray-800">{inquiry.title}</span>
                  <span className="text-gray-500">{inquiry.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;