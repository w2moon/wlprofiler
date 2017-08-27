// profiler.cpp : Defines the exported functions for the DLL application.
//

#include "profiler.h"
#include "vector"

#include <thread>
#include <boost/chrono/process_cpu_clocks.hpp>
#include <boost/thread/thread.hpp>
#include <boost/lockfree/spsc_queue.hpp>
#include "windows.h"
typedef boost::chrono::process_cpu_clock pclock;
pclock::time_point s_buffers[2048];
pclock::time_point s_frameStart;
static int s_bufferIdx = 0;
struct FuncInfo {
	char name[256];
	long elapsed;
};
struct FrameInfo {
	int frame;
	long elapsed;
	int funcNum;
	FuncInfo funcInfos[2048];
};
boost::lockfree::spsc_queue<FrameInfo*, boost::lockfree::capacity<1024> > spsc_queue;
static bool inited = false;
static long s_currentFrame = 0;
static FrameInfo* sp_frameInfo;

void consumer(void)
{
	FrameInfo* fi;
	while (true) {
		Sleep(1);
		while (spsc_queue.pop(fi)) {
			//send  fi
		}
	}


}

void init() {
	inited = true;
	s_bufferIdx = 0;
	s_currentFrame = 0;

	boost::thread consumer_thread(consumer);
}

PROFILER_API void startFrame()
{
	if (!inited) {
		init();
	}
	sp_frameInfo = new FrameInfo();
	sp_frameInfo->frame = s_currentFrame;
	sp_frameInfo->elapsed = 0;
	sp_frameInfo->funcNum = 0;

	s_bufferIdx = 0;
	s_frameStart = pclock::now();
	return;
}

PROFILER_API void finishFrame()
{
	if (!inited) {
		return;
	}
	

	sp_frameInfo->elapsed = (pclock::now() - s_frameStart).count().real/1000000;
	while (!spsc_queue.push(sp_frameInfo));
	s_currentFrame++;
	return;
}

int enterFunction() {
	s_buffers[s_bufferIdx] = pclock::now();
	return s_bufferIdx++;
 }
void leaveFunction(const char* name, int bufferIdx) {
	int curIdx = sp_frameInfo->funcNum;
	FuncInfo& fi = (sp_frameInfo->funcInfos[curIdx]);
	memset(fi.name,0,256);
	memcpy(fi.name,name,strlen(name));
	fi.elapsed = (pclock::now() - s_buffers[bufferIdx]).count().real/1000000;
	sp_frameInfo->funcNum++;
}
