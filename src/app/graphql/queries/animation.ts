import { gql } from '@apollo/client';

export const ANIMATIONS_QUERY = gql`
  query GetAnimations($searchTerm: String!) {
    getAnimations(searchTerm: $searchTerm) {
      id
      author
      title
      source
    }
  }
`;

export const UPLOAD_ANIMATION_MUTATION = gql`
  mutation AddAnimations($addAnimationsData: AddAnimationDto!) {
    addAnimations(addAnimationsData: $addAnimationsData) {
      id
      title
      source
      author
    }
  }
`;
