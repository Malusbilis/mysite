import { YearUseCase } from "@service/use_case";
import { Year } from "@service/entity";
import { Department } from "@service/value";

export class Service {
  constructor(private readonly year: YearUseCase) {}

  async getYears(): Promise<Year[]> {
    return this.year.findAll();
  }

  async getYear(year: number): Promise<Year> {
    return this.year.find(year);
  }

  async getAwards(year: number, dept: Department): Promise<void> {
    //TODO implement me
    throw new Error("Method not implemented.");
  }
}

/*
package service

import (
	"context"

	"github.com/nanozuki/crows.moe/mediavote-api/api"
	"github.com/nanozuki/crows.moe/mediavote-api/internal/entity"
	"github.com/nanozuki/crows.moe/mediavote-api/internal/val"
)

type Service struct {
	year *entity.YearUseCase
}

func (s *Service) GetYears(ctx context.Context, req *api.GetYearsRequest) (*api.GetYearsResponse, error) {
	years, err := s.year.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	var res api.GetYearsResponse
	for _, y := range years {
		res.Years = append(res.Years, y.ToAPIView())
	}
	return &res, nil
}

func (s *Service) GetYear(ctx context.Context, req *api.GetYearRequest) (*api.GetYearResponse, error) {
	year, err := s.year.GetOne(ctx, req.Year)
	if err != nil {
		return nil, err
	}
	return (*api.GetYearResponse)(year.ToAPIView()), nil
}

func (s *Service) GetAwards(ctx context.Context, req *api.GetAwardsRequest) (*api.GetAwardsResponse, error) {
	year, err := s.year.GetYearInStage(ctx, req.Year, val.StageAward)
	if err != nil {
		returbn nil, err
	}
	if err := year.ValidateDept(req.Dept); err != nil {
		return nil, err
	}
	//TODO implement me
	panic("implement me")
}

func (s *Service) GetNominations(ctx context.Context, req *api.GetNominationsRequest) (*api.GetNominationsResponse, error) {
	//TODO implement me
	panic("implement me")
}

func (s *Service) PostNominations(ctx context.Context, req *api.PostNominationsRequest) (*api.PostNominationsResponse, error) {
	//TODO implement me
	panic("implement me")
}

func (s *Service) GetLoggedVoter(ctx context.Context, req *api.GetLoggedVoterRequest) (*api.GetLoggedVoterResponse, error) {
	//TODO implement me
	panic("implement me")
}

func (s *Service) SignUpVoter(ctx context.Context, req *api.SignUpVoterRequest) (*api.SignUpVoterResponse, error) {
	//TODO implement me
	panic("implement me")
}

func (s *Service) LogInVoter(ctx context.Context, req *api.LogInVoterRequest) (*api.LogInVoterResponse, error) {
	//TODO implement me
	panic("implement me")
}

func (s *Service) GetBallot(ctx context.Context, req *api.GetBallotRequest) (*api.GetBallotResponse, error) {
	//TODO implement me
	panic("implement me")
}

func (s *Service) PutBallot(ctx context.Context, req *api.PutBallotRequest) (*api.PutBallotResponse, error) {
	//TODO implement me
	panic("implement me")
}
*/