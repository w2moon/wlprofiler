#pragma once

#ifndef WL_PROFILER
#define WL_PROFILER


#define PROFILER_API _declspec(dllexport)

PROFILER_API void startFrame();
PROFILER_API void finishFrame();
PROFILER_API int enterFunction();
PROFILER_API void leaveFunction(const char* name, int timeStart);

#endif