import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import {schema} from './schema.js';
import {resolvers} from './resolvers.js'
import {readFileSync} from 'fs'

export interface Context {
    customer_id?: number;
}

export const jwt_secret = readFileSync("./jwt_secret").toString();

const app = express();
const httpServer = http.createServer(app);
const apolloServer = new ApolloServer<Context>({
    typeDefs: schema,
    resolvers: resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
});
await apolloServer.start();

app.use(
    '/graphql',
    cors<cors.CorsRequest>({
        origin: 'http://localhost:4200',
    }),
    express.json(),
    expressMiddleware(apolloServer,
        {
            context: async ({req}) => {
                const token = req.headers.authorization;
                let customer_id: number | null = null;
                try {
                    const verified_token = jwt.verify(token, jwt_secret);
                    customer_id = verified_token.customer_id;
                } catch (e) {}
                return {
                    customer_id: customer_id
                }
            }
        }),
);

httpServer.listen({port: 4000});
console.log(`Server ready at http://localhost:4000/graphql`);