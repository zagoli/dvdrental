import { readFileSync } from 'fs'

export const schema = readFileSync("./schema.graphql").toString();