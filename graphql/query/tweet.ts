import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(
    `#graphql
    query GetAllTweets {
      getAllTweets {
        id
        content
        imageURL
        author {
          firstName
          lastName
          profileImageURL
        }
      }
    }
  `
);

export const getSignedURLForTweetQuery = graphql(
  `#graphql
    query getSignedURL($imageName: String!, $imageType: String!) {
      getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
    }
  `
)
