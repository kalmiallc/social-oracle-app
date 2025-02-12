export {};

export enum NotificationType {
  UNKNOWN = 0,
}
declare global {
  interface PrivyWallet {
    type: 'wallet';
    address: string;
    chain_type: 'ethereum';
    verified_at: number;
    first_verified_at: number | null;
    latest_verified_at: number | null;
    wallet_client: 'unknown';
    chain_id?: string | undefined;
    wallet_client_type?: string | undefined;
    connector_type?: string | undefined;
  }

  /**
   * User
   */
  interface UserInterface {
    id: number;
    email: string;
    evmWallet: string | null;
    name: string;
    phone?: string | null;
    status: number;
    user_uuid: string;
    userPermissions: number[];
    userRoles: number[];
    wallet: string | null;
    token?: any;
    captchaJwt?: any;
  }

  interface UserResponse extends GeneralResponse<UserInterface> {}
  interface UserProfileResponse extends GeneralResponse<UserInterface> {}

  /**
   *  Register
   */
  interface RegisterInterface extends UserInterface {
    token: string;
    captchaJwt?: string;
  }
  interface ValidateMailInterface {
    data: {
      result: boolean;
    };
    status: number;
    success: boolean;
  }

  interface RegisterResponse extends GeneralResponse<RegisterInterface> {}
  interface ValidateMailResponse extends GeneralResponse<ValidateMailInterface> {}
  interface PasswordResetResponse extends GeneralResponse<boolean> {}

  /**
   * Login
   */
  interface LoginInterface extends UserInterface {
    token: string;
    captchaJwt?: string;
  }

  interface LoginResponse extends GeneralResponse<LoginInterface> {}
  interface PasswordResetRequestResponse extends GeneralResponse<boolean> {}

  /**
   * Wallet
   */
  interface WalletMsgInterface {
    message: string;
    timestamp: number;
  }
  interface WalletLoginInterface extends UserInterface {
    authToken: string;
  }
  interface WalletMsgResponse extends GeneralResponse<WalletMsgInterface> {}

  interface WalletLoginResponse extends GeneralResponse<WalletLoginInterface> {}

  interface WalletMessageResponse
    extends GeneralResponse<{
      message: string;
      timestamp: number;
    }> {}

  type AuthInterface = LoginInterface | UserInterface | WalletLoginInterface;

  /**
   * Notifications
   */
  interface NotificationInterface extends GeneralInterface {
    createTime: string;
    id: number;
    message: string;
    type: string;
    userId: number;
  }
  interface NotificationsResponse extends GeneralItemsResponse<NotificationInterface> {}
}
