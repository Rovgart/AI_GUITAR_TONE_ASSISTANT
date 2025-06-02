import { create } from "zustand";
export type fieldT = "bandName" | "ampName" | "irName";
interface generateFormStoreT {
  bandName: string;
  ampName: string;
  irName: string;
  setFormData: (field: fieldT, data: string) => void;
}
export const useGenerateFormStore = create<generateFormStoreT>((set) => ({
  bandName: "",
  ampName: "",
  irName: "",
  setFormData: (field, data) => set(() => ({ [field]: data })),
}));
