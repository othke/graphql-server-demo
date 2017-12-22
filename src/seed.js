import * as data from './data'
import * as database from './database'
import * as tables from './tables'


const sequencePromise = function(promises) {
  return promises.reduce((promise, promiseFunction) => {
    return promise.then(() => {
      return promiseFunction()
    })
  }, Promise.resolve())
}

const createDatabase = () => {
  let promises = [tables.users, tables.usersFriends, tables.posts].map(
    table => {
      console.log(Object.keys(table.create))
      return () => database.getSql(table.create().toQuery())
    }
  )
  return sequencePromise(promises)
}

const insertData = () => {
  let { users, posts, usersFriends } = data
  let queries = [
    tables.users.insert(users).toQuery(),
    tables.posts.insert(posts).toQuery(),
    tables.usersFriends.insert(usersFriends).toQuery(),
  ]

  let promises = queries.map(query => {
    return () => database.getSql(query)
  })

  return sequencePromise(promises)
}

createDatabase()
  .then(() => {
    return insertData()
  })
  .then(() => {
    console.log({ done: true })
  })
