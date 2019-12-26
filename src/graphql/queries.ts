// tslint:disable
// this is an auto generated file. This will be overwritten

export const getSynonyms = `query GetSynonyms($id: ID!, $session: Int!) {
  getSynonyms(id: $id, session: $session) {
    id
    base
    session
    type
    index
    A
    B
    C
    D
    E
    Answer
    Hint
  }
}
`;
export const listSynonyms = `query ListSynonyms(
  $filter: TableSynonymsFilterInput
  $limit: Int
  $nextToken: String
) {
  listSynonyms(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      base
      session
      type
      index
      A
      B
      C
      D
      E
      Answer
      Hint
    }
    nextToken
  }
}
`;
export const querySynonymsBySessionBaseType = `query QuerySynonymsBySessionBaseType(
  $session: Int!
  $first: Int
  $after: String
) {
  querySynonymsBySessionBaseType(
    session: $session
    first: $first
    after: $after
  ) {
    items {
      id
      base
      session
      type
      index
      A
      B
      C
      D
      E
      Answer
      Hint
    }
    nextToken
  }
}
`;
export const querySynonymsBySessionBaseIndex = `query QuerySynonymsBySessionBaseIndex(
  $session: Int!
  $first: Int
  $after: String
) {
  querySynonymsBySessionBaseIndex(
    session: $session
    first: $first
    after: $after
  ) {
    items {
      id
      base
      session
      type
      index
      A
      B
      C
      D
      E
      Answer
      Hint
    }
    nextToken
  }
}
`;
export const queryPracticeHistoriesByUsernameDate = `
query QueryPracticeHistoriesByUsernameDate(
  $username: String!
  $first: Int
  $after: String
) {
  queryPracticeHistoriesByUsernameDate(
    username: $username
    first: $first
    after: $after
  ) {
    items {
      id
      username
      result
      tryNum
      answer
      itemId
      sessionId
      partId
      index
      date
      time
    }
    nextToken
  }
}
`;
