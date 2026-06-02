export enum BookingTrangThai {
  BAN_NHAP = "ban_nhap",
  DA_GUI = "da_gui",
  CHUA_DUYET = "chua_duyet",
  DA_DUYET = "da_duyet",
  BI_TU_CHOI = "bi_tu_choi",
  DA_THANH_TOAN = "da_thanh_toan",
  DANG_IN = "dang_in",
  DA_IN = "da_in",
  IN_LOI = "in_loi",
  HOAN_THANH = "hoan_thanh",
  DA_HUY = "da_huy",
  DA_XOA = "da_xoa",
  GUI_LAI = "gui_lai",
  MUA_THEM = "mua_them",
  TU_CHOI_MUA_THEM = "tu_choi_mua_them",
  GUI_LAI_MUA_THEM = "gui_lai_mua_them",
  DUYET_MUA_THEM = "duyet_mua_them",
  HUY_MUA_THEM = "huy_mua_them",
  DANG_THEM_KHACH = "dang_them_khach",
  DA_CHOT = "da_chot",
}

export enum BookingNguonDatCho {
  CHU_TAU = "chu_tau",
  NHAN_VIEN_BAN_VE = "nhan_vien_ban_ve",
  API = "api",
}

export enum BookingNguonTinhGia {
  NONE = "none",
  HANH_KHACH = "hanh_khach",
  EXCEL = "excel",
  NHAP_NHANH = "nhap_nhanh",
  MUA_THEM_VE = "mua_them_ve",
  MUA_THEM_THU_CONG = "mua_them_thu_cong",
  MUA_THEM_EXCEL = "mua_them_excel",
  LINK = "link",
}

export const BOOKING_TRANG_THAI_GROUPS = {
  NHAP: [BookingTrangThai.BAN_NHAP],
  CHO_DUYET: [
    BookingTrangThai.DA_GUI,
    BookingTrangThai.GUI_LAI,
    BookingTrangThai.CHUA_DUYET,
  ],
  DA_DUYET: [BookingTrangThai.DA_DUYET, BookingTrangThai.DA_CHOT],
  TU_CHOI: [BookingTrangThai.BI_TU_CHOI],
  THANH_TOAN_IN: [
    BookingTrangThai.DA_THANH_TOAN,
    BookingTrangThai.DANG_IN,
    BookingTrangThai.DA_IN,
    BookingTrangThai.IN_LOI,
  ],
  HOAN_TAT_HUY: [
    BookingTrangThai.HOAN_THANH,
    BookingTrangThai.DA_HUY,
    BookingTrangThai.DA_XOA,
  ],
  MUA_THEM: [
    BookingTrangThai.MUA_THEM,
    BookingTrangThai.DANG_THEM_KHACH,
    BookingTrangThai.DUYET_MUA_THEM,
    BookingTrangThai.TU_CHOI_MUA_THEM,
    BookingTrangThai.GUI_LAI_MUA_THEM,
    BookingTrangThai.HUY_MUA_THEM,
  ],
} as const;
