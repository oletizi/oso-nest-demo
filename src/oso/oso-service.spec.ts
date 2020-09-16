import { getLogger } from 'log4js';
import { Map, Set } from 'immutable';
import { Oso } from 'oso';
import { OsoConfig } from './oso-config';
import { OsoService } from './oso-service';

jest.mock('oso');
getLogger().level = 'info';

describe(OsoService.name, () => {
  // Mocks for Oso
  let mockOso: Oso;

  // Mocks for OsoConfig
  class A {
  }

  class B {
  }

  let mockOsoConfig: OsoConfig;

  let mockClasses;
  const expectedClasses = [A, B];

  let mockConstants;
  const expectedConstants: Map<string, any> = Map({'a': 'a', 'b': 'b'});

  let mockFiles;
  const expectedFiles: Set<string> = Set(['a', 'b']);

  let service: OsoService;

  beforeEach(async () => {
    mockOso = new Oso();
    // make sure the constructor is actually mocked
    expect(Oso).toHaveBeenCalled();

    // wire up mock config
    mockClasses = jest.fn();
    mockClasses.mockReturnValue(expectedClasses);


    mockConstants = jest.fn();
    mockConstants.mockReturnValue(expectedConstants);

    mockFiles = jest.fn();
    mockFiles.mockReturnValue(expectedFiles);

    mockOsoConfig = {
      classes: mockClasses,
      constants: mockConstants,
      files: mockFiles
    };

    service = new OsoService(mockOsoConfig, mockOso);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize its Oso instance and set a Promise that resolves or rejects when initialization is complete', async () => {
    expect(mockOsoConfig.classes).toHaveBeenCalled();

    // check classes registration
    expect(mockOso.registerClass).toHaveBeenCalled();
    expectedClasses.map((cls) => expect(mockOso.registerClass).toHaveBeenCalledWith(cls));

    // check constants registration
    expect(mockOso.registerConstant).toHaveBeenCalledTimes(expectedConstants.size);
    Map<string, any>(expectedConstants).map((key, value) => expect(mockOso.registerConstant).toHaveBeenCalledWith(key, value));


    // check file loading
    expect(mockOso.loadFile).toHaveBeenCalledTimes(expectedFiles.size);
    expectedFiles.map(filename => expect(mockOso.loadFile).toHaveBeenCalledWith(filename));

    expect(service.initialized()).resolves;
  });

  it('should check for initialization errors and set Promise that rejects', async () => {
    const mockLoadFile = jest.spyOn(mockOso, 'loadFile');
    const expectedError = {msg: 'the message'};
    mockLoadFile.mockImplementation(() => new Promise<void>((resolve, reject) => reject(expectedError)));

    service = new OsoService(mockOsoConfig, mockOso);
    expectedFiles.map(filename => expect(mockOso.loadFile).toHaveBeenCalledWith(filename));
    await expect(service.initialized()).rejects.toEqual(expectedError);
    // TODO: Test the case where *some* files load properly and others fail.
  });

})
;
