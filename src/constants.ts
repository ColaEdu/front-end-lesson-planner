export const DEV = import.meta.env.MODE === "development";
export const HOST_PREFIX = DEV ? '129.226.81.213:3001' : 'api.cola.app';
export const API_PREFIX = DEV ? '129.226.81.213:4010' : 'api.cola.app';
