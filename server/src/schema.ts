import {readFileSync} from 'fs'

export const schema = readFileSync("./schema.graphql").toString();
// Note: Node can find the schema file if the working directory is right (start node from the 'server' dir)