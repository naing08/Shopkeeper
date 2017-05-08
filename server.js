/**
 * Created by ChitSwe on 12/19/16.
 */
import Express,{Router} from 'express';
import bodyParser from 'body-parser';
import './common/dateUtils';
import db from './server/models';
//import  './server/database/integration/index';
import { apolloExpress, graphiqlExpress } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
import Schema from './server/data/schema';
import Resolver from './server/data/resolver';
import {default as migration} from './server/database/migration';
import React from 'react';
import ReactDOM from 'react-dom/server';
import routes from './client/admin/routes';
import siteRoutes from './client/site/routes';
import createApolloClient from './common/createApolloClient';
import { createNetworkInterface } from 'apollo-client';
import { match, RouterContext } from 'react-router';
import 'isomorphic-fetch';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import injectTapEventPlugin from 'react-tap-event-plugin';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import latency from 'express-simulate-latency';
import {default as adminTheme} from './common/adminMuiTheme';
import {default as siteTheme} from './common/siteMuiTheme';
import createAdminStore from './client/admin/reducer/createAdminStore';
import createSiteStore from './client/site/reducer/createSiteStore';
import cookieParser from 'cookie-parser';
injectTapEventPlugin();
import {default as AdminHtml} from './server/adminHtml';
import {default as SiteHtml} from './server/siteHtml';
import   './server/security/auth';
import passport from 'passport';
import {loginHandler} from './server/security/login';
const app = new Express();
const appRouter = new Router();
const port = 3232;
const graphqlUrl=`http://localhost:${port}/graphql`;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(passport.initialize());
app.use(cookieParser());
app.use(latency({ min: 100, max: 500 }));
app.post('/login',loginHandler);
app.use('/graphql',passport.authenticate('bearer-custom',{session:false}), apolloExpress( (req) => {
    return {
        schema: makeExecutableSchema({
            typeDefs: Schema,
            resolvers:Resolver,
            allowUndefinedInResolve: true,
        }),
        context: { user:req.user }
    }
}));

// graphiql endpoint
app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
}));
appRouter.get('/employee',(req,res)=>{
    db.Employee.findAll().then(data=>{
        res.json(
            data
        );
    }).catch(error=>{
        console.log(error);
        res.status(500).send(error.toString());
    })
});
app.use(Express.static('public'));
app.use('/api',appRouter);
function renderHtml(req,res,renderProps,isAdminSite){
    
    const client = createApolloClient({
        ssrMode: true,
        networkInterface: createNetworkInterface({
            uri: graphqlUrl,
            opts: {
                credentials: 'same-origin',
                // transfer request headers to networkInterface so that they're
                // accessible to proxy server
                // Addresses this issue: https://github.com/matthew-andrews/isomorphic-fetch/issues/83
                headers: req.headers,
            },
        }),
    });
    let store = null;
    let muiTheme=null;
    let html = null;
    if(isAdminSite){//render admin site
        muiTheme = getMuiTheme(Object.assign({userAgent: req.headers['user-agent']},adminTheme));
        store = createAdminStore({client});
    }else{//render web site
        muiTheme = getMuiTheme(Object.assign({userAgent: req.headers['user-agent']},siteTheme));
        store = createSiteStore(({client}));
    }

    const component = (     
        <MuiThemeProvider muiTheme={muiTheme}>
            <ApolloProvider client={client} store={store}>
                <RouterContext {...renderProps} />
            </ApolloProvider>
        </MuiThemeProvider>
    );

    renderToStringWithData(component).then((content) => {
        const {apollo,...state}= client.store.getState();
        const data = apollo.data;
        res.status(200);

        const html = isAdminSite?
            (<AdminHtml
            content={content}
            state={Object.assign({ apollo: { data } },state)}
        />):
            (<SiteHtml
                content={content}
                state={Object.assign({ apollo: { data } },state)}
                muiTheme={siteTheme}
            />);
        res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
        res.end();
    }).catch(e => console.error('RENDERING ERROR:', e)); // eslint-disable-line no-console
}

app.get('/admin/Login',(req,res)=>{
    match({ routes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
        renderHtml(req,res,renderProps,true);
    });
});



app.use('/admin',passport.authenticate('cookie',{session:false,failureRedirect:'/admin/Login'}),(req, res) => {
    req.headers.authorization =  `Bearer ${req.cookies.access_token}`;
    match({ routes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
            res.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
            console.error('ADMIN ROUTER ERROR:', error); // eslint-disable-line no-console
            res.status(500);
        } else if (renderProps) {
            renderHtml(req,res,renderProps,true);
        } else {//admin routes not match
            res.status(404).send('Not found');
        }
    });
});

app.get('/Login',(req,res)=>{
    match({ routes:siteRoutes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
        renderHtml(req,res,renderProps,false);
    });
});

app.use(passport.authenticate('cookie',{session:false,failureRedirect:'/Login'}),(req, res) => {
    req.headers.authorization =  `Bearer ${req.cookies.access_token}`;
    match({routes:siteRoutes,location:req.originalUrl},(error,redirectLocation,renderProps)=>{
               if(redirectLocation)
                   res.redirect(redirectLocation.pathname + redirectLocation.search);
               else if(error) {
                   console.error('SITE ROUTER ERROR:', error);
                   res.status(500);
               }else if(renderProps){
                   renderHtml(req,res,renderProps,false);//render site
               }else{
                   res.status(404).send('Not found');
               }
            });
});
/*
const webpackConfig = {
    context: __dirname + "/client",
    entry: "./browser",
    output: {
        path: __dirname + "/public",
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loaders: ["babel-loader"]
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
        // new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify('production')
        //     }
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compressor: {
        //         warnings: false
        //     }
        // })
    ],
    devtool: 'source-map'
};
*/
if(app.settings.env !=='production') {
    console.log('Start webpack bundling');
    webpack(webpackConfig, function (err, stats) {
        if (err)
            console.log(err);
        else {
            console.log('Bundling finished.');
                migration.up().then((migrations) => {
                app.listen(port, () => {
                    console.log(`Server is running on port ${port}`);
                });
            });
        }
    });
}else{
    console.log('Production mod and skip bundling.');
    migration.up().then((migrations) => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    });
}


