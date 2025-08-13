import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@hooks/useAxiosInstance";
import useUserStore from "@store/userStore";
import { useEffect, useState } from "react";
import { useDeletePost } from "@hooks/useDeletePost";
import CommentList from "@pages/comment/CommentList";
import PropTypes from "prop-types";

/**
 * 게시글 상세 조회 및 관련 데이터 처리 컴포넌트
 * @param {string} type - 게시글 타입 (notice 또는 qna)
 */
export default function PostDetail({ type = "notice", onDataLoad }) {
  // 관리자 이메일 배열 정의
  const ADMIN_EMAILS = ["admin@market.com", "seop96@naver.com"];

  const { id } = useParams();
  const { user } = useUserStore();
  const axios = useAxiosInstance();

  /**
   * 게시글 삭제 커스텀 훅
   * 삭제 후 목록으로 리다이렉트
   */
  const { handleDelete } = useDeletePost({
    id,
    queryKey: `${type}Detail`,
    redirectPath: `/${type}`,
  });

  const [navigationLinks, setNavigationLinks] = useState({
    previous: { link: undefined, title: undefined },
    next: { link: undefined, title: undefined },
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [replies, setReplies] = useState([]);
  const [hasAdminReply, setHasAdminReply] = useState(false);

  /**
   * 게시글 데이터 조회 쿼리
   * @returns {object} 게시글 상세 정보
   */
  const { data, isLoading, error } = useQuery({
    queryKey: [`${type}Detail`, id],
    queryFn: () => axios.get(`/posts/${id}`),
    select: (res) => res.data,
  });

  /**
   * 게시글 수정 권한 체크 함수
   * 공지사항: 작성자인 관리자만 수정 가능
   * Q&A: 작성자 또는 관리자가 수정 가능
   * @returns {boolean} 수정 권한 여부
   */
  const checkEditPermission = () => {
    if (type === "notice") {
      return user?.type === "admin" && user.id === data?.item?.user_id;
    }
    return user?.type === "admin" || user?._id === data?.item?.user?._id;
  };

  /**
   * 객체 배열에서 특정 ID를 가진 항목을 찾는 유틸리티 함수
   * @param {Array} objectList - 검색할 객체 배열
   * @param {string} searchId - 찾고자 하는 ID
   * @returns {object} 찾은 항목과 인덱스
   */
  const findItemById = (objectList, searchId) => {
    const index = objectList.findIndex((item) => item._id == searchId);
    return { item: index !== -1 ? objectList[index] : null, index };
  };

  /**
   * 게시글 데이터 처리 및 이전/다음글 네비게이션 설정
   * 1. Q&A일 경우 제품 정보와 답변 상태 설정
   * 2. 이전/다음 게시글 정보 조회 및 설정
   */
  useEffect(() => {
    // 제품 정보 설정
    if (type === "qna" && data?.item) {
      if (data.item?.product?.name?.[0] && data.item?.product?._id?.[0]) {
        setSelectedProduct({
          ...data.item.product,
          name: data.item.product.name[0],
          _id: data.item.product._id[0],
          mainImages: data.item.product.mainImages[0],
        });
      }

      // 답변 상태 설정
      if (data.item?.replies) {
        setReplies(data.item.replies);
        const adminReplyExists = data.item.replies.some((reply) =>
          ADMIN_EMAILS.includes(reply.user?.email)
        );
        setHasAdminReply(adminReplyExists);
      }
    }

    /**
     * 이전/다음 게시글 정보를 조회하는 함수
     * @param {string} id - 현재 게시글 ID
     */
    const findPreNextPostInfo = async (id) => {
      try {
        const response = await axios.get(`/posts`, {
          params: {
            page: 1,
            limit: 100,
            type,
          },
        });

        if (response?.data?.item) {
          const nowIndexData = findItemById(response.data.item, id);
          const itemList = response.data.item;

          // 이전/다음글 네비게이션 링크 설정
          setNavigationLinks({
            next:
              nowIndexData.index > 0
                ? {
                    link: `/${type}/detail/${
                      itemList[nowIndexData.index - 1]?._id
                    }`,
                    title: itemList[nowIndexData.index - 1]?.title,
                  }
                : { link: "#", title: "" },
            previous:
              nowIndexData.index < itemList.length - 1
                ? {
                    link: `/${type}/detail/${
                      itemList[nowIndexData.index + 1]?._id
                    }`,
                    title: itemList[nowIndexData.index + 1]?.title,
                  }
                : { link: "#", title: "" },
          });
        }

        if (data?.item) {
          onDataLoad?.(data.item); // 부모 컴포넌트에 데이터 전달
        }
      } catch (error) {
        console.log(`${type} 게시판 에러발생`, error);
      }
    };

    findPreNextPostInfo(id);
  }, [data, type]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">로딩중...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">에러가 발생했습니다</div>
      </div>
    );

  if (!data?.item)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">데이터를 찾을 수 없습니다</div>
      </div>
    );

  return (
    <div className="w-[1200px] mx-auto px-6 py-4">
      <h1 className="h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]">
        {type === "notice" ? "공지사항" : "Q&A"}
      </h1>

      {type === "qna" && selectedProduct && (
        <div className="flex items-center mb-4 p-6 border rounded-md w-full">
          <div className="mr-6 relative">
            {selectedProduct.mainImages?.length > 0 ? (
              <img
                src={`https://fesp-api.koyeb.app/market${selectedProduct.mainImages[0].path}`}
                className="w-32 h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-600"
                alt={selectedProduct.name}
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                No Image
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 justify-center h-32">
            <div className="text-xl">상품명: {selectedProduct.name}</div>
            <div className="flex gap-4">
              <button className="px-6 py-2.5 bg-black text-white text-lg rounded hover:bg-gray-800">
                <Link to={`/detail/${selectedProduct?._id}`}>상품상세보기</Link>
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="flex flex-col">
        <div className="border-t border-black">
          <div className="flex items-center gap-[100px] py-4 border-b border-grey-10">
            <label
              className="text-lg font-medium text-grey-80 w-24"
              htmlFor="title"
            >
              제목
            </label>
            <h2
              className="text-xl font-medium text-grey-50 flex items-center gap-2"
              id="title"
            >
              {data.item.title}
              {type === "qna" && (
                <span
                  className={`inline-block px-5 py-2 rounded-[20px] text-white text-sm ml-2.5 
                  ${hasAdminReply ? "bg-primary-40" : "bg-grey-20"}`}
                >
                  {hasAdminReply ? "답변완료" : "답변대기"}
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-[100px] py-4 border-b border-grey-10">
            <label
              className="text-lg font-medium text-grey-80 w-24"
              htmlFor="writer"
            >
              작성자
            </label>
            <p className="text-xl font-medium text-grey-50" id="writer">
              {data.item.user?.name}
            </p>
          </div>

          <div className="border-b border-grey-10">
            <div className="flex gap-[43px] py-4">
              <div className="flex items-center">
                <label className="text-lg font-medium pl-5 mr-2" htmlFor="date">
                  작성일
                </label>
                <p className="text-lg text-grey-40" id="date">
                  {data.item.createdAt}
                </p>
              </div>
              <div className="flex items-center">
                <label className="text-lg font-medium mr-2" htmlFor="views">
                  조회수
                </label>
                <p className="text-lg text-grey-40" id="views">
                  {data.item.views}
                </p>
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: data.item.content }}></div>
          </div>
        </div>

        {type === "qna" && (
          <CommentList
            comments={replies}
            setReplies={setReplies}
            isAdmin={user?.type === "admin"}
            post={data.item}
          />
        )}

        <div className="border-t border-grey-10 pt-4 pb-2">
          <div className="flex justify-between mb-4">
            <button
              type="button"
              className="border border-grey-10 rounded px-9 py-3 text-lg"
            >
              <Link to={`/${type}`}>목록</Link>
            </button>
            {checkEditPermission() && (
              <div className="flex gap-3">
                <button
                  type="button"
                  className="border border-grey-10 rounded px-9 py-3 text-lg"
                >
                  <Link to={`/${type}/edit/${id}`}>수정</Link>
                </button>
                <button
                  type="button"
                  className="border border-grey-10 rounded px-9 py-3 text-lg"
                  onClick={handleDelete}
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          <nav className="mb-4">
            <div className="border-t border-b border-grey-5">
              <div className="flex items-center border-b border-grey-5 min-h-[60px]">
                <div className="w-[100px] sm:w-[120px] px-4 py-4 text-grey-50 text-xl font-medium shrink-0">
                  <span className="text-base mr-2">▲</span>다음글
                </div>
                <Link
                  to={navigationLinks.next.link}
                  className="flex-1 px-4 py-4 text-xl text-grey-80 hover:text-secondary-20 truncate"
                >
                  {navigationLinks.next.title || "다음 글이 없습니다"}
                </Link>
              </div>
              <div className="flex items-center min-h-[60px]">
                <div className="w-[100px] sm:w-[120px] px-4 py-4 text-grey-50 text-xl font-medium shrink-0">
                  <span className="text-base mr-2">▼</span>이전글
                </div>
                <Link
                  to={navigationLinks.previous.link}
                  className="flex-1 px-4 py-4 text-xl text-grey-80 hover:text-secondary-20 truncate"
                >
                  {navigationLinks.previous.title || "이전 글이 없습니다"}
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}

PostDetail.propTypes = {
  type: PropTypes.oneOf(["notice", "qna"]).isRequired,
  onDataLoad: PropTypes.func,
};
