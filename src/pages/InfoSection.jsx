const InfoSection = () => {
  const notices = Array.from({ length: 7 }, (_, i) => ({
    title: `공지사항 ${i + 1}`,
    date: "24.01.01",
  }));

  const inquiries = Array.from({ length: 5 }, (_, i) => ({
    title: `문의사항 ${i + 1}`,
    date: "24.01.01",
  }));
};

export default InfoSection;
