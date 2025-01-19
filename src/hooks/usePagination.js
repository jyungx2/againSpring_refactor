import { useSearchParams } from 'react-router-dom';

/**
 * 페이지네이션 상태 및 유틸리티 계산
 * @param {number} total - 전체 아이템 수
 * @param {number} limit - 페이지당 표시할 아이템 수
 * @param {number} pagesPerGroup - 화면에 표시할 페이지 그룹 크기
 */
function usePagination({ total, limit = 12, pagesPerGroup = 5 }) {
  const [searchParams] = useSearchParams();

  /**
   * 현재 페이지 계산
   * URL의 page 파라미터 값과 전체 페이지 수를 고려하여 유효한 페이지 번호 반환
   */
  const currentPage = Math.min(
    parseInt(searchParams.get('page') || '1', 10),
    Math.max(1, Math.ceil(total / limit))
  );

  /**
   * 페이지네이션 기본 값 계산
   * totalPages: 전체 페이지 수
   * currentGroup: 현재 페이지가 속한 그룹
   * startPage: 현재 그룹의 시작 페이지
   * endPage: 현재 그룹의 마지막 페이지
   */
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);

  /**
   * 페이지 네비게이션 버튼 표시 여부 계산
   * prevGroupLastPage: 이전 그룹의 마지막 페이지
   * nextGroupFirstPage: 다음 그룹의 첫 페이지
   * showPrevButton: 이전 그룹 버튼 표시 여부
   * showNextButton: 다음 그룹 버튼 표시 여부
   */
  const prevGroupLastPage = startPage - 1;
  const nextGroupFirstPage = endPage + 1;
  const showPrevButton = currentGroup > 1;
  const showNextButton = endPage < totalPages;

  /**
   * 현재 페이지의 아이템 인덱스 범위 계산
   * startIndex: 현재 페이지의 첫 아이템 인덱스
   * endIndex: 현재 페이지의 마지막 아이템 인덱스
   */
  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);

  /**
   * 페이지 링크 생성 함수
   * 현재 검색 조건을 유지하면서 페이지만 변경하는 URL 생성
   * @param {number} pageNum - 이동할 페이지 번호
   * @returns {string} 페이지 이동 URL 쿼리스트링
   */
  const getPageLink = (pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString());
    return `?${params.toString()}`;
  };

  /**
   * 현재 페이지 그룹의 페이지 번호 배열 생성
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
