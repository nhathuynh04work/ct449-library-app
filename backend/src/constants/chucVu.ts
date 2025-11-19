export const ChucVu = {
	LIBRARIAN: "LIBRARIAN",
	ADMIN: "ADMIN",
} as const;

export type ChucVuType = (typeof ChucVu)[keyof typeof ChucVu];
