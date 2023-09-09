#pragma once

#if defined _WIN32 || defined __CYGWIN__
  #ifdef BUILDING_NGWNATIVE
    #define NGWNATIVE_PUBLIC __declspec(dllexport)
  #else
    #define NGWNATIVE_PUBLIC __declspec(dllimport)
  #endif
#else
  #ifdef BUILDING_NGWNATIVE
      #define NGWNATIVE_PUBLIC __attribute__ ((visibility ("default")))
  #else
      #define NGWNATIVE_PUBLIC
  #endif
#endif
