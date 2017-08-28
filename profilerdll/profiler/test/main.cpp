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

		

		wlprofiler::finishFrame();
	}

	return 0;
}