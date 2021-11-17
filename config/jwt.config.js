const { app } = require("../app");
const jwt = require("jsonwebtoken");
const secret = "b4bdc890-fb20-4248-9f8d-e6c9638b80ff";
const UserQueries = require('../queries/user.queries')


const createJwtToken = ({ user = null, id = null }) => {
  const jwtToken = jwt.sign(
    {
      sub: id || user._id.toString(),
      exp: Math.floor(Date.now() / 1000) + 3600 * 24,
    },
    secret
  );
  return jwtToken;
};
const checkExpirationToken = (token, res) => {
  const tokenExp = token.exp;
  const nowInSec = Math.floor(Date.now() / 1000);
  if (nowInSec <= tokenExp) {
    return token
  } else if (nowInSec > tokenExp && ((nowInSec - tokenExp) < 60 * 60 * 24) ) {
    const refreshedToken = createJwtToken({ id: token.sub });
    res.cookie('jwt', refreshedToken);
    return jwt.verify(refreshedToken, secret)
  } else {
    throw new Error('token expired');
  }
}

 const extractUserFromToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      let decodedToken = jwt.verify(token, secret, { ignoreExpiration: true });
      decodedToken = checkExpirationToken(decodedToken, res);
      const user = await UserQueries.findUserPerId(decodedToken.sub);
      if (user) {
        req.user = user;
        next();
      } else {
        res.clearCookie('jwt');
        res.json({
          status: 403,
          response: 'forbidden'
        });
      }
    } catch(e) {
      res.clearCookie('jwt');
      res.json({
        status: 403,
        response: 'forbidden'
      });
    }
  } else {
    next();
  }
}
const addJwtFeature = (req, res, next) => {
  req.isAuthenticated = () => !!req.user;
  req.logout = () => res.clearCookie("jwt");
  req.login = (user) => {
    const token = createJwtToken({ user });
    res.cookie("jwt", token);
  };
  next();
};
app.use(extractUserFromToken);
app.use(addJwtFeature);