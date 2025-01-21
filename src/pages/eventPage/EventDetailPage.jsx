import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../assets/styles/fonts.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function EventDetailPage() {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [previousEvent, setPreviousEvent] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);

  useEffect(() => {
    const dummyData = [
      {
        id: "1",
        title: "2024년 12월 윈터 이벤트",
        content: "윈터 이벤트 상세 내용입니다.",
        author: "다시, 봄",
        updatedAt: "2024-12-01 00:00:00",
        views: 10,
      },
      {
        id: "2",
        title: "2025년 1월 회원가입 이벤트",
        content: "회원가입 이벤트 상세 내용입니다.",
        author: "다시, 봄",
        updatedAt: "2025-01-01 00:00:00",
        views: 20,
      },
    ];
    const eventIndex = dummyData.findIndex((item) => item.id === id);
    setEventData(dummyData[eventIndex]);

    // 이전글과 다음글 설정
    setPreviousEvent(dummyData[eventIndex - 1] || null);
    setNextEvent(dummyData[eventIndex + 1] || null);
  }, [id]);

  /** DB 연동 시 사용
   * useEffect(() => {
    const fetchEventData = async () => {
    const response = await fetch(`https://11.fesp.shop/`);
    const data = await response.json();
    setEventData(data);
    setPreviousEvent(data.previousEvent || null);
    setNextEvent(data.nextEvent || null);
  };

  fetchEventData();
}, [id]);
   */

  const deleteCheckBtn = () => {
    MySwal.fire({
      title: "게시글을 삭제하시겠습니까?",
      text: "삭제된 게시글은 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "네",
      cancelButtonText: "아니요",
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "삭제 완료",
          text: "게시글이 삭제되었습니다.",
          confirmButtonText: "확인",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/event");
          }
        });
      }
    });
  };

  {
    /* 비정상 데이터 처리에 따른 조건부 랜더링 적용 */
  }
  if (!eventData) {
    return (
      <div className='w-[1200px] mx-auto px-6 py-4'>
        <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
          Event
        </h1>
        <p className='text-center text-lg text-grey-50 py-10'>
          해당 게시글을 찾을 수 없습니다.
        </p>
        <div className='text-center'>
          <Link
            to='/event'
            className='border border-grey-10 rounded px-6 py-3 text-lg bg-secondary-20 text-white hover:bg-secondary-40'
          >
            돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='w-[1200px] mx-auto px-6 py-4'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        Event
      </h1>

      <section className='flex flex-col'>
        <div className='border-t border-black'>
          <div className='flex items-center gap-[20px] py-4 border-b border-grey-10'>
            <label className='text-lg font-medium text-grey-80 w-24'>
              제목
            </label>
            <h2 className='text-xl font-medium text-grey-50'>
              {eventData.title}
            </h2>
          </div>
          <div className='flex items-center gap-[20px] py-4 border-b border-grey-10'>
            <label className='text-lg font-medium text-grey-80 w-24'>
              작성자
            </label>
            <p className='text-xl font-medium text-grey-50'>
              {eventData.author}
            </p>
          </div>
          <div className='border-b border-grey-10'>
            <div className='flex gap-[43px] py-4'>
              <div className='flex items-center'>
                <label className='text-lg font-medium mr-2'>작성일</label>
                <p className='text-lg text-grey-40'>{eventData.updatedAt}</p>
              </div>
              <div className='flex items-center'>
                <label className='text-lg font-medium mr-2'>조회수</label>
                <p className='text-lg text-grey-40'>{eventData.views}</p>
              </div>
            </div>

            <div className='py-4 text-xl'>{eventData.content}</div>
          </div>
        </div>

        <div className='border-t border-grey-10 pt-4 pb-2'>
          <div className='flex justify-between mb-4'>
            <button
              type='button'
              className='border border-grey-10 rounded px-9 py-3 text-lg'
            >
              <Link to='/event'>목록</Link>
            </button>
            <div className='flex gap-3'>
              <button
                type='button'
                className='border border-grey-10 rounded px-9 py-3 text-lg'
              >
                <Link to={`/event/edit/${id}`}>수정</Link>
              </button>
              <button
                type='button'
                className='border border-grey-10 rounded px-9 py-3 text-lg'
                onClick={deleteCheckBtn}
              >
                삭제
              </button>
            </div>
          </div>
          <nav className='mb-4'>
            <div className='border-t border-b border-grey-5'>
              <div className='flex items-center border-b border-grey-5 min-h-[60px]'>
                <div className='w-[100px] sm:w-[120px] px-4 py-4 text-grey-50 text-lg font-medium shrink-0'>
                  <span className='text-sm mr-2'>▲</span>이전글
                </div>
                {previousEvent ? (
                  <Link
                    to={`/event/detail/${previousEvent.id}`}
                    className='flex-1 px-4 py-4 text-lg text-grey-80 hover:text-secondary-20 truncate'
                  >
                    {previousEvent.title}
                  </Link>
                ) : (
                  <p className='flex-1 px-4 py-4 text-lg text-grey-40'>
                    이전 글이 없습니다.
                  </p>
                )}
              </div>
              <div className='flex items-center min-h-[60px]'>
                <div className='w-[100px] sm:w-[120px] px-4 py-4 text-grey-50 text-lg font-medium shrink-0'>
                  <span className='text-sm mr-2'>▼</span>다음글
                </div>
                {nextEvent ? (
                  <Link
                    to={`/event/detail/${nextEvent.id}`}
                    className='flex-1 px-4 py-4 text-lg text-grey-80 hover:text-secondary-20 truncate'
                  >
                    {nextEvent.title}
                  </Link>
                ) : (
                  <p className='flex-1 px-4 py-4 text-lg text-grey-40'>
                    다음 글이 없습니다.
                  </p>
                )}
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
