import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { calculateDateRange, formatDateForSearch } from '@utils/dateUtils';
import { getSortParamsByOption } from '@utils/sortUtils';

/**
 * URL 검색 파라미터 관리를 위한 커스텀 훅
 * @param {UseCustomSearchParamsProps} props
 */

/**
 * @typedef {Object} UseCustomSearchParamsProps
 * @property {'notice' | 'qna'} type - 게시판 타입
 * @property {number} limit - 페이지당 항목 수
 */

/**
 * @typedef {Object} SearchConditions
 * @property {string} text - 검색어
 * @property {string} sort - 정렬 옵션
 * @property {Object} period - 기간 설정
 * @property {string} period.type - 기간 타입
 * @property {string} period.startDate - 시작일
 * @property {string} period.endDate - 종료일
 */

function useCustomSearchParams({ type, limit }) {
  const SORT_OPTIONS = {
    '{"title":1}': 'title-asc',
    '{"title":-1}': 'title-desc',
    '{"createdAt":1}': 'date-asc',
    '{"createdAt":-1}': 'date-desc',
    '{"views":1}': 'view-asc',
    '{"views":-1}': 'view-desc',
  };

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchConditions, setSearchConditions] = useState({
    text: searchParams.get('keyword') || '',
    sort: (() => {
      const sortParam = searchParams.get('sort');
      if (!sortParam) return 'default';
      return SORT_OPTIONS[sortParam] || 'default';
    })(),
    period: {
      type: searchParams.get('periodType') || 'all-day',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
    },
  });

  /**
   * URL 검색 파라미터 상태 관리를 위한 API 검색 파라미터 생성
   */
  const apiSearchParams = useMemo(
    () => ({
      type,
      page: 1,
      limit,
      ...(searchConditions.text.trim() && { keyword: searchConditions.text }),
      ...(searchConditions.sort !== 'default' && {
        sort: getSortParamsByOption(searchConditions.sort),
      }),
      ...(searchConditions.period.type !== 'all-day' && {
        periodType: searchConditions.period.type,
        ...(searchConditions.period.startDate && {
          startDate: searchConditions.period.startDate,
        }),
        ...(searchConditions.period.endDate && {
          endDate: searchConditions.period.endDate,
        }),
      }),
    }),
    [type, limit, searchConditions]
  );

  const urlSearchParams = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(apiSearchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value.toString());
      }
    });

    return params;
  }, [apiSearchParams]);

  /**
   * 검색어 변경 핸들러
   * @param {Event} e - 입력 이벤트
   */
  const handleSearchTextChange = (e) => {
    setSearchConditions((prev) => ({
      ...prev,
      text: e.target.value,
    }));
  };

  /**
   * 정렬 옵션 변경 핸들러
   * @param {Event} e - 선택 이벤트
   */
  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSearchConditions((prev) => ({
      ...prev,
      sort: newSortOption,
    }));

    // URL 파라미터 업데이트
    const newSearchParams = new URLSearchParams(searchParams);
    if (newSortOption !== 'default') {
      newSearchParams.set('sort', getSortParamsByOption(newSortOption));
    } else {
      newSearchParams.delete('sort');
    }
    navigate(`?${newSearchParams.toString()}`);
  };

  /**
   * 기간 타입 변경 핸들러
   * @param {string} newPeriodType - 새로운 기간 타입
   */
  const handlePeriodChange = (newPeriodType) => {
    if (newPeriodType === 'all-day') {
      // 전체 기간으로 초기화
      setSearchConditions((prev) => ({
        ...prev,
        period: {
          type: 'all-day',
          startDate: '',
          endDate: '',
        },
      }));
    } else if (newPeriodType === 'custom') {
      // 사용자 지정 기간 모드로 변경
      setSearchConditions((prev) => ({
        ...prev,
        period: {
          ...prev.period,
          type: 'custom',
        },
      }));
    } else {
      // 미리 정의된 기간으로 설정
      const { start, end } = calculateDateRange(newPeriodType);
      setSearchConditions((prev) => ({
        ...prev,
        period: {
          type: newPeriodType,
          startDate: start,
          endDate: end,
        },
      }));
    }
  };

  const handleDateChange = (type, value) => {
    setSearchConditions((prev) => ({
      ...prev,
      period: {
        ...prev.period,
        [type === 'start' ? 'startDate' : 'endDate']: value,
      },
    }));
  };

  const handleSearch = () => {
    console.log('=== 검색 시작 ===');

    const params = { ...apiSearchParams };

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
        const { start, end } = calculateDateRange(searchConditions.period.type);
        params.custom = JSON.stringify({
          createdAt: {
            $gte: formatDateForSearch(start),
            $lt: formatDateForSearch(end, true),
          },
        });
      }
    }

    navigate(`?${urlSearchParams.toString()}`);
    return params;
  };

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    setSearchConditions((prev) => ({
      text: newSearchParams.get('keyword') || '',
      sort: (() => {
        const sortParam = newSearchParams.get('sort');
        if (!sortParam) return 'default';
        return SORT_OPTIONS[sortParam] || 'default';
      })(),
      period: {
        type: newSearchParams.get('periodType') || 'all-day',
        startDate: newSearchParams.get('startDate') || '',
        endDate: newSearchParams.get('endDate') || '',
      },
    }));
  }, [searchParams]);

  return {
    searchConditions,
    handleSearchTextChange,
    handleSortChange,
    handlePeriodChange,
    handleDateChange,
    handleSearch,
    apiSearchParams,
    urlSearchParams,
  };
}

export default useCustomSearchParams;
