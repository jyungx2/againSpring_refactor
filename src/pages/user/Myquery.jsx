import useAxiosInstance from "@hooks/useAxiosInstance";
import Sidebar from "@pages/user/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// URL : {{url}}/posts/users?type=qna

function Myquery() {
  const axios = useAxiosInstance();
  const { type } = useParams();
  console.log(type);

  const { data } = useQuery({
    queryKey: ["posts", type],
    queryFn: () => axios.get("/posts/users", { params: { type } }),
    select: (res) => {
      console.log(res.data);
      return res.data;
    },
  });

  return (
    <>
      <div className="flex box-border max-w-[1200px] mx-auto px-6 pb-0">
        <Sidebar />

        <div className="flex-grow min-w-0 basis-0 flex flex-col gap-[20px]">
          <div className="flex flex-col border-t-2 border-black p-[30px] pb-[40px] items-start justify-center">
            <div className="flex items-center gap-[18px]">
              <img src="/icons/query.svg" />
              <h1 className="font-gowunBold text-[26px]">문의 내역 확인</h1>
            </div>

            <div className="ml-auto">
              <button className="font-gowunBold inline-block h-[42px] text-primary-70 text-[16px] px-[24px] border border-primary-30 rounded-[2px] box-border cursor-pointer">
                문의하러 가기
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-[10px] justify-center border-t border-grey-30 p-[30px] pb-0">
            <h2 className="font-gowunBold text-[22px]">문의내역</h2>

            <table className="w-full border-collapse my-[20px]">
              <thead className="bg-grey-5 font-gowunBold">
                <tr>
                  <th className="border border-grey-30 text-center p-[8px]">
                    번호
                  </th>
                  <th className="border border-grey-30 text-center p-[8px]">
                    제목
                  </th>
                  <th className="border border-grey-30 text-center p-[8px]">
                    작성일
                  </th>
                  <th className="border border-grey-30 text-center p-[8px]">
                    작성자
                  </th>
                  <th className="border border-grey-30 text-center p-[8px]">
                    조회수
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="hover:bg-primary-5 hover:cursor-pointer">
                  <td className="border border-grey-30 text-center p-[8px]">
                    1
                  </td>
                  <td className="border border-grey-30 text-center p-[8px]">
                    배송은 보통 며칠 걸리나요?
                  </td>
                  <td className="border border-grey-30 text-center p-[8px]">
                    2024-12-02
                  </td>
                  <td className="border border-grey-30 text-center p-[8px]">
                    국연수
                  </td>
                  <td className="border border-grey-30 text-center p-[8px]">
                    2
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex gap-[48px] items-center justify-center mt-[40px]">
              <img src="/icons/arrow-left-active.svg" />
              <div className="flex gap-[6px]">
                <span>1</span>/<span>1</span>
              </div>
              <img src="/icons/arrow-right.svg" />
            </div>
          </div>

          <div className="flex gap-[12px] justify-center border-t border-grey-30 p-[30px]">
            <button className="font-gowunBold inline-block text-[16px] text-white h-[48px] leading-[48px] px-[64px] box-border cursor-pointer rounded-[12px] bg-grey-40">
              취소
            </button>
            <button className="font-gowunBold inline-block text-[16px] text-white h-[48px] leading-[48px] px-[64px] box-border cursor-pointer rounded-[12px] bg-primary-40">
              등록
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Myquery;
