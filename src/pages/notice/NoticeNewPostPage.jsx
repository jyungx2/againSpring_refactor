import { useNavigate } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { handleImageUpload } from '@utils/imageUpload';
import { QUILL_FORMATS, QUILL_MODULES } from '@constants/editorConfig';
import useAxiosInstance from '@hooks/useAxiosInstance';
import { useQueryClient } from '@tanstack/react-query';

export default function NoticeNewPostPage() {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const { quill, quillRef } = useQuill({
    modules: QUILL_MODULES,
    formats: QUILL_FORMATS,
  });

  useEffect(() => {
    if (quill) {
      quill
        .getModule('toolbar')
        .addHandler('image', () => handleImageUpload(quill));
    }
  }, [quill]);

  const handleCancel = () => {
    const hasContent =
      title.trim() !== '' || (quill && quill.getText().trim() !== '');

    if (hasContent) {
      MySwal.fire({
        title: '작성 중인 게시물이 있습니다. 취소하시겠습니까?',
        text: '게시글은 복구할 수 없습니다.',
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
            text: '게시글 작성이 취소되었습니다.',
            confirmButtonText: '확인',
            icon: 'success',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/notice');
            }
          });
        }
      });
    } else {
      navigate('/notice');
    }
  };

  const axios = useAxiosInstance();

  const handleSave = async () => {
    const data = {
      type: 'notice',
      title: title,
      content: quill.root.innerHTML,
    };

    MySwal.fire({
      title: '게시물을 등록하시겠습니까?',
      text: '잘못 등록한 경우 상세페이지에서 수정 및 삭제가 가능합니다.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '네',
      cancelButtonText: '아니요',
    }).then((result) => {
      if (result.isConfirmed) {
        saveData();
      }
    });

    const saveData = async () => {
      try {
        const response = await axios.post('/posts', data);

        if (response.data.ok === 1) {
          await queryClient.invalidateQueries({
            queryKey: ['posts', 'notice'],
          });

          MySwal.fire({
            title: '등록 완료',
            text: '게시글 등록이 완료되었습니다.',
            confirmButtonText: '확인',
            icon: 'success',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/notice');
            }
          });
        }
      } catch (error) {
        console.error('게시글 저장 중 오류 발생:', error);
        MySwal.fire({
          title: '등록 실패',
          text:
            error.response?.data?.message ||
            '게시글 등록에 실패했습니다. 다시 시도해주세요.',
          icon: 'error',
          confirmButtonText: '확인',
        });
      }
    };
  };

  return (
    <div className='w-[1200px] mx-auto px-6 relative min-h-screen pb-32'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        공지사항
      </h1>

      <input
        className='w-full mb-4 box-border border border-black py-2 px-4 rounded-md text-xl h-[50px]'
        type='text'
        placeholder='제목을 입력하세요'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className='w-full'>
        <div className='min-h-[400px] h-[60vh] max-h-[800px]'>
          <div ref={quillRef} className='h-full' />
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 flex justify-center gap-[38px] py-10'>
        <button
          onClick={handleSave}
          className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-secondary-20 text-white'
        >
          등록하기
        </button>
        <button
          onClick={handleCancel}
          className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-grey-20'
        >
          취소하기
        </button>
      </div>
    </div>
  );
}
