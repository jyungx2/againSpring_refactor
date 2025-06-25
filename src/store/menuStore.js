import { create } from "zustand";

const useMenuStore = create((set) => ({
  activeMenu: null,
  setActiveMenu: (menu) => set({ activeMenu: menu }), 

  menuItems: [],
  setMenuItems: (items) => set({ menuItems: items }),
}));

export default useMenuStore;