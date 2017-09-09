// profiler.cpp : Defines the exported functions for the DLL application.
//

#include "profiler.h"
#include "vector"
#include <iostream>
#include <thread>
#include <boost/chrono/process_cpu_clocks.hpp>
#include <boost/thread/thread.hpp>
#include <boost/lockfree/spsc_queue.hpp>
#include <boost/bind.hpp>
#include <boost/shared_ptr.hpp>
#include <boost/enable_shared_from_this.hpp>
#include <boost/asio.hpp>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>
#include "windows.h"
using boost::property_tree::ptree;
using boost::property_tree::write_json;
using boost::asio::ip::tcp;
namespace wlprofiler {
	static int s_port = 4923;
	static const int MAX_FUNC_NUM = 4096;
	static const int NAME_NUM = 64;
	class tcp_connection
		: public boost::enable_shared_from_this<tcp_connection>
	{
	public:
		typedef boost::shared_ptr<tcp_connection> pointer;

		static pointer create(boost::asio::io_service& io_service)
		{
			return pointer(new tcp_connection(io_service));
		}

		tcp::socket& socket()
		{
			return socket_;
		}



		void send(std::string& msg) {
			boost::asio::write(socket_, boost::asio::buffer(msg));
		}
		~tcp_connection() {
		}
	private:
		tcp_connection(boost::asio::io_service& io_service)
			: socket_(io_service)
		{
		}



		void handle_write(const boost::system::error_code& /*error*/,
			size_t /*bytes_transferred*/)
		{
		}

		tcp::socket socket_;
	};

	class tcp_server
	{
	public:
		tcp_server(boost::asio::io_service& io_service)
			: acceptor_(io_service, tcp::endpoint(tcp::v4(), s_port))
		{
			start_accept();
		}

		void send(std::string& msg) {


			std::vector<tcp_connection::pointer>::iterator iter = connections_.begin();
			
			for (; iter != connections_.end(); ) {
				try{
					(*iter)->send(msg);
					++iter;
				}
				catch (boost::system::system_error e) {
					std::cout << e.code() << std::endl;
					iter = connections_.erase(iter);
					 
				}
			}
		}

		bool hasConnection() {
			return connections_.size() > 0;
		}

	private:
		void start_accept()
		{
			tcp_connection::pointer new_connection =
				tcp_connection::create(acceptor_.get_io_service());

			acceptor_.async_accept(new_connection->socket(),
				boost::bind(&tcp_server::handle_accept, this, new_connection,
					boost::asio::placeholders::error));
		}

		void handle_accept(tcp_connection::pointer new_connection,
			const boost::system::error_code& error)
		{
			if (!error)
			{
				connections_.push_back(new_connection);
			}

			start_accept();
		}
		std::vector<tcp_connection::pointer> connections_;
		tcp::acceptor acceptor_;
	};



	typedef boost::chrono::process_cpu_clock pclock;
	pclock::time_point s_buffers[2048];
	pclock::time_point s_frameStart;
	static int s_bufferIdx = 0;
	struct FuncInfo {
		char name[NAME_NUM];
		float elapsed;
	};
	struct FrameInfo {
		int frame;
		float elapsed;
		int funcNum;
		FuncInfo funcInfos[MAX_FUNC_NUM];
	};
	boost::lockfree::spsc_queue<FrameInfo, boost::lockfree::capacity<1024> > spsc_queue;
	static bool inited = false;
	static long s_currentFrame = 0;
	static FrameInfo sp_frameInfo;
	static bool s_running = false;

	

	void consumer(void)
	{

		boost::asio::io_service io_service;
		tcp_server server(io_service);
		FrameInfo fi;

		

		
		while (true) {
			Sleep(1);
			io_service.poll();
			while (spsc_queue.pop(fi)) {

				if (!server.hasConnection()) {
					continue;
				}
				//send  fi
				ptree pt;
				ptree pc;

				pt.put("frame", fi.frame);
				pt.put("elapsed", fi.elapsed);

				int num = fi.funcNum;
				for (int i = 0; i < num; ++i) {
					FuncInfo& info = fi.funcInfos[i];

					ptree child;
					child.put("name", info.name);
					child.put("elapsed", info.elapsed);
					pc.push_back(std::make_pair("", child));
				}
				pt.add_child("funcInfos", pc);

				std::ostringstream buf;
				write_json(buf, pt, false);
				std::string msg = buf.str();
				server.send(msg);
				
			}
		}
		
		

	}

	void init(int port) {
		inited = true;
		s_bufferIdx = 0;
		s_currentFrame = 0;
		s_port = port;
		boost::thread consumer_thread(consumer);
	}

	PROFILER_API void startFrame()
	{
		if (!inited) {
			return;
		}
		sp_frameInfo.frame = s_currentFrame;
		sp_frameInfo.elapsed = 0;
		sp_frameInfo.funcNum = 0;

		s_bufferIdx = 0;
		s_frameStart = pclock::now();
		s_running = true;
		return;
	}

	PROFILER_API void finishFrame()
	{

		if (!s_running) {
			return;
		}
		s_running = false;
		sp_frameInfo.elapsed = (pclock::now() - s_frameStart).count().real / 1000000;
		while (!spsc_queue.push(sp_frameInfo));
		s_currentFrame++;
		return;
	}

	void enterFunction() {
		if (!s_running) {
			return;
		}
		s_buffers[s_bufferIdx] = pclock::now();
		s_bufferIdx++;
	}

	void leaveFunction(const char* name) {
		if (!s_running) {
			return;
		}
		int bufferIdx = s_bufferIdx-1;
		int curIdx = sp_frameInfo.funcNum;
		FuncInfo& fi = (sp_frameInfo.funcInfos[curIdx]);
		
		fi.elapsed = (pclock::now() - s_buffers[bufferIdx]).count().real / 1000000;
		if (fi.elapsed > 0) {
			memset(fi.name, 0, NAME_NUM);
			memcpy(fi.name, name, strlen(name));
			sp_frameInfo.funcNum++;
		}
		
		s_bufferIdx--;
	}
}