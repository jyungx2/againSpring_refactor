export const calculateDateRange = (periodType) => {
  const currentDate = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  switch (periodType) {
    case 'one-day':
      return {
        start: formatDate(new Date(currentDate.getTime() - oneDay)),
        end: formatDate(currentDate),
      };
    case 'one-week':
      return {
        start: formatDate(new Date(currentDate.getTime() - oneDay * 7)),
        end: formatDate(currentDate),
      };
    case 'one-month': {
      const lastMonth = new Date(currentDate);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return {
        start: formatDate(lastMonth),
        end: formatDate(currentDate),
      };
    }
    case 'six-month': {
      const sixMonthsAgo = new Date(currentDate);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return {
        start: formatDate(sixMonthsAgo),
        end: formatDate(currentDate),
      };
    }
    case 'one-year': {
      const oneYearAgo = new Date(currentDate);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return {
        start: formatDate(oneYearAgo),
        end: formatDate(currentDate),
      };
    }
    default:
      return {
        start: '',
        end: '',
      };
  }
};

export const formatDateForSearch = (dateString, isEndDate = false) => {
  const formattedDate = dateString.replace(/-/g, '.');
  return isEndDate ? `${formattedDate} 23:59:59` : `${formattedDate} 00:00:00`;
};
