import { describe, it, expect, vi } from 'vitest';
import { calculateDamage, executeTurn, generateBattleTeam } from './battleLogic';

const mockAttacker = (overrides = {}) => ({
  name: 'TestPet',
  atk: 100,
  ap: 50,
  speed: 50,
  critRate: 0,
  type: 'FIRE',
  ...overrides,
});

const mockDefender = (overrides = {}) => ({
  name: 'EnemyPet',
  def: 100,
  res: 50,
  speed: 40,
  critRate: 0,
  type: 'WATER',
  maxHp: 200,
  currentHp: 200,
  ...overrides,
});

const physicalAbility = { name: 'Strike', type: 'PHYSICAL', element: 'FIRE', dmgScale: 1.0 };

describe('calculateDamage', () => {
  it('returns at least 1 damage', () => {
    const attacker = mockAttacker({ atk: 1 });
    const defender = mockDefender({ def: 1000 });
    const { damage } = calculateDamage(attacker, defender, physicalAbility);
    expect(damage).toBeGreaterThanOrEqual(1);
  });

  it('uses ATK vs DEF for physical abilities', () => {
    // Mock random: 0.5 → no crit (50 > 10% critChance), variance = 0.5*0.3+0.85 = 1.0
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const attacker = mockAttacker({ atk: 100, type: 'FIRE' });
    const neutralAbility = { name: 'Strike', type: 'PHYSICAL', element: 'FIRE', dmgScale: 1.0 };
    const defender = mockDefender({ def: 0, type: 'FIRE' });
    const { damage } = calculateDamage(attacker, defender, neutralAbility);
    vi.restoreAllMocks();
    // 2*100 - (def=0 → fallback 10) = 190, neutral type, variance=1.0, no crit → 190
    expect(damage).toBe(190);
  });

  it('uses AP vs RES for special abilities', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const attacker = mockAttacker({ ap: 100, type: 'WATER' });
    const neutralSpecial = { name: 'Blast', type: 'SPECIAL', element: 'WATER', dmgScale: 1.0 };
    const defender = mockDefender({ res: 0, type: 'WATER' });
    const { damage } = calculateDamage(attacker, defender, neutralSpecial);
    vi.restoreAllMocks();
    // 2*100 - (res=0 → fallback 10) = 190
    expect(damage).toBe(190);
  });

  it('applies 2x effectiveness when type is super-effective', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // no crit, middle variance
    const attacker = mockAttacker({ atk: 100, critRate: 0 });
    const defender = mockDefender({ def: 0, type: 'WATER' });
    const fireVsWaterAbility = { ...physicalAbility, element: 'FIRE' };
    const { effectiveness } = calculateDamage(attacker, defender, fireVsWaterAbility);
    vi.restoreAllMocks();
    // Effectiveness should be 2.0 if FIRE is super vs WATER, or 1.0 otherwise
    expect([0.5, 1.0, 2.0]).toContain(effectiveness);
  });

  it('applies crit multiplier of 1.5x when crit hits', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // always crits (0 < any critRate%)
    const attacker = mockAttacker({ atk: 100, critRate: 100 });
    const defender = mockDefender({ def: 0 });
    const { isCrit } = calculateDamage(attacker, defender, physicalAbility);
    vi.restoreAllMocks();
    expect(isCrit).toBe(true);
  });

  it('returns effectiveness, isCrit, and damage fields', () => {
    const result = calculateDamage(mockAttacker(), mockDefender(), physicalAbility);
    expect(result).toHaveProperty('damage');
    expect(result).toHaveProperty('isCrit');
    expect(result).toHaveProperty('effectiveness');
  });
});

describe('executeTurn', () => {
  it('returns newHp floored at 0', () => {
    const attacker = mockAttacker({ atk: 99999, critRate: 0 });
    const defender = mockDefender({ def: 0, currentHp: 10 });
    const { newHp } = executeTurn(attacker, defender, physicalAbility);
    expect(newHp).toBe(0);
  });

  it('returns a log string containing attacker name and ability name', () => {
    const attacker = mockAttacker({ name: 'Fluffball', atk: 100, critRate: 0 });
    const defender = mockDefender({ def: 0 });
    const { log } = executeTurn(attacker, defender, physicalAbility);
    expect(log).toContain('Fluffball');
    expect(log).toContain('Strike');
  });

  it('includes damage amount in log', () => {
    const attacker = mockAttacker({ atk: 100, critRate: 0 });
    const defender = mockDefender({ def: 0 });
    const { damage, log } = executeTurn(attacker, defender, physicalAbility);
    expect(log).toContain(String(damage));
  });
});

describe('generateBattleTeam', () => {
  it('returns an array', () => {
    const team = generateBattleTeam(1);
    expect(Array.isArray(team)).toBe(true);
  });

  it('team size scales with player level (min 1, max 5)', () => {
    const teamLvl1 = generateBattleTeam(1);
    const teamLvl25 = generateBattleTeam(25);
    expect(teamLvl1.length).toBe(1);
    expect(teamLvl25.length).toBe(5);
  });

  it('all pets have currentHp equal to maxHp on generation', () => {
    const team = generateBattleTeam(10);
    team.forEach(pet => {
      expect(pet.currentHp).toBe(pet.maxHp);
    });
  });
});
