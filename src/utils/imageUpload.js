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

        const range = quill.getSelection(true);

        quill.insertEmbed(range.index, 'image', imageUrl);

        quill.setSelection(range.index + 1);
      } catch (error) {
        console.error('이미지 업로드 중 오류 발생:', error);
      }
    }
  };
};
