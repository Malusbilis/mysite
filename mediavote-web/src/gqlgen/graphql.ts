/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AnnualInfo = {
  __typename?: 'AnnualInfo';
  Stage: Stage;
  Year: Scalars['Int'];
};

export type Ballot = {
  __typename?: 'Ballot';
  candidates: Array<WorkRanking>;
  department: Department;
  id: Scalars['ID'];
  voterID: Scalars['ID'];
};

export type BallotInput = {
  candidates: Array<WorkRankingInput>;
  department: Department;
};

export enum Department {
  Game = 'Game',
  Manga = 'Manga',
  NonTvAnime = 'NonTVAnime',
  Novel = 'Novel',
  TvAnime = 'TVAnime'
}

export type Mutation = {
  __typename?: 'Mutation';
  postBallot?: Maybe<Ballot>;
  postNomination?: Maybe<Array<Nomination>>;
};


export type MutationPostBallotArgs = {
  input: BallotInput;
};


export type MutationPostNominationArgs = {
  department: Department;
  workName: Scalars['String'];
};

export type Nomination = {
  __typename?: 'Nomination';
  department: Department;
  id: Scalars['ID'];
  work?: Maybe<Work>;
  workID?: Maybe<Scalars['ID']>;
  workName: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  awards?: Maybe<Array<Ranking>>;
  ballot?: Maybe<Array<Ballot>>;
  nominations?: Maybe<Array<Nomination>>;
  ranking?: Maybe<Ranking>;
  thisYear: AnnualInfo;
  voter?: Maybe<Voter>;
  years?: Maybe<Array<AnnualInfo>>;
};


export type QueryAwardsArgs = {
  year: Scalars['Int'];
};


export type QueryBallotArgs = {
  year: Scalars['Int'];
};


export type QueryNominationsArgs = {
  department: Department;
};


export type QueryRankingArgs = {
  department: Department;
};

export type Ranking = {
  __typename?: 'Ranking';
  department: Department;
  rankings?: Maybe<Array<WorkRanking>>;
};

export enum Stage {
  Awards = 'Awards',
  Nominations = 'Nominations',
  NotYet = 'NotYet',
  Vote = 'Vote'
}

export type Voter = {
  __typename?: 'Voter';
  ballot?: Maybe<Ballot>;
  id: Scalars['ID'];
  name: Scalars['String'];
  nominations?: Maybe<Array<Nomination>>;
};


export type VoterBallotArgs = {
  department: Department;
};


export type VoterNominationsArgs = {
  department: Department;
};

export type Work = {
  __typename?: 'Work';
  department: Department;
  id: Scalars['ID'];
  nameCN: Scalars['String'];
  nameOrigin: Scalars['String'];
};

export type WorkRanking = {
  __typename?: 'WorkRanking';
  Ranking: Scalars['Int'];
  Work: Work;
};

export type WorkRankingInput = {
  Ranking: Scalars['Int'];
  WorkID: Scalars['ID'];
};

export type GetNominationsQueryVariables = Exact<{
  dept: Department;
}>;


export type GetNominationsQuery = { __typename?: 'Query', nominations?: Array<{ __typename?: 'Nomination', id: string, workName: string, work?: { __typename?: 'Work', nameCN: string, nameOrigin: string } | null }> | null };

export type AddNominationMutationVariables = Exact<{
  dept: Department;
  workName: Scalars['String'];
}>;


export type AddNominationMutation = { __typename?: 'Mutation', postNomination?: Array<{ __typename?: 'Nomination', id: string, workName: string, work?: { __typename?: 'Work', nameCN: string, nameOrigin: string } | null }> | null };


export const GetNominationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNominations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dept"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Department"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nominations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"department"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dept"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workName"}},{"kind":"Field","name":{"kind":"Name","value":"work"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nameCN"}},{"kind":"Field","name":{"kind":"Name","value":"nameOrigin"}}]}}]}}]}}]} as unknown as DocumentNode<GetNominationsQuery, GetNominationsQueryVariables>;
export const AddNominationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddNomination"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dept"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Department"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postNomination"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"department"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dept"}}},{"kind":"Argument","name":{"kind":"Name","value":"workName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workName"}},{"kind":"Field","name":{"kind":"Name","value":"work"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nameCN"}},{"kind":"Field","name":{"kind":"Name","value":"nameOrigin"}}]}}]}}]}}]} as unknown as DocumentNode<AddNominationMutation, AddNominationMutationVariables>;