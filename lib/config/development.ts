import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://d1fq8e8mhf6u5t.cloudfront.net/',
  apiUrl: 'https://tndzx1ktxc.execute-api.us-east-1.amazonaws.com/dev',
  COLLATERAL_TOKEN_CONTRACT: '0xd7C9BB2Cb510B7096D384AD1F59006A20Fb419f7',
  CONDITIONAL_TOKEN_CONTRACT: '0x97C72b91F953cC6142ebA598fa376B80fbACA1C2',
  FPMM_FACTORY_CONTRACT: '0xDE8cbAF426ea3c9BD218e201ADd8119e132D5f1a',
  ORACLE_CONTRACT: '0xDD2EBb698bfCcD711E3Cc352a9E3C17b484fB339',
  PRIVY_APP_ID: 'cm727ky1m033zu15ipe6wx6tx',
  PRIVY_CLIENT_ID: 'client-WY5gwvJUmtGc4ViPaVrsxTiMN73dYxdjL84FpfWJ6R4NK',
};

export default config;
