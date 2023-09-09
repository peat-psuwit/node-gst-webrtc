import GIRepository from "./@types/node-girepository-2.0";

const libNative = `${__dirname}/../lib-native`;

GIRepository.Repository.prependSearchPath(libNative);
GIRepository.Repository.prependLibraryPath(libNative);

export {};
