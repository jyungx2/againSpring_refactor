export const QUILL_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ align: ['', 'center', 'right'] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['image'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

export const QUILL_FORMATS = [
  'bold',
  'italic',
  'underline',
  'align',
  'list',
  'link',
  'image',
  'ordered',
  'bullet',
];
