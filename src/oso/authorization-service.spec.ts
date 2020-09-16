import { getLogger } from 'log4js';
import { Map, Set } from 'immutable';
import { Oso } from 'oso';
import { OsoConfig } from './oso-config';
import { AuthorizationService } from './authorization.service';

jest.mock('oso');
getLogger().level = 'info';

describe(AuthorizationService.name, () => {
  // Mocks for Oso
  let mockOso: Oso;
  let mockLoadFile;

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

  let service: AuthorizationService;

  beforeEach(async () => {
    // wire up mock oso
    mockOso = new Oso();
    expect(Oso).toHaveBeenCalled(); // make sure oso is actually mocked
    mockLoadFile = jest.spyOn(mockOso, 'loadFile');
    mockLoadFile.mockReturnValue(Promise.resolve()); // default: always successfully load file


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

    service = new AuthorizationService(mockOsoConfig, mockOso);
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

    await expect(service.initialized()).resolves.not.toThrow();
  });

  it('should check for initialization errors and set Promise that rejects', async () => {
    const mockLoadFile = jest.spyOn(mockOso, 'loadFile');
    const expectedError = {msg: 'the message'};
    mockLoadFile.mockImplementation(() => new Promise<void>((resolve, reject) => reject(expectedError)));

    service = new AuthorizationService(mockOsoConfig, mockOso);
    expectedFiles.map(filename => expect(mockOso.loadFile).toHaveBeenCalledWith(filename));
    await expect(service.initialized()).rejects.toEqual(expectedError);
    // TODO: Test the case where *some* files load properly and others fail.
  });

  it('should proxy isAllowed to the backend oso instance', async () => {
    const mockActor = {a: 'a'};
    const mockAction = {b: 'b'};
    const mockResource = {c: 'c'};


    const mockIsAllowed = jest.spyOn(mockOso, 'isAllowed');
    const mockInitialized = jest.spyOn(service, 'initialized');

    await service.isAllowed(mockActor, mockAction, mockResource);

    expect(mockInitialized).toHaveBeenCalledTimes(1);
    expect(mockIsAllowed).toHaveBeenCalledWith(mockActor, mockAction, mockResource);
  });

})
;
