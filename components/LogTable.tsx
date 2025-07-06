
import React from 'react';
import { PingLog, PingStatus } from '../types';
import { SuccessIcon, FailureIcon, PingingIcon } from './Icons';

interface LogTableProps {
  logs: PingLog[];
}

const StatusIndicator: React.FC<{ status: PingStatus }> = ({ status }) => {
  switch (status) {
    case PingStatus.Success:
      return <div className="flex items-center gap-2"><SuccessIcon /> <span className="text-green-400">Success</span></div>;
    case PingStatus.Failure:
      return <div className="flex items-center gap-2"><FailureIcon /> <span className="text-red-400">Failure</span></div>;
    case PingStatus.Pinging:
      return <div className="flex items-center gap-2"><PingingIcon /> <span className="text-blue-400">Pinging...</span></div>;
    default:
      return null;
  }
};

const LogTable: React.FC<LogTableProps> = ({ logs }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex flex-col h-full shadow-lg font-fira-code">
      <h2 className="text-2xl font-bold text-gray-100 mb-4 font-sans">Ping Logs</h2>
      <div className="overflow-y-auto flex-grow pr-2">
        <table className="w-full text-left table-fixed">
          <thead className="sticky top-0 bg-gray-800/80 backdrop-blur-sm">
            <tr>
              <th className="w-1/4 py-3 px-4 font-semibold text-gray-300 text-sm">Timestamp</th>
              <th className="w-2/4 py-3 px-4 font-semibold text-gray-300 text-sm">Server</th>
              <th className="w-1/4 py-3 px-4 font-semibold text-gray-300 text-sm">Response Time</th>
              <th className="w-1/4 py-3 px-4 font-semibold text-gray-300 text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                        No logs yet. Start pinging to see results.
                    </td>
                </tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-150">
                <td className="py-3 px-4 text-gray-400 text-sm">{log.timestamp.toLocaleTimeString()}</td>
                <td className="py-3 px-4 text-blue-300 truncate text-sm">{log.server}</td>
                <td className="py-3 px-4 text-sm">
                  {log.responseTime !== null ? (
                    <span className="text-yellow-300">{`${log.responseTime} ms`}</span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-sm">
                  <StatusIndicator status={log.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogTable;
