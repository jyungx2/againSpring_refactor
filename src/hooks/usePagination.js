import { useSearchParams } from 'react-router-dom';

/**
 * 페이지네이션 로직을 위한 커스텀 훅
 * @param {Object} options 페이지네이션 옵션
 * @param {number} options.total 전체 아이템 수
 * @param {number} [options.limit=12] 페이지당 아이템 수
 * @param {number} [options.pagesPerGroup=5] 페이지 그룹당 표시할 페이지 수
 * @returns {Object} 페이지네이션 관련 값들과 유틸리티 함수들
 */

function usePagination({ total, limit = 12, pagesPerGroup = 5 }) {
  const [searchParams] = useSearchParams();
  const currentPage = Math.min(
    parseInt(searchParams.get('page') || '1', 10),
    Math.max(1, Math.ceil(total / limit))
  );

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);

  const prevGroupLastPage = startPage - 1;
  const nextGroupFirstPage = endPage + 1;
  const showPrevButton = currentGroup > 1;
  const showNextButton = endPage < totalPages;

  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);

  /**
   * 페이지 링크 생성 함수
   * @param {number} pageNum 이동할 페이지 번호
   * @returns {string} URL 쿼리 스트링
   */

  const getPageLink = (pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString());
    return `?${params.toString()}`;
  };

  /**
   * 페이지 범위 배열 생성
   * @returns {number[]} 현재 그룹의 페이지 번호 배열
   */
  const getPageRange = () => {
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };
  return {
    currentPage,
    totalPages,
    startPage,
    endPage,

    limit,
    pagesPerGroup,

    prevGroupLastPage,
    nextGroupFirstPage,
    showPrevButton,
    showNextButton,

    startIndex,
    endIndex,

    getPageLink,
    getPageRange,
  };
}

export default usePagination;
