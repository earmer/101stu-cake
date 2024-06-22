import './magic';
import './env';
import * as OTPAuth from 'otpauth';

export type UserInfo = {
    userID: number;
    username: string;
    email: string;
    bio: string;
    avatar: string;
    cover: string;
    createdAt: string;
    status: string;
    statusTill: string;
}

async function getUserInfo(userID: number): Promise<UserInfo> {
    const result = await UserDB.prepare('SELECT * FROM UserInfo WHERE UserId = ?').bind(userID.toString()).first();
    if (result === undefined || result === null) {
        throw new Error('User not found');
    }
    const user: UserInfo = {
        userID: result.UserId as number,
        username: result.Username as string,
        email: result.Email as string,
        bio: result.Bio as string,
        avatar: result.Avatar as string,
        cover: result.Cover as string,
        createdAt: result.CreatedAt as string,
        status: result.StatusCode as string,
        statusTill: result.StatusTill as string
    };
    return user;
}

// 验证邮箱格式
async function validateEmail(email: string): Promise<boolean> {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return false;
    if (email.length > 254)
        return false;
    if (topNames.indexOf(email.split('.')[-1]) === -1)
        return false;
    const base64Mail = btoa(simplifyEmail(email));
    const { results } = await UserDB.prepare('SELECT * FROM UserInfo WHERE Email = ?').bind(base64Mail).all();
    // 如果邮箱已经存在
    if (results.length > 0)
        return false;
    return true;
}

// 去除邮箱中的特殊字符
function simplifyEmail(email: string): string {
    return email.toLowerCase().trim().replace(/[\W_]+/g, '');
}

async function validateUsername(username: string): Promise<boolean> {
    if (username.length < 3 || username.length > 64)
        return false;
    // 中文或英文或数字或下划线或减号
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5-]+$/.test(username))
        return false;
    const { results } = await UserDB.prepare('SELECT * FROM UserInfo WHERE Username = ?').bind(username).all();
    if (results.length > 0)
        return false;
    return true;
}

function validatePassword(password: string): boolean {
    if (password.length < 8 || password.length > 64)
        return false;
    // 至少满足要求中的一个：1.包含一个大写字母、一个小写字母和一个数字；2.任意字母、一个数字和一个特殊字符；3.长度大于等于16位
    if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password) &&
        !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/.test(password) &&
        password.length < 16
    )
        return false;
    // 不包含空格和其他字符（中文、Emoji等）
    if (!/^[^\s]+$/.test(password))
        return false;
    return true;
}

async function secondAuthType(userID: number): Promise<string> {
    const { results }: { results: any[] } = await UserDB.prepare('SELECT SecondAuthType FROM UserInfo WHERE UserID = ?').bind(userID).all();
    return results[0].Strategy.toString();
}

function generateOtpSecret(userId: number): OTPAuth.TOTP {
    return new OTPAuth.TOTP({
        // Provider or service the account is associated with.
        issuer: "101Stu",
        // Account identifier.
        label: "101Stu:" + userId.toString(),
        // Algorithm used for the HMAC function.
        algorithm: "SHA1",
        // Length of the generated tokens.
        digits: 6,
        // Interval of time for which a token is valid, in seconds.
        period: 30,
        // Arbitrary key encoded in Base32 or OTPAuth.Secret instance.
        secret: new OTPAuth.Secret({ size: 20 }),
      });
}

function generateOtpCode(OTP: OTPAuth.TOTP): string {
    return OTP.generate();
}

function otpToUri(OTP: OTPAuth.TOTP): string {
    return OTP.toString();
}