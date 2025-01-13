import { create } from "zustand";

const useTansoStore = create((set) => ({
  electricity: 0,
  gas: 0,
  water: 0,
  transportation: 0,
  waste: 0,
  setField: (field, value) => set({ [field]: value }),
}));

export default useTansoStore;
