import Sidebar from "@pages/user/Sidebar";
import styles from "./User.module.css";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorMsg from "@components/ErrorMsg";
import { useState } from "react";

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
    mutationFn: async (formData) => {
      // 리뷰 이미지 등록 로직 구현
      if (formData.attach?.length > 0) {
        const reviewFormData = new FormData();
        reviewFormData.append("attach", formData.attach[0]); // ∵ files API: 첨부 파일 필드명은 attach로 지정해야 한다고 나와있음.

        const fileRes = await axios.post("/files", reviewFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("fileRes: ", fileRes);
        console.log("fileRes.data: ", fileRes.data);

        formData.image = fileRes.data.item[0];
        delete formData.attach;
      }

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

  const [reviewImage, setReviewImage] = useState([]);
  const handlePictureShow = (e) => {
    const file = e.target.files[0]; // 사용자가 업로드한 파일
    console.log("file: ", file);
    if (file) {
      if (reviewImage.length >= 3) {
        alert("최대 3개까지만 등록 가능합니다.");
        return;
      }

      // 새로운 URL 생성
      const newImageUrl = URL.createObjectURL(file);
      console.log("추가된 이미지 URL: ", newImageUrl);
      setReviewImage((prev) => [...prev, newImageUrl]);
      // 기존 이미지들을 유지하면서 새 이미지 추가
    }
  };
  console.log(reviewImage);

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

            <div className="flex items-start p-[30px] text-[16px] border-t border-grey-30 gap-[60px]">
              <h2 className="font-gowunBold text-[20px]">사진첨부</h2>
              <label
                htmlFor="attach"
                className="font-gowunBold h-[42px] leading-[42px] text-primary-70 text-[16px] px-[24px] border border-primary-30 rounded-[2px] box-border cursor-pointer"
              >
                사진 첨부하기
              </label>
              <input
                type="file"
                id="attach"
                accept="image/*"
                className="hidden"
                {...register("attach", {
                  onChange: (e) => {
                    handlePictureShow(e);
                  },
                })}
              />
              <div
                id="added-pictures"
                className="flex gap-2 border border-grey-20 rounded-lg"
              >
                {reviewImage?.map((image, i) => {
                  return (
                    <div key={i} className="w-[80px] h-[80px] rounded-lg">
                      <img
                        src={image}
                        alt={`리뷰사진 미리보기 ${i + 1}`}
                        className="w-full h-full object-cover p-1"
                      />
                    </div>
                  );
                })}
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
