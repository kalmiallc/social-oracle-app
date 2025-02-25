const Endpoints = {
  /** User */
  me: '/users/me',
  walletMessage: '/users/wallet-message',
  walletLogin: '/users/wallet-login',
  githubLink: '/users/github-link',

  // NOT USED
  changeMail: '/users/change-email',
  changeMailRequest: '/users/change-email-request',
  notification: '/notification',

  /** Prediction Sets */
  predictionSets: '/prediction-sets',
  predictionSetsById: (id: number) => `/prediction-sets/${id}`,
};

export default Endpoints;
