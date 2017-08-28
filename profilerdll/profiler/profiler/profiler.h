#pragma once

#ifndef WL_PROFILER
#define WL_PROFILER


#define PROFILER_API _declspec(dllexport)

namespace wlprofiler {



PROFILER_API void init(int port = 4923);
PROFILER_API void startFrame();
PROFILER_API void finishFrame();
PROFILER_API void enterFunction();
PROFILER_API void leaveFunction(const char* name);

}

#endif