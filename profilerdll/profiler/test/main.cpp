#include "profiler.h"
#include <stdio.h>
#include <iostream>
#include "windows.h"

int main()
{
	wlprofiler::init();

	while (true) {
		Sleep(1000);

		wlprofiler::startFrame();

		for (int i = 0; i < 100; ++i) {
			int idx = wlprofiler::enterFunction();

			wlprofiler::leaveFunction("funcs",idx);
		}

		wlprofiler::finishFrame();
	}

	return 0;
}