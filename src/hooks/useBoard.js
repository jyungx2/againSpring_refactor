import { useQuery } from '@tanstack/react-query';
import useAxiosInstance from './useAxiosInstance';
import useCustomSearchParams from './useSearchParams';
import usePagination from './usePagination';
import { calculateDateRange, formatDateForSearch } from '@utils/dateUtils';

/**
 * 게시판 공통 로직을 위한 메인 커스텀 훅
 * @param {Object} options
 * @param {'notice' | 'qna'} options.type 게시판 타입
 * @param {number} [options.limit=12] 페이지당 표시할 항목 수
 */
function useBoard({ type, limit = 12 }) {
  const axios = useAxiosInstance();
  const {
    searchConditions,
    handleSearchTextChange,
    handleSortChange,
    handlePeriodChange,
    handleDateChange,
    handleSearch,
    apiSearchParams,
  } = useCustomSearchParams({ type, limit });

  const {
    data: boardData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posts', type, apiSearchParams],
    queryFn: async () => {
      const params = {
        ...apiSearchParams,
      };

      if (searchConditions.period.type !== 'all-day') {
        if (
          searchConditions.period.type === 'custom' &&
          searchConditions.period.startDate &&
          searchConditions.period.endDate
        ) {
          params.custom = JSON.stringify({
            createdAt: {
              $gte: formatDateForSearch(searchConditions.period.startDate),
              $lt: formatDateForSearch(searchConditions.period.endDate, true),
            },
          });
        } else if (searchConditions.period.type !== 'custom') {
          const { start, end } = calculateDateRange(
            searchConditions.period.type
          );
          params.custom = JSON.stringify({
            createdAt: {
              $gte: formatDateForSearch(start),
              $lt: formatDateForSearch(end, true),
            },
          });
        }
      }

      const response = await axios.get('/posts', { params });
      return response.data;
    },
    select: (data) => ({
      items: data.item || [],
      pagination: data.pagination || { total: 0 },
    }),
    staleTime: 1000 * 10,
  });

  const pagination = usePagination({
    total: boardData?.pagination?.total || 0,
    limit,
  });

  const handleBoardSearch = async () => {
    try {
      const searchParams = handleSearch();
      await refetch();
      return searchParams;
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      throw error;
    }
  };

  return {
    searchConditions,
    handleSearchTextChange,
    handleSortChange,
    handlePeriodChange,
    handleDateChange,
    handleSearch: handleBoardSearch,

    ...pagination,

    data: boardData?.items || [],
    isLoading,
    error,
    refetch,

    total: boardData?.pagination?.total || 0,
    type,
  };
}

export default useBoard;
