const cloud = require('wx-server-sdk');
cloud.init({env:cloud.DYNAMIC_CURRENT_ENV});
exports.main = async () => {
  if (!cloud.getWXContext().OPENID) throw new Error('UNAUTHENTICATED');
  return {ok:true, service:'random-app', version:'0.11.0'};
};
