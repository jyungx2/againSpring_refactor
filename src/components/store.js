import create from 'zustand';

const useStore = create((set) => ({
  title: '기본 헤더 제목',
  setTitle: (newTitle) => set({ title: newTitle }),
}));

export default useStore;