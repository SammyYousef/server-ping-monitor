
import React, { useState, useEffect, useCallback } from 'react';
import { PingLog, PingStatus, TimeFormat } from './types';
import ControlsPanel from './components/ControlsPanel';
import LogTable from './components/LogTable';

const MAX_LOG_ENTRIES = 200;
const DEFAULT_SERVERS = "https://www.google.com\nhttps://www.github.com\nhttps://www.cloudflare.com";

const App: React.FC = () => {
  const [serverList, setServerList] = useState<string>(DEFAULT_SERVERS);
  const [servers, setServers] = useState<string[]>([]);
  const [intervalSeconds, setIntervalSeconds] = useState<number>(5);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [logs, setLogs] = useState<PingLog[]>([]);
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(TimeFormat.Local);

  const handleStart = () => {
    const serverUrls = serverList.split('\n').map(s => s.trim()).filter(Boolean);
    if (serverUrls.length === 0) {
        alert("Please enter at least one server URL.");
        return;
    }
    setServers(serverUrls);
    setLogs([]);
    setIsPinging(true);
  };

  const handleStop = useCallback(() => {
    setIsPinging(false);
  }, []);
  
  const handleClearLogs = useCallback(() => {
    if (isPinging) return;
    setLogs([]);
  }, [isPinging]);

  const handleExportLogs = useCallback(() => {
    if (logs.length === 0) {
      alert("There are no logs to export.");
      return;
    }

    // The logs state is in reverse chronological order, so we reverse it back for export.
    const sortedLogs = [...logs].reverse();

    const headers = [`Timestamp (${timeFormat.toUpperCase()})`, 'Server', 'Response Time (ms)', 'Status'];
    const csvRows = [headers.join(',')];

    sortedLogs.forEach(log => {
      // Use toLocaleString for local time to get a more user-friendly format (date and time), and wrap in quotes.
      // toISOString is standard for UTC and doesn't need quotes as it doesn't contain commas.
      const timestamp = timeFormat === TimeFormat.Local
        ? `"${log.timestamp.toLocaleString()}"`
        : log.timestamp.toISOString();

      const server = `"${log.server.replace(/"/g, '""')}"`; 
      const responseTime = log.responseTime !== null ? log.responseTime : '';
      const { status } = log;
      csvRows.push([timestamp, server, responseTime, status].join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `ping-logs-${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [logs, timeFormat]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isPinging && servers.length > 0) {
      const performPings = async () => {
        const pingPromises = servers.map(async (server) => {
          const id = `${server}-${Date.now()}`;
          const pendingLog: PingLog = {
            id,
            server,
            timestamp: new Date(),
            status: PingStatus.Pinging,
            responseTime: null
          };

          // Add a temporary "Pinging..." log
          setLogs(prev => [pendingLog, ...prev.slice(0, MAX_LOG_ENTRIES -1)]);

          const startTime = Date.now();
          try {
            // Using 'no-cors' mode allows making requests to third-party servers from the browser.
            // The browser will return an 'opaque' response if successful, which we treat as a successful ping.
            // It will only throw an error for network failures (e.g., DNS resolution failed, server unreachable).
            await fetch(server, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
            const endTime = Date.now();
            return {
              id,
              server,
              status: PingStatus.Success,
              responseTime: endTime - startTime,
              timestamp: new Date()
            };
          } catch (error) {
            return {
              id,
              server,
              status: PingStatus.Failure,
              responseTime: null,
              timestamp: new Date()
            };
          }
        });
        
        const results = await Promise.all(pingPromises);
        
        // Update logs with final results, replacing the "Pinging..." entries
        setLogs(prevLogs => {
            const newLogs = [...prevLogs];
            results.forEach(result => {
                const index = newLogs.findIndex(log => log.id === result.id);
                if (index !== -1) {
                    newLogs[index] = result;
                }
            });
            return newLogs;
        });
      };

      performPings();
      timer = setInterval(performPings, intervalSeconds * 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPinging, servers, intervalSeconds]);
  

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Server Ping Monitor</h1>
        <p className="mt-2 text-lg text-gray-400">A real-time tool to check server health and latency.</p>
        <p className="mt-2 text-sm text-gray-500">A tool by Sammy Yousef created with Google AI Studio on 6 July 2025.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-1">
          <ControlsPanel
            serverList={serverList}
            setServerList={setServerList}
            intervalSeconds={intervalSeconds}
            setIntervalSeconds={setIntervalSeconds}
            isPinging={isPinging}
            onStart={handleStart}
            onStop={handleStop}
            onClearLogs={handleClearLogs}
            onExportLogs={handleExportLogs}
            logsExist={logs.length > 0}
            timeFormat={timeFormat}
            setTimeFormat={setTimeFormat}
          />
        </div>
        <div className="lg:col-span-2 min-h-[60vh]">
          <LogTable logs={logs} timeFormat={timeFormat} />
        </div>
      </main>
    </div>
  );
};

export default App;
