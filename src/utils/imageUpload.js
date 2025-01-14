export const handleImageUpload = (quill) => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('attach', file);

        // 서버에 이미지 업로드 요청
        const response = await fetch('https://11.fesp.shop/files', {
          method: 'POST',
          body: formData,
          headers: {
            'client-id': 'final02',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const result = await response.json();
        const imageUrl = `https://11.fesp.shop${result.item[0].path}`;

        // 현재 커서 위치 가져오기
        const range = quill.getSelection(true);

        // 에디터에 이미지 삽입
        quill.insertEmbed(range.index, 'image', imageUrl);

        // 커서를 이미지 다음으로 이동
        quill.setSelection(range.index + 1);
      } catch (error) {
        console.error('이미지 업로드 중 오류 발생:', error);
      }
    }
  };
};
