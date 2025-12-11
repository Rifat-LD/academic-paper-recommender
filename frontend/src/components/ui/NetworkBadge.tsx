import React from 'react';
import { Wifi, WifiOff, RefreshCw, SignalLow } from 'lucide-react';
import { useNetworkStore } from '../../store/networkStore';

export default function NetworkBadge() {
    const { isOnline, connectionQuality, lastSynced } = useNetworkStore();

    // 1. Offline State (Automatic Activation)
    if (!isOnline) {
        return (
            <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-500 px-3 py-1 rounded-full text-sm font-semibold border border-amber-500/20 animate-pulse">
                <WifiOff size={14} />
                <span>Offline Mode</span>
            </div>
        );
    }

    // 2. Poor Connection State
    if (connectionQuality === 'poor') {
        return (
            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200 dark:border-yellow-800">
                <SignalLow size={14} />
                <span>Slow Connection</span>
            </div>
        );
    }

    // 3. Good Connection (Sync Status)
    return (
        <div className="flex items-center gap-2 text-gray-400 text-sm" title={`Last synced: ${lastSynced?.toLocaleTimeString()}`}>
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-3 py-1 rounded-full font-medium border border-green-100 dark:border-green-800/50">
                <Wifi size={14} />
                <span>Online</span>
            </div>
            {/* Optional Sync indicator */}
            <span className="text-xs ml-1 hidden sm:inline-block">
                <RefreshCw size={10} className="inline mr-1" />
                Synced
            </span>
        </div>
    );
}