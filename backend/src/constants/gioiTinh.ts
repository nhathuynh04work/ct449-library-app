export const GioiTinh = {
	NAM: "Nam",
	NU: "Nữ",
	KHAC: "Khác",
} as const;

export type GioiTinhType = (typeof GioiTinh)[keyof typeof GioiTinh];
