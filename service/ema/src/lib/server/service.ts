import { newRankedWorks } from '$lib/domain/entity';
import type { Ceremony, Work, RankedWork, Voter } from '$lib/domain/entity';
import type { Department } from '$lib/domain/value';
import type { CeremonyRepository, VoterRepository, WorkRepository } from '$lib/server/adapter';
import { SignJWT, jwtVerify } from 'jose';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';
import { z } from 'zod';

const tokenOptions = {
  name: 'token',
  issuer: 'https://crows.moe',
  audience: 'https://ema.crows.moe',
  expireTime: 1000 * 60 * 60 * 24 * 30, // 30 days
};

const jwtPayloadSchema = z.object({
  id: z.number().gt(0),
  name: z.string().min(1),
  hasPassword: z.boolean(),
});

export class Service {
  constructor(
    private ceremonyRepository: CeremonyRepository,
    private workRepository: WorkRepository,
    private voterRepository: VoterRepository,
  ) {}

  async getCeremonies(): Promise<Ceremony[]> {
    return await this.ceremonyRepository.getCeremonies();
  }

  async getBestWorks(): Promise<Map<number, Work[]>> {
    return await this.workRepository.getAllWinners();
  }

  async getWinningWorks(year: number): Promise<Map<Department, RankedWork[]>> {
    const winnings = await this.workRepository.getAwardsByYear(year);
    const rankedWinnings = new Map<Department, RankedWork[]>();
    for (const [department, works] of winnings.entries()) {
      rankedWinnings.set(department, newRankedWorks(works));
    }
    return rankedWinnings;
  }

  async getUserByName(username: string): Promise<Voter | undefined> {
    return await this.voterRepository.getVoterByName(username);
  }

  async newCookie(cookies: Cookies, from: Date, voter: Voter): Promise<void> {
    const jwtSecret = new TextEncoder().encode(env.EMA_JWT_SECRET);
    const expires = new Date(from.getTime() + tokenOptions.expireTime);
    const jwt = await new SignJWT({ voter })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(tokenOptions.issuer)
      .setAudience(tokenOptions.audience)
      .setExpirationTime(expires)
      .sign(jwtSecret);
    cookies.set(tokenOptions.name, jwt, {
      path: '/',
      expires,
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  }

  async verifyToken(cookies: Cookies): Promise<Voter | undefined> {
    const jwtSecret = new TextEncoder().encode(env.EMA_JWT_SECRET);
    const token = cookies.get(tokenOptions.name);
    if (!token) {
      return undefined;
    }
    try {
      const { payload } = await jwtVerify(token, jwtSecret, {
        issuer: tokenOptions.issuer,
        audience: tokenOptions.audience,
        requiredClaims: ['iss', 'aud', 'exp', 'iat', 'voter'],
      });
      const validate = jwtPayloadSchema.safeParse(payload);
      if (!validate.success) {
        return undefined;
      }
      return payload.voter as Voter;
    } catch (e) {
      return undefined;
    }
  }

  async logInVoter(name: string, password: string, cookies: Cookies): Promise<Voter | undefined> {
    const voter = await this.voterRepository.verifyPassword(name, password);
    if (!voter) {
      return undefined;
    }
    await this.newCookie(cookies, new Date(), voter);
    return voter;
  }

  async setPassword(name: string, password: string, cookies: Cookies): Promise<Voter> {
    const voter = await this.voterRepository.setPassword(name, password);
    await this.newCookie(cookies, new Date(), voter);
    return voter;
  }

  async signUpVoter(name: string, password: string, cookies: Cookies): Promise<Voter> {
    const voter = await this.voterRepository.createVoter(name, password);
    await this.newCookie(cookies, new Date(), voter);
    return voter;
  }
}
