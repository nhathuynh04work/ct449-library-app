export const TrangThaiBanSao = {
	AVAILABLE: "AVAILABLE",
	BORROWED: "BORROWED",
	LOST: "LOST",
	DAMAGED: "DAMAGED",
} as const;

export type TrangThaiBanSaoType =
	(typeof TrangThaiBanSao)[keyof typeof TrangThaiBanSao];
