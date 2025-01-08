import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/fonts.css';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useState } from 'react';

export default function ProductQnAPostDetailPage() {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  // 댓글 입력 상태 관리
  const [newComment, setNewComment] = useState('');

  // 댓글 더미 데이터 상태관리
  const [comments, setComments] = useState([
    {
      id: 1,
      name: '다시, 봄',
      content: '내일 출고 예정 입니다.',
      createdAt: '2024-01-01 00:00:00',
    },
  ]);

  // 새 댓글 작성 취소
  const handleNewCommentCancel = () => {
    if (newComment.trim() !== '') {
      MySwal.fire({
        title: '작성 중인 댓글이 있습니다. <br/> 취소하시겠습니까?',
        text: '작성 중인 내용이 모두 삭제됩니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네',
        cancelButtonText: '아니요',
      }).then((result) => {
        if (result.isConfirmed) {
          setNewComment('');
        }
      });
    } else {
      setNewComment('');
    }
  };

  // 새 댓글 등록
  const handleNewCommentSubmit = () => {
    if (newComment.trim() === '') {
      MySwal.fire({
        title: '알림',
        text: '댓글 내용을 입력해주세요.',
        icon: 'warning',
        confirmButtonText: '확인',
      });
      return;
    }

    const newCommentObj = {
      id: comments.length + 1,
      name: '다시, 봄',
      content: newComment,
      createdAt: '2024-01-01 00:00:00',
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');

    MySwal.fire({
      title: '등록 완료',
      text: '댓글이 등록되었습니다.',
      icon: 'success',
      confirmButtonText: '확인',
    });
  };

  // 수정 중인 댓글 ID와 수정 내용 상태 관리
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  // 수정 모드 시작
  const handleEditStart = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // 수정 취소 확인
  const handleEditCancel = (comment) => {
    // 현재 수정 중인 내용이 원본과 다른지 확인
    const contentChanged = editContent.trim() !== comment.content.trim();

    if (contentChanged) {
      MySwal.fire({
        title: '수정 중인 댓글이 있습니다. <br/> 취소하시겠습니까?',
        text: '기존에 작성된 댓글로 복구됩니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네',
        cancelButtonText: '아니요',
      }).then((result) => {
        if (result.isConfirmed) {
          MySwal.fire({
            title: '취소 완료',
            text: '댓글 수정이 취소되었습니다.',
            confirmButtonText: '확인',
            icon: 'success',
          }).then(() => {
            setEditingId(null);
            setEditContent('');
          });
        }
      });
    } else {
      // 변경사항이 없으면 바로 수정 모드 종료
      setEditingId(null);
      setEditContent('');
    }
  };

  // 수정 완료
  const handleEditComplete = (commentId) => {
    if (editContent.trim() === '') {
      MySwal.fire({
        title: '알림',
        text: '댓글 내용을 입력해주세요.',
        icon: 'warning',
        confirmButtonText: '확인',
      });
      return;
    }

    MySwal.fire({
      title: '댓글을 수정하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '네',
      cancelButtonText: '아니요',
    }).then((result) => {
      if (result.isConfirmed) {
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, content: editContent }
              : comment
          )
        );
        setEditingId(null);
        setEditContent('');

        MySwal.fire({
          title: '수정 완료',
          text: '댓글이 수정되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
        });
      }
    });
  };

  // 댓글 삭제
  const handleCommentDelete = (commentId) => {
    MySwal.fire({
      title: '댓글을 삭제하시겠습니까?',
      text: '삭제된 댓글은 복구할 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '네',
      cancelButtonText: '아니요',
    }).then((result) => {
      if (result.isConfirmed) {
        setComments(comments.filter((comment) => comment.id !== commentId));
        MySwal.fire({
          title: '삭제 완료',
          text: '댓글이 삭제되었습니다.',
          confirmButtonText: '확인',
          icon: 'success',
        });
      }
    });
  };

  const deleteCheckBtn = () => {
    MySwal.fire({
      title: '게시글을 삭제하시겠습니까?',
      text: '삭제된 게시글은 복구할 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '네',
      cancelButtonText: '아니요',
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: '삭제 완료',
          text: '게시글이 삭제되었습니다.',
          confirmButtonText: '확인',
          icon: 'success',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/qna');
          }
        });
      }
    });
  };

  return (
    <div className='w-[1200px] mx-auto px-6 py-4'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        Q&amp;A
      </h1>

      {/* 상품 정보 불러오기 */}
      <div className='flex items-center mb-4 p-6 border rounded-md w-full'>
        <div className='mr-6'>
          <div className='w-32 h-32 bg-gray-200 flex items-center justify-center text-base text-gray-600'>
            상품 Image
          </div>
        </div>
        <div className='flex flex-col gap-4 justify-center h-32'>
          <div className='text-xl'>
            상품명: 대나무 칫솔 (소형) <br /> 1,400원
          </div>
          <div className='flex gap-4'>
            <button className='px-6 py-2.5 bg-black text-white text-lg rounded hover:bg-gray-800'>
              <Link to='/detail'>상품상세보기</Link>
            </button>
          </div>
        </div>
      </div>

      <section className='flex flex-col'>
        {/* 게시글 헤더 */}
        <div className='border-t border-black'>
          <div className='flex items-center gap-[100px] py-4 border-b border-grey-10'>
            <label
              className='text-xl font-medium text-grey-80 w-24'
              htmlFor='title'
            >
              제목
            </label>
            <h2
              className='text-2xl font-medium text-grey-50 flex items-center gap-2'
              id='title'
            >
              상품 관련 문의
              <span className='inline-block px-5 py-2 rounded-[20px] text-white text-base bg-primary-40'>
                답변완료
              </span>
            </h2>
          </div>
          <div className='flex items-center gap-[100px] py-4 border-b border-grey-10'>
            <label
              className='text-xl font-medium text-grey-80 w-24'
              htmlFor='writer'
            >
              작성자
            </label>
            <p className='text-2xl font-medium text-grey-50' id='writer'>
              홍길동
            </p>
          </div>

          {/* 작성일/조회수 */}
          <div className='border-b border-grey-10'>
            <div className='flex gap-[43px] py-4'>
              <div className='flex items-center'>
                <label className='text-xl font-medium pl-5 mr-2' htmlFor='date'>
                  작성일
                </label>
                <p className='text-xl text-grey-40' id='date'>
                  2024-01-01 00:00:00
                </p>
              </div>
              <div className='flex items-center'>
                <label className='text-xl font-medium mr-2' htmlFor='views'>
                  조회수
                </label>
                <p className='text-xl text-grey-40' id='views'>
                  0
                </p>
              </div>
            </div>

            {Array.from({ length: 10 }, (_, i) => (
              <p key={i} className='py-4 text-xl'>
                여기에 글 내용이 들어갑니다 {i + 1}번째 줄
              </p>
            ))}
          </div>
        </div>

        {/* 댓글 섹션 */}
        <section className='mb-8'>
          {comments.map((comment) => (
            <div key={comment.id} className='py-8 border-b border-grey-10'>
              <div className='flex items-center'>
                <label className='text-2xl font-medium flex items-center gap-2 pl-3'>
                  {comment.name}
                </label>
                <p className='text-2xl text-grey-50 font-normal ml-3'>
                  {comment.createdAt}
                </p>
              </div>
              {editingId === comment.id ? (
                // 수정모드
                <div className='mt-4 p-6'>
                  <textarea
                    className='w-full min-h-[80px] resize-y border border-grey-30 p-2 rounded text-2xl'
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className='flex gap-2 mt-2 justify-end'>
                    <button
                      type='button'
                      className='rounded-lg px-6 py-2 bg-secondary-20 text-white text-2xl cursor-pointer'
                      onClick={() => handleEditComplete(comment.id)}
                    >
                      수정완료
                    </button>
                    <button
                      type='button'
                      className='rounded-lg bg-grey-20 text-white px-6 py-2 text-2xl'
                      onClick={() => handleEditCancel(comment)}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className='text-xl text-grey-80 mt-4 pl-3'>
                    {comment.content}
                  </p>
                  <div className='flex mt-4'>
                    <button
                      type='button'
                      className='text-2xl text-grey-40 hover:text-grey-70 font-normal relative ml-4'
                      onClick={() => handleEditStart(comment)}
                    >
                      수정
                    </button>
                    <button
                      type='button'
                      className="text-2xl text-grey-40 hover:text-grey-70 font-normal relative ml-4 before:content-['/'] before:absolute before:left-[-8px]"
                      onClick={() => handleCommentDelete(comment.id)}
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* 댓글 입력 */}
          <div className='flex flex-col gap-4 border border-grey-5 p-6 mb-6'>
            <textarea
              className='w-full min-h-[80px] resize-y border border-grey-30 p-2 text-xl'
              placeholder='댓글을 입력하세요.'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className='flex justify-end gap-2'>
              <button
                type='submit'
                onClick={handleNewCommentSubmit}
                className='rounded-lg px-6 py-2 bg-secondary-20 text-white cursor-pointer text-xl'
              >
                작성
              </button>
              {newComment.trim() !== '' && (
                <button
                  type='button'
                  onClick={handleNewCommentCancel}
                  className='rounded-lg bg-grey-20 text-white px-6 py-2 text-xl'
                >
                  취소
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 하단 네비게이션 */}
        <div className='border-t border-grey-10 pt-8 pb-4'>
          <div className='flex justify-between mb-5'>
            <button
              type='button'
              className='border border-grey-10 rounded px-9 py-2 text-xl'
            >
              <Link to='/qna'>목록</Link>
            </button>
            <div className='flex gap-3'>
              <button
                type='button'
                className='border border-grey-10 rounded px-9 py-2 text-xl'
              >
                <Link to='/qna/product/edit'>수정</Link>
              </button>
              <button
                type='button'
                className='border border-grey-10 rounded px-9 py-2 text-xl'
                onClick={deleteCheckBtn}
              >
                삭제
              </button>
            </div>
          </div>

          <nav className='mb-4'>
            <div className='border-t border-b border-grey-5'>
              <div className='flex items-center border-b border-grey-5 min-h-[60px]'>
                <div className='w-[100px] sm:w-[120px] px-4 py-4 text-grey-50 text-xl font-medium shrink-0'>
                  <span className='text-base mr-2'>▲</span>이전글
                </div>
                <Link
                  to='#'
                  className='flex-1 px-4 py-4 text-xl text-grey-80 hover:text-secondary-20 truncate'
                >
                  이전 공지글
                </Link>
              </div>
              <div className='flex items-center min-h-[60px]'>
                <div className='w-[100px] sm:w-[120px] px-4 py-4 text-grey-50 text-xl font-medium shrink-0'>
                  <span className='text-base mr-2'>▼</span>다음글
                </div>
                <Link
                  to='#'
                  className='flex-1 px-4 py-4 text-xl text-grey-80 hover:text-secondary-20 truncate'
                >
                  다음 공지글
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
