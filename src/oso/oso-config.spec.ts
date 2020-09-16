import { OsoConfig } from './oso-config';

describe(OsoConfig.name, () =>{
  it('Should be defined', () => {
    expect(OsoConfig).toBeDefined();
  });

  it('Should return a valid OsoConfig', () => {
    const config = new OsoConfig();
    expect(config).toBeDefined();

    expect(config.classes).toBeDefined();
    expect(config.classes().size).toBeGreaterThan(0);

    expect(config.files).toBeDefined();
    expect(config.files().size).toEqual(2);

    expect(config.constants).toBeDefined();
    expect(config.constants().get('console')).toBeDefined();
  });
});