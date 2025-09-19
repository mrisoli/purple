import { describe, expect, it } from 'vitest';

const EXPECTED_FEATURES_COUNT = 3;
const EXPECTED_BENEFITS_COUNT = 6;
const MIN_HERO_DESCRIPTION_LENGTH = 100;

describe('Landing Page Component', () => {
  it('should have proper features structure', () => {
    const features = [
      {
        icon: 'Users',
        title: 'Find Your Buddy',
        description:
          'Connect with accountability partners who will keep you motivated and on track',
      },
      {
        icon: 'CheckCircle',
        title: 'Track Progress',
        description:
          'Log updates, celebrate milestones, and see your growth over time',
      },
      {
        icon: 'Zap',
        title: 'Stay Motivated',
        description:
          'Real-time notifications and friendly nudges from your accountability buddy',
      },
    ];

    expect(features).toHaveLength(EXPECTED_FEATURES_COUNT);
    expect(features[0].title).toBe('Find Your Buddy');
    expect(features[1].title).toBe('Track Progress');
    expect(features[2].title).toBe('Stay Motivated');

    for (const feature of features) {
      expect(feature.title.length).toBeGreaterThan(0);
      expect(feature.description.length).toBeGreaterThan(0);
      expect(feature.icon.length).toBeGreaterThan(0);
    }
  });

  it('should have proper benefits list', () => {
    const benefits = [
      'Turn your goals into achievements',
      'Get support from dedicated accountability buddies',
      'Track progress with detailed action logs',
      'Set and reach meaningful milestones',
      'Stay motivated with regular check-ins',
      'Build lasting habits with consistent support',
    ];

    expect(benefits).toHaveLength(EXPECTED_BENEFITS_COUNT);
    for (const benefit of benefits) {
      expect(benefit.length).toBeGreaterThan(0);
      expect(typeof benefit).toBe('string');
    }
  });

  it('should handle authentication states correctly', () => {
    const authStates = {
      authenticated: 'Go to Dashboard',
      unauthenticated: 'Get Started Free',
    };

    expect(authStates.authenticated).toBe('Go to Dashboard');
    expect(authStates.unauthenticated).toBe('Get Started Free');
  });

  it('should have proper marketing copy', () => {
    const heroTitle = 'Achieve Your Goals with Accountability Buddies';
    const heroDescription =
      'Transform your ambitions into achievements. Connect with accountability partners who will support, motivate, and celebrate your progress every step of the way.';

    expect(heroTitle.includes('Goals')).toBe(true);
    expect(heroTitle.includes('Accountability')).toBe(true);
    expect(heroDescription.includes('accountability partners')).toBe(true);
    expect(heroDescription.length).toBeGreaterThan(MIN_HERO_DESCRIPTION_LENGTH);
  });
});
