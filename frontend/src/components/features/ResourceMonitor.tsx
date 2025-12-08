import React from 'react';
import { Cpu, HardDrive, Wifi, WifiOff, AlertTriangle, Database } from 'lucide-react';

// Define strict types matching Backend Schema
export interface SystemResources {
    cpu_percent: number;
    memory_percent: number;
    memory_total_gb: number;
    memory_available_gb: number;
    disk_percent: number;
    disk_free_gb: number;
    network_online: boolean;
}

interface ResourceMonitorProps {
    resources: SystemResources | null;
    isLoading: boolean;
}

const ProgressBar: React.FC<{ value: number; label: string; icon: React.ReactNode; colorClass?: string }> = ({
                                                                                                                 value,
                                                                                                                 label,
                                                                                                                 icon,
                                                                                                                 colorClass
                                                                                                             }) => {
    // Dynamic warning colors
    let finalColor = colorClass || "bg-primary";
    let textColor = "text-gray-600 dark:text-gray-400";

    if (value > 90) {
        finalColor = "bg-red-500";
        textColor = "text-red-500 font-bold";
    } else if (value > 75) {
        finalColor = "bg-yellow-500";
    }

    return (
        <div className="mb-3">
            <div className="flex justify-between items-center mb-1 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                    {icon} {label}
                </span>
                <span className={textColor}>{value}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${finalColor}`}
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );
};

export default function ResourceMonitor({ resources, isLoading }: ResourceMonitorProps) {
    if (isLoading || !resources) {
        return (
            <div className="animate-pulse space-y-3 opacity-50">
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
        );
    }

    return (
        <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-gray-100 dark:border-gray-800 w-full max-w-sm mx-auto mt-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">
                Live Resource Monitor
            </h3>

            {/* CPU Indicator */}
            <ProgressBar
                value={resources.cpu_percent}
                label="CPU Usage"
                icon={<Cpu size={14} />}
            />

            {/* Memory Indicator */}
            <ProgressBar
                value={resources.memory_percent}
                label={`Memory (${resources.memory_available_gb}GB free)`}
                icon={<Database size={14} />}
            />

            {/* Storage Indicator */}
            <ProgressBar
                value={resources.disk_percent}
                label={`Storage (${resources.disk_free_gb}GB free)`}
                icon={<HardDrive size={14} />}
            />

            {/* Network Indicator */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                    Connection Status
                </span>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold ${
                    resources.network_online
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                    {resources.network_online ? <Wifi size={12} /> : <WifiOff size={12} />}
                    {resources.network_online ? "Online" : "Offline Mode"}
                </div>
            </div>

            {/* Warning Section */}
            {(resources.cpu_percent > 90 || resources.memory_percent > 90) && (
                <div className="mt-3 flex items-start gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/10 p-2 rounded">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span>System under heavy load. AI processing may be slower than usual.</span>
                </div>
            )}
        </div>
    );
}