import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import {schema} from './schema.js';
import {resolvers} from './resolvers.js'

export interface Context {
    customer_id?: number;
}

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
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer,
        {
            context: async ({req}) => ({customer_id: req.headers.customer_id})
        }),
);

httpServer.listen({port: 4000});
console.log(`Server ready at http://localhost:4000/graphql`);