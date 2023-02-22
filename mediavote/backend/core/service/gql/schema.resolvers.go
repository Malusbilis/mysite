package gql

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.21 DO NOT EDIT.

import (
	"context"

	"github.com/nanozuki/crows.moe/mediavote/backend/core/entity"
	"github.com/nanozuki/crows.moe/mediavote/backend/core/port"
	"github.com/nanozuki/crows.moe/mediavote/backend/graph"
	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/ierr"
)

// PostNominations is the resolver for the postNominations field.
func (r *mutationResolver) PostNominations(ctx context.Context, department entity.Department, works []string) ([]*entity.Nomination, error) {
	voterID := entity.CtxUserFromContext(ctx).VoterID
	var nomis []*entity.Nomination
	for _, work := range works {
		nomi, err := entity.NewNomination(voterID, department, work)
		if err != nil {
			return nil, err
		}

		nomis = append(nomis, nomi)
	}
	err := r.Repository.WithTx(ctx, func(ctx context.Context) error {
		for _, nomi := range nomis {
			err := r.Repository.Nomination().Create(ctx, nomi)
			if err != nil && !ierr.IsErrCode(err, ierr.CodeDuplicatedObject) {
				return err
			}
		}
		return nil
	})
	return nomis, err
}

// DeleteNomination is the resolver for the deleteNomination field.
func (r *mutationResolver) DeleteNomination(ctx context.Context, id uint) (*bool, error) {
	voterID := entity.CtxUserFromContext(ctx).VoterID
	nomi, err := r.Repository.Nomination().GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if nomi.VoterID != voterID {
		return nil, ierr.Forbidden(ierr.NotYourData)
	}
	err = r.Repository.Nomination().Delete(ctx, id)
	return toPtr(err == nil), err
}

// NewWork is the resolver for the newWork field.
func (r *mutationResolver) NewWork(ctx context.Context, input entity.WorkInput) (*entity.Work, error) {
	work, err := entity.NewWork(input)
	if err != nil {
		return nil, err
	}
	if err := r.Repository.Work().Create(ctx, work); err != nil {
		return nil, err
	}
	return work, nil
}

// WorkAddAlias is the resolver for the workAddAlias field.
func (r *mutationResolver) WorkAddAlias(ctx context.Context, id uint, alias []string) (*entity.Work, error) {
	work, err := r.Repository.Work().GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	work.AddAlias(alias)
	err = r.Repository.WithTx(ctx, func(ctx context.Context) error {
		if err := r.Repository.Work().UpdateOne(ctx, id, &port.WorkUpdate{Alias: work.Alias}); err != nil {
			return err
		}
		query := &port.NominationQuery{Department: work.Department, WorkNames: alias}
		update := &port.NominationUpdate{WorkID: id}
		if err := r.Repository.Nomination().UpdateMany(ctx, query, update); err != nil {
			return err
		}
		return nil
	})
	return work, nil
}

// PostBallot is the resolver for the postBallot field.
func (r *mutationResolver) PostBallot(ctx context.Context, input entity.BallotInput) (*entity.Ballot, error) {
	voterID := entity.CtxUserFromContext(ctx).VoterID
	ballots, err := r.Repository.Ballot().Search(ctx, &port.BallotQuery{
		VoterID:    voterID,
		Department: input.Department,
	})
	if err != nil {
		return nil, err
	}

	// not found new Ballot
	if len(ballots) == 0 {
		ballot, err := entity.NewBallot(voterID, input)
		if err != nil {
			return nil, err
		}
		if err := r.Repository.Ballot().Create(ctx, ballot); err != nil {
			return nil, err
		}
		return ballot, nil
	}

	// found, update Ballot
	ballot := ballots[0]
	ballot.SetCandidates(input.Candidates)
	if err := r.Repository.Ballot().UpdateOne(ctx, ballot.ID, &port.BallotUpdate{Candidates: ballot.Candidates}); err != nil {
		return nil, err
	}
	return ballots[0], nil
}

// Work is the resolver for the work field.
func (r *nominationResolver) Work(ctx context.Context, obj *entity.Nomination) (*entity.Work, error) {
	if obj.WorkID == nil {
		return nil, nil
	}
	return r.Repository.Work().GetByID(ctx, unwrapPtr(obj.WorkID))
}

// Voter is the resolver for the voter field.
func (r *queryResolver) Voter(ctx context.Context) (*entity.Voter, error) {
	voterID := entity.CtxUserFromContext(ctx).VoterID
	return r.Repository.Voter().GetByID(ctx, voterID)
}

// Nominations is the resolver for the nominations field.
func (r *queryResolver) Nominations(ctx context.Context, department *entity.Department) ([]*entity.Nomination, error) {
	return r.Repository.Nomination().Search(ctx, &port.NominationQuery{
		Department: unwrapPtr(department),
	})
}

// Works is the resolver for the works field.
func (r *queryResolver) Works(ctx context.Context, department *entity.Department) ([]*entity.Work, error) {
	return r.Repository.Work().Search(ctx, &port.WorkQuery{Department: unwrapPtr(department)})
}

// Ranking is the resolver for the ranking field.
func (r *queryResolver) Ranking(ctx context.Context, department entity.Department) (*entity.Ranking, error) {
	rankings, err := r.Repository.Ranking().Search(ctx, &port.RankingQuery{Department: department})
	if err != nil {
		return nil, err
	}
	if len(rankings) == 0 {
		return nil, nil
	}
	return rankings[0], nil
}

// Rankings is the resolver for the rankings field.
func (r *queryResolver) Rankings(ctx context.Context) ([]*entity.Ranking, error) {
	return r.Repository.Ranking().Search(ctx, &port.RankingQuery{})
}

// Ballot is the resolver for the ballot field.
func (r *voterResolver) Ballot(ctx context.Context, obj *entity.Voter, department entity.Department) (*entity.Ballot, error) {
	voterID := entity.CtxUserFromContext(ctx).VoterID
	ballots, err := r.Repository.Ballot().Search(ctx, &port.BallotQuery{
		VoterID:    voterID,
		Department: department,
	})
	if err != nil {
		return nil, err
	}
	if len(ballots) == 0 {
		return nil, nil
	}
	return ballots[0], nil
}

// Nominations is the resolver for the nominations field.
func (r *voterResolver) Nominations(ctx context.Context, obj *entity.Voter, department entity.Department) ([]*entity.Nomination, error) {
	return r.Repository.Nomination().Search(ctx, &port.NominationQuery{
		VoterID:    obj.ID,
		Department: department,
	})
}

// Work is the resolver for the Work field.
func (r *workRankingResolver) Work(ctx context.Context, obj *entity.WorkRanking) (*entity.Work, error) {
	return r.Repository.Work().GetByID(ctx, obj.WorkID)
}

// Mutation returns graph.MutationResolver implementation.
func (r *Resolver) Mutation() graph.MutationResolver { return &mutationResolver{r} }

// Nomination returns graph.NominationResolver implementation.
func (r *Resolver) Nomination() graph.NominationResolver { return &nominationResolver{r} }

// Query returns graph.QueryResolver implementation.
func (r *Resolver) Query() graph.QueryResolver { return &queryResolver{r} }

// Voter returns graph.VoterResolver implementation.
func (r *Resolver) Voter() graph.VoterResolver { return &voterResolver{r} }

// WorkRanking returns graph.WorkRankingResolver implementation.
func (r *Resolver) WorkRanking() graph.WorkRankingResolver { return &workRankingResolver{r} }

type mutationResolver struct{ *Resolver }
type nominationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type voterResolver struct{ *Resolver }
type workRankingResolver struct{ *Resolver }
