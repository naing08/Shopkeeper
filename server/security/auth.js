import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';
import db from '../models/index';
import CustomStrategy from 'passport-custom';
function findSession(token, done) {
    db.UserSession.findAll({where:{SessionKey:token}})
    .then(userSession=>{
      let s = userSession && userSession.length>0? userSession[0]:null;
      if(s){
        return s.getUserAccount()
        .then(userAccount=>{
          done(null,userAccount);
        }).catch(error=>{
          done(error);
        });
      }else
        done(null,false);
    });
  }
passport.use(new BearerStrategy(
  findSession
));


passport.use('bearer-custom',new CustomStrategy(
    (req,done)=>{
        let token = req.headers.authorization? req.headers.authorization.replace('Bearer ',''):'';
        token = token? token:req.cookies.access_token;
        AuthenticateWithToken(token).then(userAccount=>{
          if(userAccount){
            userAccount.isAuthenticated=true;
            done(null,userAccount);
            return userAccount;
          }else{
            return Promise.reject("Invalid access key");
          }
        }).catch(error=>{
          done(null,{
            isAuthenticated:false,
            error
          });
        });
        
    }
  ));

passport.use('cookie-custom',new CustomStrategy(
    (req,done)=>{
        let token = req.cookies.access_token;
        token = token? token:req.cookies.access_token;
        AuthenticateWithToken(token).then(userAccount=>{
          if(userAccount){
            userAccount.isAuthenticated=true;
            done(null,userAccount);
            return userAccount;
          }else{
            return Promise.reject("Invalid access key");
          }
        }).catch(error=>{
          done(null,{
            isAuthenticated:false,
            error
          });
        });
        
    }
  ));



passport.use('cookie',new CustomStrategy(
    (req,done)=>{
        findSession(req.cookies.access_token,done);
    }
  ));

function AuthenticateWithToken(token){
  let promise  = new Promise((complete,rej)=>{
    findSession(token,(error,userAccount)=>{
      if(error)
        rej(error);
      else
        complete(userAccount);
    });
  });
  return promise;
}

export default AuthenticateWithToken; 