import express from 'express'
import graphqHTTP from 'express-graphql'
import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'

import { db } from './database'

const app = express()

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query',
  fields: {
    viewer: {
      type: GraphQLString,
      resolve() {
        return 'viewer hey'
      },
    },
    node: {
      type: GraphQLString,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(source, args) {
        return inMemoryStore[args.id]
      },
    },
  },
})

let inMemoryStore = {}
const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  description: 'The root mutation',
  fields: {
    setNode: {
      type: GraphQLString,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        value: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(source, args) {
        console.log(args.id)
        inMemoryStore[args.id] = args.value
        return inMemoryStore[args.id]
      },
    },
  },
})

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
})

app.use('/graphql', graphqHTTP({ schema: Schema, graphiql: true }))

app.listen(3000, () => {
  console.log({ running: true })
})
