// 一些正则

// 用户名
export const usernameReg = /^[a-z0-9A-Z]{4,20}$/;
// 密码
export const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*_])[A-Za-z\d!@#$%^&*_]{6,20}$/;
