import React from 'react';

interface ControlsPanelProps {
  serverList: string;
  setServerList: (value: string) => void;
  intervalSeconds: number;
  setIntervalSeconds: (value: number) => void;
  isPinging: boolean;
  onStart: () => void;
  onStop: () => void;
  onClearLogs: () => void;
  onExportLogs: () => void;
  logsExist: boolean;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  serverList,
  setServerList,
  intervalSeconds,
  setIntervalSeconds,
  isPinging,
  onStart,
  onStop,
  onClearLogs,
  onExportLogs,
  logsExist,
}) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex flex-col gap-6 h-full shadow-lg">
      <h2 className="text-2xl font-bold text-gray-100">Controls</h2>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="server-list" className="font-semibold text-gray-300">Server URLs (one per line)</label>
        <textarea
          id="server-list"
          value={serverList}
          onChange={(e) => setServerList(e.target.value)}
          disabled={isPinging}
          className="bg-gray-900 border border-gray-600 rounded-md p-3 h-48 resize-y text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:opacity-50 font-fira-code"
          placeholder="https://google.com&#10;https://github.com&#10;https://some-non-existent-domain.xyz"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="ping-interval" className="font-semibold text-gray-300">Ping Interval (seconds)</label>
        <input
          type="number"
          id="ping-interval"
          min="1"
          value={intervalSeconds}
          onChange={(e) => setIntervalSeconds(Math.max(1, parseInt(e.target.value, 10)))}
          disabled={isPinging}
          className="bg-gray-900 border border-gray-600 rounded-md p-3 w-full text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-3 mt-auto pt-4">
        {!isPinging ? (
          <button
            onClick={onStart}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 shadow-md"
          >
            Start Pinging
          </button>
        ) : (
          <button
            onClick={onStop}
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition duration-200 flex items-center justify-center gap-2 shadow-md"
          >
            Stop Pinging
          </button>
        )}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClearLogs}
            disabled={!logsExist || isPinging}
            className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-700 transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Logs
          </button>
          <button
            onClick={onExportLogs}
            disabled={!logsExist}
            className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-md hover:bg-teal-700 transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;