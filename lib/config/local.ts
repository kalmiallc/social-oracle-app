import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'http://localhost:3000',
  apiUrl: 'http://localhost:6060',
  COLLATERAL_TOKEN_CONTRACT: '0x82AF954d52Bb42F5075c392323D983415fe68672',
  CONDITIONAL_TOKEN_CONTRACT: '0x2346Cfa50e396BeFC2242763eD15Ca0aab1E9a79',
  FPMM_FACTORY_CONTRACT: '0x88436658f14A7cA6CE18C514A7af605Bb6329Bb7',
  ORACLE_CONTRACT: '0xb32F6fC41a6bfc5bCC826F62564C5bdEC8D56b71',
  PRIVY_APP_ID: 'cm727ky1m033zu15ipe6wx6tx',
  PRIVY_CLIENT_ID: 'client-WY5gwvJUmtGc4ViPaVrsxTiMN73dYxdjL84FpfWJ6R4NK',
};

export default config;
