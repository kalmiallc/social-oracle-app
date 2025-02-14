import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: '',
  apiUrl: '',
  COLLATERAL_TOKEN_CONTRACT: '0xd7C9BB2Cb510B7096D384AD1F59006A20Fb419f7',
  CONDITIONAL_TOKEN_CONTRACT: '0x97C72b91F953cC6142ebA598fa376B80fbACA1C2',
  FPMM_FACTORY_CONTRACT: '0x82AF954d52Bb42F5075c392323D983415fe68672',
  ORACLE_CONTRACT: '0xeb0C621ee9fE6b68897da01cEDF2F2dcbB44e16C',
  PRIVY_APP_ID: '',
  PRIVY_CLIENT_ID: '',
};

export default config;
