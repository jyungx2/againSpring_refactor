import React from 'react';
import { useForm } from 'react-hook-form';
import useAxiosInstance from '@hooks/useAxiosInstance';
import useUserStore from '@store/userStore';
import { useNavigate } from 'react-router-dom';
import styles from './User.module.css';
import ErrorMsg from '@components/ErrorMsg';

function ExtraInfoForm() {
  const axiosInstance = useAxiosInstance();
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  // 초기값: 이미 저장된 이름, 이메일은 불러오고, 나머지는 빈 문자열 처리
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      // 회원 정보 업데이트
      const response = await axiosInstance.patch(`/users/${user._id}`, data);
      const updatedUser = response.data.item;
      setUser(updatedUser);
      alert(`${user?.name}님, [Google 계정] 신규 회원 가입 + 로그인이 완료되었습니다.`);
      navigate('/');
    } catch (error) {
      console.error('추가 정보 업데이트 실패:', error.response?.data || error.message);
      alert('정보 수정에 실패했습니다.');
    }
  };

  return (
    <div className="py-32 mx-auto max-w-[1200px]">
      <div className="w-[400px] mx-auto flex flex-col items-center p-[20px_40px_44px] border border-grey-20 rounded-[20px] gap-[30px]">
        <div className="w-20 aspect-[1/1] object-contain">
          <a href="/" className="cursor-pointer">
            <img src="/favicon.png" alt="logo" />
          </a>
        </div>
        <h2 className="text-4xl text-center font-bold">
          [Google 회원가입 전용] <br />
          추가 정보 입력 폼
        </h2>

        {/* 폼 영역 */}
        <div className="w-[320px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              <label htmlFor="name" className="block mb-1 font-semibold px-4">
                이름
              </label>
              <div className={`border-2 border-grey-10 rounded-2xl focus-within:border-secondary-20 ${errors.name ? styles.error : ''}`}>
                <input id="name" type="text" placeholder="" disabled className={`${styles.inputUnset} ${styles.inputCustom}`} {...register('name', { required: '이름은 필수입니다.' })} />
              </div>
              <ErrorMsg target={errors.name} />

              <label htmlFor="name" className="block mb-1 font-semibold px-4">
                이메일
              </label>
              <div className={`border-2 border-grey-10 rounded-2xl focus-within:border-secondary-20 ${errors.email ? styles.error : ''}`}>
                <input id="email" type="email" placeholder="" disabled className={`${styles.inputUnset} ${styles.inputCustom}`} {...register('email', { required: '이메일은 필수입니다.' })} />
              </div>
              <ErrorMsg target={errors.email} />

              <label htmlFor="name" className="block mb-1 font-semibold px-4">
                휴대전화번호
              </label>
              <div className={`border-2 border-grey-10 rounded-2xl focus-within:border-secondary-20 px-4 ${errors.phone ? styles.error : ''}`}>
                <input id="phone" type="text" placeholder="휴대전화번호를 입력하세요." className={`${styles.inputUnset} ${styles.inputCustom}`} {...register('phone', { required: '휴대전화번호는 필수입니다.' })} />
              </div>
              <ErrorMsg target={errors.phone} />

              <label htmlFor="name" className="block mb-1 font-semibold px-4">
                주소
              </label>
              <div className={`border-2 border-grey-10 rounded-2xl focus-within:border-secondary-20 px-4 ${errors.address ? styles.error : ''}`}>
                <input id="address" type="text" placeholder="주소를 입력하세요." className={`${styles.inputUnset} ${styles.inputCustom}`} {...register('address', { required: '주소는 필수입니다.' })} />
              </div>
              <ErrorMsg target={errors.address} />
            </div>

            <div className="mt-8">
              <button type="submit" className="font-gowunBold w-full h-[42px] rounded-[12px] text-center cursor-pointer box-border bg-primary-40 text-white mb-[10px] hover:bg-primary-30">
                가입하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ExtraInfoForm;
