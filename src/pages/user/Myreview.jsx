import Sidebar from "@pages/user/Sidebar";
import styles from "./User.module.css";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorMsg from "@components/ErrorMsg";

function Myreview() {
  const location = useLocation();
  console.log("location: ", location);
  console.log("location.state: ", location.state);

  const item = location.state?.item;
  const order_id = location.state?.bundle._id;
  console.log(item, order_id);

  const axios = useAxiosInstance();
  const queryClient = useQueryClient();
  // const { type } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const addReview = useMutation({
    mutationFn: (formData) => {
      formData["order_id"] = order_id;
      formData["product_id"] = item._id;
      formData.type = "review";
      return axios.post(`/replies`, formData);
    },
    onSuccess: (formData) => {
      alert("리뷰가 등록되었습니다.");
      console.log("전송된 데이터: ", formData);
      queryClient.invalidateQueries({ queryKey: ["replies", type] });
      // navigate(`/${type}`); // 나의 리뷰 페이지로 이동.(추가작업)
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <>
      <div className="flex box-border max-w-[1200px] mx-auto px-6 pb-0">
        <Sidebar />

        <div className="flex-grow min-w-0 basis-0 flex flex-col gap-[20px]">
          <div className="flex items-start p-[30px] text-[16px] border-t-2 border-black gap-[18px]">
            <img src="/icons/basket.svg" />
            <div className="flex flex-col gap-[16px]">
              <h1 className="text-[26px] font-gowunBold">상품리뷰</h1>
              <p>상품의 품질에 대해서 얼마나 만족하시나요?</p>
            </div>
          </div>

          <div className="flex items-start p-[30px] text-[16px] border-t border-grey-30 gap-[18px]">
            <img
              className="w-[140px] h-[140px] object-contain"
              src={`https://11.fesp.shop${item.image?.path}`}
            />
            <div className="flex flex-col gap-[20px] text-[18px]">
              <p>{item.name}</p>
              <p className="text-[15px]">
                {item.price.toLocaleString()}원 · {item.quantity}개
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(addReview.mutate)}>
            <div className="flex flex-col">
              <div className="flex items-start p-[30px] text-[16px] border-t border-grey-30 gap-[60px] pb-4">
                <h2 className="flex-shrink-0 font-gowunBold text-[20px]">
                  상세리뷰
                </h2>

                <div className="flex-grow border border-grey-20 rounded-[2px] w-full">
                  <textarea
                    id="content"
                    className={`${styles.textareaUnset} ${styles.textareaCustom}`}
                    rows="10"
                    placeholder="다른 고객님에게 도움이 되도록 상품에 대한 솔직한 평가를 남겨주세요."
                    {...register("content", {
                      required: "내용은 필수입니다.",
                    })}
                  ></textarea>
                </div>
              </div>
              <div className="pl-[160px] pb-[20px]">
                <ErrorMsg target={errors.content} />
              </div>
            </div>

            <div className="flex items-start p-[30px] text-[16px] border-t border-grey-30 gap-[60px] bg-red-100">
              <h2 className="font-gowunBold text-[20px]">사진첨부</h2>
              <label
                htmlFor="pictures"
                className="font-gowunBold h-[42px] leading-[42px] text-primary-70 text-[16px] px-[24px] border border-primary-30 rounded-[2px] box-border cursor-pointer"
              >
                사진 첨부하기
              </label>
              <input
                type="file"
                id="pictures"
                className="hidden"
                {...register("pictures")}
              />
              <div
                id="added-pictures"
                className="border border-grey-30 h-[80px]"
              >
                PICTURES
              </div>
            </div>

            <div className="flex justify-center gap-[24px] border-t border-grey-30 p-[34px]">
              <button className="bg-grey-40 inline-block text-[16px] text-white h-[48px] leading-[48px] font-gowunBold box-border cursor-pointer rounded-[12px] px-[64px]">
                취소
              </button>
              <button
                type="submit"
                className="bg-primary-40 inline-block text-[16px] text-white h-[48px] leading-[48px] font-gowunBold box-border cursor-pointer rounded-[12px] px-[64px]"
              >
                등록
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Myreview;
