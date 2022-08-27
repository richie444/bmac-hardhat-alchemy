export const schema = gql`
  type User {
    id: String!
    address: String!
    authDetail: AuthDetail
    authDetailId: String
  }

  type AuthDetail {
    id: String!
    nonce: String!
    timestamp: DateTime!
    User: User
  }

  type Query {
    authDetails: [AuthDetail!]! @skipAuth
  }

  input CreateAuthDetailInput {
    nonce: String!
    timestamp: DateTime!
  }

  input UpdateAuthDetailInput {
    nonce: String
    timestamp: DateTime
  }
`
