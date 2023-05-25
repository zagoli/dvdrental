import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import { schema } from './schema.js';
import { resolvers } from './resolvers.js'

const app = express();
const httpServer = http.createServer(app);
const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await apolloServer.start();

app.use(
    '/graphql',
    express.json(),
    expressMiddleware(apolloServer),
);

httpServer.listen({ port: 4000 });
console.log(`Server ready at http://localhost:4000/graphql`);