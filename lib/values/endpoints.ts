const Endpoints = {
  /** User */
  me: '/users/me',
  walletMessage: '/users/wallet-message',
  walletLogin: '/users/wallet-login',

  // NOT USED
  changeMail: '/users/change-email',
  changeMailRequest: '/users/change-email-request',
  notification: '/notification',

  /** Prediction Sets */
  predictionSets: '/prediction-sets',
  predictionSetsById: (id: number) => `/prediction-sets/${id}`,
};

export default Endpoints;
