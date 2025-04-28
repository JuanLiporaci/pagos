// utils/userSession.js
const sessions = new Map();

const getSession = (userId) => {
  if (!sessions.has(userId)) {
    sessions.set(userId, {});
  }
  return sessions.get(userId);
};

const sessionMiddleware = (ctx, next) => {
  const userId = ctx.from?.id;
  if (userId) {
    ctx.session = getSession(userId);
  }
  return next();
};

module.exports = {
  middleware: sessionMiddleware
};
