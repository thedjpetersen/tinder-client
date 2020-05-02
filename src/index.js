import axios from 'axios';
import {
  generateToken,
  requestSMSCodes,
  exchangeSMSCodes
} from 'tinder-access-token-generator';

import createHTTPClient from './createHTTPClient';

/**
 * https://github.com/fbessez/Tinder
 * https://gist.github.com/rtt/10403467
*/

const GENDERS = Object.freeze({
  male: 0,
  female: 1,
});

const GENDER_SEARCH_OPTIONS = Object.freeze({
  male: 0,
  female: 1,
  both: -1,
});

async function createClientFromFacebookAccessToken(facebookAccessToken) {
  const loginResponse = await axios.post(
    'https://api.gotinder.com/v2/auth/login/facebook',
    {
      token: facebookAccessToken,
    },
  );
  return createHTTPClient(loginResponse.data.data.api_token);
}

async function createClientFromFacebookLogin({ emailAddress, password }) {
  const {
    apiToken,
  } = await generateToken({
    facebookEmailAddress: emailAddress,
    facebookPassword: password,
  });

  return createHTTPClient(apiToken);
}

async function createSMSRequest({ phoneNumber }) {
  const { loginRequestCode } = await requestCodes({ phoneNumber });

  return loginRequestCode;
}

async function createClientFromSMS({ phoneNumber, loginCode, smsCode }) {
  const { apiToken, refreshToken } = await exchangeCodes({
    phoneNumber,
    loginCode,
    smsCode,
  });

  return createHTTPClient(apiToken);
}

async function createClientFromAccessToken({apiToken}) {
  return createHTTPClient(apiToken);
}

export {
  createClientFromFacebookAccessToken,
  createClientFromFacebookLogin,
  createSMSRequest,
  createClientFromSMS,
  createClientFromAccessToken,
  GENDERS,
  GENDER_SEARCH_OPTIONS,
};
